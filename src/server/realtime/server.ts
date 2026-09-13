import "dotenv/config";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createGateway } from "./gateway";
import { PgLiveListener } from "./listener";
import { canonicalOrigin, requireLiveSecret } from "./ticket";

export async function startLiveServer(env: NodeJS.ProcessEnv = process.env) {
  const nextAuthUrl = canonicalOrigin(env.NEXTAUTH_URL);
  const secret = requireLiveSecret(env.NEXTAUTH_SECRET);
  if (!env.DATABASE_URL)
    throw new Error("DATABASE_URL is required for live updates");
  const port = Number(env.LIVE_PORT ?? "3001");
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("LIVE_PORT must be an integer from 1 to 65535");
  const host = env.LIVE_HOST ?? "127.0.0.1";
  const listener = new PgLiveListener({
    connectionString: env.DATABASE_URL,
    log: (message) => console.warn(message),
  });
  const gateway = createGateway({ listener, nextAuthUrl, secret });
  try {
    await gateway.listen(port, host);
  } catch (error) {
    await gateway.close();
    throw error;
  }
  console.info(`Live gateway listening on ${host}:${port}`);
  return gateway;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  startLiveServer()
    .then((gateway) => {
      const shutdown = () => {
        const deadline = setTimeout(() => process.exit(1), 5000);
        deadline.unref();
        void gateway
          .close()
          .then(() => {
            clearTimeout(deadline);
          })
          .catch(() => process.exit(1));
      };
      process.once("SIGINT", shutdown);
      process.once("SIGTERM", shutdown);
    })
}
