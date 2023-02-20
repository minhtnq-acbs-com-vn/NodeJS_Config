import { subTopic } from "../config/init.js";
import { getAllConfig, getAllYolo } from "./api.js";

const SubscribeToTopics = client => {
  console.log("subscribe to", subTopic);
  client.subscribe(subTopic);
};

const RequestHandler = (client, topic, message) => {
  if (topic !== subTopic) return;
  if (message === "config") ConfigHandler(client);
  if (message === "schedule") ScheduleHandler(client);
};

const ConfigHandler = async client => {
  let configs = await getAllConfig();
  console.log("", configs);
};

const ScheduleHandler = async client => {};

export { SubscribeToTopics, RequestHandler };
