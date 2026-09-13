import { fromNodeHeaders } from "better-auth/node";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { prisma } from "@/server/external/prisma";
import { createLiveSessionHandler } from "@/server/realtime/bootstrap";

export const config = { api: { bodyParser: { sizeLimit: "1kb" } } };

export default createLiveSessionHandler({
  config: () => ({
    nextAuthUrl: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET,
  }),
  identity: async (req) => {
    const session = await getServerAuthSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) return null;
    // Use the current database role, not potentially stale session claims.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });
    if (!user) return null;
    return {
      userId: user.id,
      role: user.role,
      expiresAt: new Date(session.session.expiresAt).getTime(),
    };
  },
});
