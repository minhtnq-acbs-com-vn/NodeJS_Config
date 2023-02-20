import { mqtt, brokerConfig } from "../config/init.js";

import { RequestHandler, SubscribeToTopics } from "./eventHandler.js";

const ConnectBroker = () => mqtt.connect(brokerConfig);

const OnConnected = client => SubscribeToTopics(client);

const OnMessage = (client, topic, message) =>
  RequestHandler(client, topic, message.toString());

export { ConnectBroker, OnConnected, OnMessage };
