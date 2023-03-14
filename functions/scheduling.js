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
  let valid = cron.validate(expression);
  if (valid === true)
    return cron.schedule(expression, () => SetupMQTTConfig(id), {
      timezone: "Asia/Ho_Chi_Minh",
    });
  else return false;
};

const CreateCron = async roomName => {
  RemoveCronFromList(roomName);
  let roomConfig = await getRoomConfig(roomName);
  let cronJob = CreateCronObject(roomConfig.loopTime, roomName);
  if (cronJob !== false) configCronList[roomName] = cronJob;
};

export { CreateCron };
