import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSession } from "@/server/auth/auth-client";
import { useUser } from "../hooks/useUser";
import type { RouteOutput } from "@/types/types";
import { routes } from "@/utils/routes";
import { UserRole } from "@/generated/prisma";

export type ProtectedRouteProps = {
  children?: React.ReactNode;
  unauthenticatedOnly?: boolean;
  eventEditorOnly?: boolean;
  superadminOnly?: boolean;
  /**
   * By default, users are only denied access after the session has loaded. By
   * setting this to true, you can deny users access even when their session
   * has not yet loaded.
   */
  denyAccessOnLoading?: boolean;
};

export function ProtectedRoute(props: ProtectedRouteProps) {
  const {
    unauthenticatedOnly,
    eventEditorOnly,
    superadminOnly,
    denyAccessOnLoading,
  } = props;
  const user = useUser();
  const session = useSession();

  const redirect = getRedirectIfAccessBlocked({
    isLoading: session.isPending || user.isLoading,
    user: user.data,
    options: {
      unauthenticatedOnly,
      eventEditorOnly,
      superadminOnly,
      denyAccessOnLoading,
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  if (redirect) return <></>;

  return <>{props.children}</>;
}

function getRedirectIfAccessBlocked({
  isLoading,
  user,
  options,
}: {
  isLoading: boolean;
  user?: RouteOutput["profile"]["get"];
  options: ProtectedRouteProps;
}) {
  // Handle loading
  if (isLoading) {
    if (options.denyAccessOnLoading) return routes.auth.login;
    return;
  }

  // Unauthenticated: allow only if unauthenticated only is true.
  if (!user) {
    if (options.unauthenticatedOnly) return;
    return routes.auth.login;
  }

  // Deny if unauthenticated only is true and user is authenticated.
  if (options.unauthenticatedOnly) {
    return routes.landingPage;
  }

  const canEditEvents =
    user.role === UserRole.event_editor || user.role === UserRole.superadmin;

  if (options.eventEditorOnly && !canEditEvents) {
    return routes.landingPage;
  }

  if (options.superadminOnly && user.role !== UserRole.superadmin) {
    return routes.landingPage;
  }
}
