import {
  ConnectBroker,
  OnConnected,
  OnMessage,
} from "./functions/callbacks.js";

const client = ConnectBroker();

client.on("connect", () => OnConnected(client));

client.on("message", (topic, message) => OnMessage(client, topic, message));

client.on("error", err => console.log(err));

client.on("reconnect", () => console.log("Reconnecting..."));

client.on("close", () => console.log("Disconnected"));

client.on("disconnect", log => console.log(log));

client.on("offline", () => console.log("Offline"));
