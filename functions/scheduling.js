import cron from "node-cron";
import { client } from "../index.js";
import { getRoomYolo, getRoomDevice, getRoomConfig } from "./api.js";

let cronList = {};

const RemoveCronFromList = roomName => {
  let obj = cronList[roomName];
  if (obj !== undefined) {
    console.log("Remove this object", obj);
    obj.stop();
  }
};

const CreateCron = async roomName => {
  RemoveCronFromList(roomName);
  let roomConfig = await getRoomConfig(roomName);
  let loopTime = roomConfig.loopTime;

  let cronJob = CreateCronTask("config", loopTime, roomName);
  cronList[roomName] = cronJob;
  console.log("🚀 ~ file: scheduling.js:26 ~ CreateCron ~ cronList:", cronList);
};

const GetCronExpress = (type, time) => {
  if (type === "config" && time.search(":") === -1)
    if (time === "1") return `0 * * * *`;
    else return `0 */${time} * * *`;
  if (type === "schedule") {
  }
};

const CreateCronTask = (type, loopTime, roomName) => {
  let expression = GetCronExpress(type, loopTime);
  return cron.schedule(expression, () => ConfigMQTT(roomName), {
    timezone: "Asia/Ho_Chi_Minh",
  });
};

const ConfigMQTT = async roomName => {
  let yoloInfo = await getRoomYolo(roomName);
  client.publish(yoloInfo.subscribe, yoloInfo.request);
};

const GetYoloResponse = (roomName, message) => {
  console.log(`This topic ${roomName} has a message ${message}`);
  if (message === "0") return;
  roomName = roomName.slice(roomName.indexOf("/") + 1);
  SentDeviceRequest(roomName);
};

const SentDeviceRequest = async roomName => {
  let deviceArr = await getRoomDevice(roomName);

  for (let i = 0; i < deviceArr.length; i++) {
    console.log(deviceArr[i].subscribe);
    if (deviceArr[i].deviceModule === "Door") {
      client.publish(deviceArr[i].subscribe, deviceArr[i].request.door);
    }

    if (deviceArr[i].deviceModule === "CameraPack") {
      client.publish(deviceArr[i].subscribe, deviceArr[i].request.lightState);
      client.publish(deviceArr[i].subscribe, deviceArr[i].request.temp);
    }
  }
};

const GetDeviceResponse = (roomName, message) => {
  console.log(`This topic ${roomName} has a message ${message}`);
  if (message === "0") return;
  PushNoti(roomName);
};

const PushNoti = roomName => {};

export { CreateCron, GetYoloResponse, GetDeviceResponse };
