import { execSync } from "child_process";
import cron from "node-cron";
import { doorTopics, getRoomConfig } from "./api.js";
import { SetupMQTTConfig } from "./mqtt.js";

let configCronList = {};

let doorCommandID = [];
let doorCronJob = {};
const SetupCronPIR = () => {
  doorCronJob["onPIR"] = cron.schedule("0 8 * * *", () => RemovePirCronTab(), {
    timezone: "Asia/Ho_Chi_Minh",
  });
  doorCronJob["offPIR"] = cron.schedule("0 17 * * *", () => AddPirCronTab(), {
    timezone: "Asia/Ho_Chi_Minh",
  });
};
SetupCronPIR();

const AddPirCronTab = () => {
  for (let i = 0; i < doorTopics.length; i++) {
    doorCommandID.push(doorTopics[i]);
    let cronjob = `* * * * * mosquitto_pub -h localhost -t '${doorTopics[i]}' -m 'requestPIRStatus' -u pi -P Kou-chan1153`;
    RunGoCommand(doorTopics[i], cronjob, "create");
  }
};

const RemovePirCronTab = () => {
  if (doorCommandID.length === 0) return;
  for (let i = 0; i < doorCommandID.length; i++)
    RunGoCommand(doorCommandID[i], "", "delete");
};

const RunGoCommand = (id, cronjob, op) => {
  execSync(
    `cd /home/ubuntu/helpers/go-crontab-manipulate && ./main -id ${id} -toggle "pir" -cronjob "${cronjob}" -op ${op}`
  );
};

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
  console.log(configCronList);
};

export { CreateCron };
