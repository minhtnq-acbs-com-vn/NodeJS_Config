import cron from "node-cron";

import { getRoomConfig } from "./api.js";
import { ConfigMQTT } from "./mqtt.js";

let configCronList = {};
let scheduleCronList = {};

const RemoveCronFromList = (type, roomName) => {
  if (type === "config" && configCronList[roomName] !== undefined)
    configCronList[roomName].stop();

  if (type === "schedule" && scheduleCronList[roomName] !== undefined)
    scheduleCronList[roomName].stop();
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

const CreateCron = async (type, roomName) => {
  RemoveCronFromList(type, roomName);
  if (type === "config") {
    let roomConfig = await getRoomConfig(roomName);
    let loopTime = roomConfig.loopTime;
    let cronJob = CreateCronTask(type, loopTime, roomName);
    configCronList[roomName] = cronJob;
  }
  if (type === "schedule") {
  }
};

export { CreateCron };
