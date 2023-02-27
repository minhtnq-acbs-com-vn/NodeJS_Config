import { client } from "../index.js";
import { subTopic } from "../config/init.js";
import {
  CreateCron,
  GetDeviceResponse,
  GetYoloResponse,
} from "./scheduling.js";
import { getAllRoomDevices, getAllYolo } from "./api.js";

let yolosTopic = [];
let devicesTopic = [];

const SubscribeToYolos = async () => {
  let yoloArr = await getAllYolo();
  for (let i = 0; i < yoloArr.length; i++) {
    client.subscribe(yoloArr[i]);
  }
  yolosTopic = yoloArr;
};

const SubscribeToDevices = async () => {
  let devicesArr = await getAllRoomDevices();
  for (let i = 0; i < devicesArr.length; i++) {
    client.subscribe(devicesArr[i]);
  }
  devicesTopic = devicesArr;
};

const SubscribeToTopics = async () => {
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
    CreateCron(message.slice(message.indexOf(":") + 1));
  }
  if (message === "schedule") {
  }
};

export { SubscribeToTopics, RequestHandler };
