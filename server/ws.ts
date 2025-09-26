import { WebSocketServer, WebSocket } from "ws";
import { type Server } from "http";

let wss: WebSocketServer;

export function setupWebSocketServer(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
}

export function broadcast(message: string) {
  if (!wss) {
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
