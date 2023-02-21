import cron from "node-cron";
import { client } from "./callbacks.js";
import { getRoomYolo, getRoomDevice } from "./api.js";
import { messArr } from "./eventHandler.js";

let cronList = [];

const action1 = () => {
  console.log("run 2 every second");
};

const job1 = cron.schedule("*/2 * * * * *", action1, {
  timezone: "Asia/Ho_Chi_Minh",
});

const action2 = () => {
  console.log("run every second");
};

const job2 = cron.schedule("* * * * * *", action2, {
  timezone: "Asia/Ho_Chi_Minh",
});

const CreateConfigCron = configArr => {
  if (cronList.length > 0) {
    for (let i = 0; i < cronList.length; i++) cronList[i].stop();
    cronList = [];
  }
  for (let i = 0; i < configArr.length; i++) {
    let roomName = configArr[i].room;
    let loopTime = configArr[i].loopTime;
    let index = i;
    index = CreateCronTask(
      GetCronExpress("config", loopTime),
      ConfigMQTT(roomName)
    );
    cronList.push(index);
  }
};

const GetCronExpress = (type, time) => {
  if (type === "config" && time.search(":") === -1) return `* */${time} * * *`;
  if (type === "schedule") {
  }
};

const CreateCronTask = (expression, func) => {
  return cron.schedule(expression, func, { timezone: "Asia/Ho_Chi_Minh" });
};

const ConfigMQTT = async roomName => {
  let yoloInfo = await getRoomYolo(roomName);
  let request = yoloInfo.request;
  let topic = yoloInfo.subscribe;
  client.publish(topic, request);
  //wait for yolo response
};

const GetYoloResponse = async message => {
  if ("1" in messArr) {
    let roomNeedToCheck = message.room;
    GetDeviceResponse(roomNeedToCheck);
  }
};

const GetDeviceResponse = async roomName => {
  let deviceObj = await getRoomDevice(roomName);
  // Get device subscribe topic
  for (let i = 0; i < deviceObj.length; i++) {
    deviceRequestPacket = deviceObj[i].request;
    client.publish(deviceObj[i].subscribe, deviceRequestPacket);
  }
  // wait for device reponse
  // if response have a module that is unlocked or not turn off -> push noti
  // if ("0 || unlocked") push noti about that module to user
};

const PushNoti = () => {};
