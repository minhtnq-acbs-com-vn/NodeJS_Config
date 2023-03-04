import { execSync } from "child_process";
import { client } from "../index.js";
import { subTopic } from "../config/init.js";
import { CreateCron } from "./scheduling.js";
import {
  devicesTopic,
  yolosTopic,
  SubscribeToYolos,
  SubscribeToDevices,
  GetDeviceResponse,
  GetYoloResponse,
  SentDeviceRequest,
} from "./mqtt.js";

const SubscribeToTopics = async () => {
  // execSync('cd "C:/Users/potat/AppData/Roaming/BetterDiscord/themes/" && go run main.go')
  client.subscribe(subTopic);
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
    CreateCron("config", message.slice(message.indexOf(":") + 1));
  }
  if (
    message.startsWith("schedule") &&
    message.search(":") !== -1 &&
    message.search("-") !== -1
  ) {
    CreateCron("schedule", message);
  }
};

export { SubscribeToTopics, RequestHandler };
