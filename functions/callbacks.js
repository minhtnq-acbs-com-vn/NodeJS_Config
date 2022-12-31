import { mqtt, brokerConfig } from "../config/init.js";

import { RequestHandler, SubscribeToTopics } from "./eventHandler.js";

const ConnectBroker = () => {
  return mqtt.connect(brokerConfig);
};

const OnConnected = client => {
  console.log(`Connected to: ${brokerConfig.host}`);
  SubscribeToTopics(client);
};

const OnMessage = (client, topic, message) => {
  console.log(topic, message.toString());
  RequestHandler(client, topic, message.toString());
};

export { ConnectBroker, OnConnected, OnMessage };
