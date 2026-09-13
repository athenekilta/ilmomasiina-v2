import { managementAuth } from "@/server/auth";
import { toNodeHandler } from "better-auth/node";

export const config = { api: { bodyParser: false } };
export default toNodeHandler(managementAuth.handler);
