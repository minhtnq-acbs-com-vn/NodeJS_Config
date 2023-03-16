import { client } from "../config.js";
import { CreateCron } from "./scheduling.js";
import {
  devicesTopic,
  yolosTopic,
  SubscribeToYolos,
  SubscribeToDevices,
  GetDeviceResponse,
  GetYoloResponse,
} from "./mqtt.js";

const SubscribeToTopics = async () => {
  client.subscribe(process.env.subTopic);
  await SubscribeToYolos();
  await SubscribeToDevices();
  console.log("Wait for messages");
};

const RequestHandler = (topic, message) => {
  console.log("", topic, message);
  if (devicesTopic.includes(topic) === true) {
    GetDeviceResponse(topic, message);
  }
  if (yolosTopic.includes(topic) === true) {
    GetYoloResponse(topic, message);
  }
  if (message.startsWith("config") && message.search(":") !== -1) {
    CreateCron(message.slice(message.indexOf(":") + 1));
  }
};

export { SubscribeToTopics, RequestHandler };
