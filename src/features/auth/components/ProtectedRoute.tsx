import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "../hooks/useUser";
import { useWrapRef } from "@/hooks/useWrapRef";
import type { RouteOutput } from "@/types/types";
import { routes } from "@/utils/routes";

export type ProtectedRouteProps = {
  children?: React.ReactNode;
  unauthenticatedOnly?: boolean;
  adminOnly?: boolean;
  /**
   * By default, users are only denied access after the session has loaded. By
   * setting this to true, you can deny users access even when their session
   * has not yet loaded.
   */
  denyAccessOnLoading?: boolean;
};

export function ProtectedRoute(props: ProtectedRouteProps) {
  const propsRef = useWrapRef(props);
  const user = useUser();
  const session = useSession();

  const [redirect, setRedirect] = useState(
    getRedirectIfAccessBlocked({
      isLoading: session.status === "loading" || user.isLoading,
      user: user.data,
      options: propsRef.current,
    })
  );
  useEffect(() => {
    setRedirect(
      getRedirectIfAccessBlocked({
        isLoading: session.status === "loading" || user.isLoading,
        user: user.data,
        options: propsRef.current,
      })
    );
  }, [setRedirect, propsRef, user, session]);

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

  // Deny if admin only is true and user is not an admin.
  if (options.adminOnly && !user.role.includes("admin")) {
    return routes.landingPage;
  }
}
