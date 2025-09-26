import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Firebase handles data storage directly from the client
  // No server-side API routes needed for this implementation
  
  const httpServer = createServer(app);

  return httpServer;
}
