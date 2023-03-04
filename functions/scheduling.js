import cron from "node-cron";

import { getRoomConfig, getSchedule } from "./api.js";
import { SetupMQTTConfig } from "./mqtt.js";

let configCronList = {};
let scheduleCronList = {};

const RemoveCronFromList = (type, id) => {
  if (type === "config" && configCronList[id] !== undefined)
    configCronList[id].stop();

  // if (type === "schedule") {
  //   let docID = id.slice(id.indexOf(":") + 1, id.indexOf("-"));
  //   if (scheduleCronList[docID] !== undefined) {
  //     scheduleCronList[docID].stop();
  //   }
  // }
};

const GetCronExpress = (type, time) => {
  if (type === "config" && time.search(":") === -1)
    if (time === "1") return `*/30 * * * * *`;
    else return `0 */${time} * * *`;
  // if (type === "schedule") {
  //   return `0 * * * ${time.dayOfTheWeek}`;
  // }
};

const CreateCronObject = (type, loopTime, id) => {
  let expression = GetCronExpress(type, loopTime);
  if (type === "config") {
    let roomName = id;
    return cron.schedule(expression, () => SetupMQTTConfig(roomName), {
      timezone: "Asia/Ho_Chi_Minh",
    });
  }
  // if (type === "schedule") {
  // }
};

const CreateCron = async (type, id) => {
  RemoveCronFromList(type, id);
  if (type === "config") {
    let roomName = id;
    let roomConfig = await getRoomConfig(roomName);
    let loopTime = roomConfig.loopTime;
    let cronJob = CreateCronObject(type, loopTime, roomName);
    configCronList[roomName] = cronJob;
    console.log(
      "🚀 ~ file: scheduling.js:50 ~ CreateCron ~ configCronList:",
      configCronList
    );
  }
  // if (type === "schedule") {
  //   let docID = id.slice(id.indexOf(":") + 1, id.indexOf("-"));
  //   let docOp = id.slice(id.indexOf("-") + 1);
  //   if (docOp === "delete") return;
  //   let schedule = await getSchedule(docID);
  //   let cronJob = CreateCronObject(
  //     type,
  //     {
  //       dayOfTheWeek: schedule.dayOfTheWeek,
  //       timeOn: schedule.timeOn,
  //       timeOff: schedule.timeOff,
  //       repeat: schedule.repeat,
  //     },
  //     { roomName: schedule.room, request: schedule.request }
  //   );
  //   scheduleCronList[docID] = cronJob;
  // }
};

export { CreateCron };
