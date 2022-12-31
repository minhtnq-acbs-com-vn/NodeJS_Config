import { mqtt, brokerConfig } from "../config/init.js";

import { RequestHandler, SubscribeToTopics } from "./helper.js";

const ConnectBroker = () => {
  return mqtt.connect(brokerConfig);
};

const OnConnected = client => {
  console.log(`Connected to: ${brokerConfig.host}`);
  SubscribeToTopics(client);
};

const OnMessage = (topic, message) => {
  console.log(topic, message.toString());
  RequestHandler(topic, message.toString());
};

export { ConnectBroker, OnConnected, OnMessage };
