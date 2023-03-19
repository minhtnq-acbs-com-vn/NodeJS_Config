import { client } from "../config.js";
import { checkOfficeHour } from "./helper.js";
import { getAllYolo, getAllRoomDevices, getRoomDevice } from "./api.js";

let yolosTopic = [];
let devicesTopic = [];

const SubscribeToYolos = async () => {
  let yoloArr = await getAllYolo();
  for (let i = 0; i < yoloArr.length; i++) {
    client.subscribe(yoloArr[i]);
  }
  yolosTopic = yoloArr;
};

const SubscribeToDevices = async () => {
  let devicesArr = await getAllRoomDevices();
  for (let i = 0; i < devicesArr.length; i++) {
    client.subscribe(devicesArr[i]);
  }
  devicesTopic = devicesArr;
};

const SentDeviceRequest = async roomName => {
  let deviceArr = await getRoomDevice(roomName);

  for (let i = 0; i < deviceArr.length; i++) {
    if (deviceArr[i].deviceModule === "Door") {
      client.publish(deviceArr[i].subscribe, deviceArr[i].request.door);
    }

    if (deviceArr[i].deviceModule === "CameraPack") {
      client.publish(deviceArr[i].subscribe, deviceArr[i].request.lightState);
      client.publish(deviceArr[i].subscribe, deviceArr[i].request.temp);
    }
  }
};

const GetYoloResponse = (roomName, message) => {
  console.log("yolo response: ", message);
  if (message === "0") return;
  roomName = roomName.slice(roomName.indexOf("/") + 1);
  SentDeviceRequest(roomName);
};

const GetDeviceResponse = async (roomName, message) => {
  console.log("device response: ", message);
  let officeHour = checkOfficeHour();
  let module = roomName.slice(0, roomName.indexOf("/"));
  let sensor = message.slice(0, message.indexOf(":"));
  let response = message.slice(message.indexOf(":") + 1);

  if (officeHour === false && module === "Door") {
    if (sensor === "pir" && response !== "0")
      await SetupMQTTConfig(roomName.slice(roomName.indexOf("/" + 1)));
    return;
  }

  if (module === "pir") return;
  if (response === "0") return;
  if (module === "Temp" && parseInt(response) > 28) return;
  PushNoti(roomName.slice(roomName.indexOf("/") + 1), sensor);
};

const PushNoti = (roomName, module) => {
  console.log("push noti is running");
};

export {
  yolosTopic,
  devicesTopic,
  SubscribeToYolos,
  SubscribeToDevices,
  SentDeviceRequest,
  GetYoloResponse,
  GetDeviceResponse,
};
