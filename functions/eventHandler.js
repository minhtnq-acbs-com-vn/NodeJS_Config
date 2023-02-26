import { client } from "../index.js";
import { subTopic } from "../config/init.js";
import { CreateCron, GetYoloResponse } from "./scheduling.js";
import { getAllYolo } from "./api.js";

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
  let yoloArr = await getAllYolo();
  for (let i = 0; i < yoloArr.length; i++) {
    client.subscribe(yoloArr[i]);
  }
  yolosTopic = yoloArr;
};

const SubscribeToTopics = () => {
  client.subscribe(subTopic);
  SubscribeToYolos();
  console.log("Wait for messages");
};

const RequestHandler = (topic, message) => {
  console.log("🚀 ~ file: eventHandler.js:32 ~ RequestHandler ~ topic:", topic)
  if (yolosTopic.includes(topic) === true) {
    GetYoloResponse(topic, message);
  }
  if (message.startsWith("config") && message.search(":") !== -1) {
    CreateCron(message.slice(message.indexOf(":") + 1));
  }
  if (message === "schedule") {
    ScheduleHandler();
  }
};

const ScheduleHandler = async () => {};

export { SubscribeToTopics, RequestHandler };
