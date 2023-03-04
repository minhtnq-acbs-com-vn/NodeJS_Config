import cron from "node-cron";

import { getRoomConfig } from "./api.js";
import { SetupMQTTConfig } from "./mqtt.js";

let configCronList = {};

const RemoveCronFromList = id => {
  if (configCronList[id] !== undefined) configCronList[id].stop();
};

const GetCronExpress = time => {
  if (time.search(":") === -1)
    if (time === "1") return `0 */ * * *`;
    else return `0 */${time} * * *`;
};

const CreateCronObject = (loopTime, id) => {
  let expression = GetCronExpress(loopTime);
  return cron.schedule(expression, () => SetupMQTTConfig(id), {
    timezone: "Asia/Ho_Chi_Minh",
  });
};

const CreateCron = async roomName => {
  RemoveCronFromList(roomName);
  let roomConfig = await getRoomConfig(roomName);
  let cronJob = CreateCronObject(roomConfig.loopTime, roomName);
  let valid = cron.validate(cronJob);
  if (valid == true) {
    configCronList[roomName] = cronJob;
    console.log("configCronList:", configCronList);
  }
};

export { CreateCron };
