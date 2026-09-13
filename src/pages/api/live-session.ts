import { fromNodeHeaders } from "better-auth/node";
import { getServerManagementSession } from "@/server/common/get-server-management-session";
import { prisma } from "@/server/external/prisma";
import { createLiveSessionHandler } from "@/server/realtime/bootstrap";

export const config = { api: { bodyParser: { sizeLimit: "1kb" } } };

export default createLiveSessionHandler({
  config: () => ({
    nextAuthUrl: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET,
  }),
  identity: async (req) => {
    const managementSession = await getServerManagementSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!managementSession) return null;
    // Use the current database role, not potentially stale session claims.
    const user = await prisma.managementUser.findUnique({
      where: { id: managementSession.user.id },
      select: { id: true, role: true },
    });
    if (!user) return null;
    return {
      userId: user.id,
      role: user.role,
      expiresAt: new Date(managementSession.session.expiresAt).getTime(),
    };
  },
});
