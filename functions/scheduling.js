import cron from "node-cron";
import { client } from "../index.js";
import { getRoomYolo, getRoomDevice, getRoomConfig } from "./api.js";

let cronList = [{}];

const RemoveCronFromList = roomName => {
  let obj = cronList.find(o => o.roomName === roomName);
  console.log("🚀 ~ file: scheduling.js:10 ~ RemoveCronFromList ~ obj:", obj);
  if (obj !== undefined) {
    obj.stop();
  }
};

const CreateCron = async roomName => {
  RemoveCronFromList(roomName);
  let roomConfig = await getRoomConfig(roomName);
  let loopTime = roomConfig.loopTime;

  cronJob = CreateCronTask(
    GetCronExpress("config", loopTime),
    ConfigMQTT(roomName)
  );
  cronList.push({ roomName: cronJob });
};

const GetCronExpress = (type, time) => {
  if (type === "config" && time.search(":") === -1)
    if (time === "1") return `* */ * * *`;
    else return `* */${time} * * *`;
  if (type === "schedule") {
  }
};

const CreateCronTask = (expression, func) => {
  return cron.schedule(expression, func, { timezone: "Asia/Ho_Chi_Minh" });
};

const ConfigMQTT = async roomName => {
  let yoloInfo = await getRoomYolo(roomName);
  let request = yoloInfo.request[0];
  let topic = yoloInfo.subscribe;
  client.publish(topic, request);
  console.log("🚀 ~ file: scheduling.js:42 ~ ConfigMQTT ~ request:", request);
};

const GetYoloResponse = async (roomName, message) => {
  console.log(`This topic ${roomName} has a message ${message}`);
  if (message === "0") return;
  roomName = roomName.slice(roomName.indexOf("/") + 1);
  GetDeviceResponse(roomName);
};

const GetDeviceResponse = async roomName => {
  let deviceArr = await getRoomDevice(roomName);

  let requiredTopicPackets = [];

  for (let i = 0; i < deviceArr.length; i++) {
    if (deviceArr[i].deviceModule === "Door") {
      let topic = deviceArr[i].subscribe;
      requiredTopicPackets.push({ topic: deviceArr[i].request.Door });
    }
    if (deviceArr[i].deviceModule === "CameraPack") {
      requiredTopicPackets.push({ topic: deviceArr[i].request.Temp });
      requiredTopicPackets.push({ topic: deviceArr[i].request.LightState });
    }
  }

  console.log(
    "🚀 ~ file: scheduling.js:58 ~ GetDeviceResponse ~ requiredTopicPackets:",
    requiredTopicPackets
  );
  //   client.publish(deviceObj[i].subscribe, deviceRequestPacket.door);
};

const PushNoti = () => {};

export { CreateCron, GetYoloResponse };
