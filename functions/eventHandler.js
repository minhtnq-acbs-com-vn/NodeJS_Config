import { client } from "./callbacks.js";
import { subTopic } from "../config/init.js";
import { getAllConfig } from "./api.js";

const SubscribeToTopics = () => {
  console.log("subscribe to", subTopic);
  client.subscribe(subTopic);
};

const RequestHandler = (topic, message) => {
  if (topic !== subTopic) return;
  if (message === "config") ConfigHandler();
  if (message === "schedule") ScheduleHandler();
};

const ConfigHandler = async () => {
  let configs = await getAllConfig();
  console.log("", configs);
};

const ScheduleHandler = async () => {};

export { SubscribeToTopics, RequestHandler };
