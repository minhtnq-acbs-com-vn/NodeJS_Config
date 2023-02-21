import { client } from "./callbacks.js";
import { subTopic } from "../config/init.js";
import { getAllConfig, getAllYolo } from "./api.js";

let messArr = [];

const SubscribeToTopics = () => {
  console.log("subscribe to", subTopic);
  client.subscribe(subTopic);
};

const RequestHandler = (topic, message) => {
  let requiredTopics = getAllYolo();
  if (topic in requiredTopics) {
    messArr.push(message);
    // wait for more packets - based on time should be easier but ideally would be based on the length of requiredTopics since it represents the amout of yolo instances
  }
  if (topic !== subTopic) return;
  if (message === "config") ConfigHandler();
  if (message === "schedule") ScheduleHandler();
};

const ConfigHandler = async () => {
  let configs = await getAllConfig();
  console.log("", configs);
};

const ScheduleHandler = async () => {};

export { messArr, SubscribeToTopics, RequestHandler };
