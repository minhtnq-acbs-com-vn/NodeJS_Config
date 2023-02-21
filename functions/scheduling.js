import cron from "node-cron";
import { client } from "./callbacks.js";
import { getRoomYolo } from "./api.js";

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
};
