export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { initializeServer } = await import("@/server/init");
  initializeServer();
}
