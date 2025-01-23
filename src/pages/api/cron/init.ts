import { type NextApiRequest, type NextApiResponse } from "next";
import { initializeServer } from "../../../server/init";

// This is a dummy API route that will be called once when the server starts
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'development') {
    initializeServer();
  }
  res.status(200).json({ status: 'ok' });
} 