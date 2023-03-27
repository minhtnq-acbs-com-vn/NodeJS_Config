import cron from "node-cron";
import { doorTopics, getRoomConfig, getRoomYolo } from "./api.js";
import { RunGoCommand } from "./helper.js";

const SetupCronPIR = () => {
  RunGoCommand(
    "initPir",
    "on",
    `0 8 * * * mosquitto_pub -h localhost -t '${process.env.subTopic}' -m 'AddPirCronTab' -u '${process.env.brokerUname}' -P '${process.env.brokerPassword}'`,
    "create"
  );

  RunGoCommand(
    "deletePir",
    "off",
    `0 17 * * * mosquitto_pub -h localhost -t '${process.env.subTopic}' -m 'RemovePirCronTab' -u '${process.env.brokerUname}' -P '${process.env.brokerPassword}'`,
    "create"
  );
};

const AddPirCronTab = () => {
  for (let i = 0; i < doorTopics.length; i++) {
    let cronjob = `* * * * * mosquitto_pub -h localhost -t '${doorTopics[i]}' -m 'requestPIRStatus' -u '${process.env.brokerUname}' -P '${process.env.brokerPassword}'`;
    RunGoCommand(doorTopics[i], "pir", cronjob, "create");
  }
};

const RemovePirCronTab = () => {
  for (let i = 0; i < doorTopics.length; i++) {
    RunGoCommand(doorTopics[i], "pir", "", "delete");
  }
};

const RemoveCronFromList = id => {
  RunGoCommand(id, "config", "", "delete");
};

const GetCronExpress = time => {
  if (time.search(":") === -1)
    if (time === "1") return `0 * * * *`;
    else return `0 */${time} * * *`;
};

const CreateCronObject = async (loopTime, id, uid) => {
  let expression = GetCronExpress(loopTime);
  let valid = cron.validate(expression);
  if (valid === false) return;
  let yoloInfo = await getRoomYolo(id, uid);
  let cronjob = `${expression} mosquitto_pub -h localhost -t '${yoloInfo.subscribe}' -m '${yoloInfo.request}' -u '${process.env.brokerUname}' -P '${process.env.brokerPassword}'`;
  RunGoCommand(id, "config", cronjob, "create");
};

const CreateCron = async message => {
  let roomName = message.slice(message.indexOf(":") + 1, message.indexOf("@"));
  let uid = message.slice(message.indexOf("@") + 1);
  RemoveCronFromList(roomName);
  let roomConfig = await getRoomConfig(roomName, uid);
  CreateCronObject(roomConfig.loopTime, roomName, uid);
};

export { SetupCronPIR, CreateCron, AddPirCronTab, RemovePirCronTab };
