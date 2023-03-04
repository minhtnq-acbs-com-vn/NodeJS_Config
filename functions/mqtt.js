import { client } from "../index.js";
import {
  getAllYolo,
  getAllRoomDevices,
  getRoomYolo,
  getRoomDevice,
} from "./api.js";

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

const SetupMQTTConfig = async roomName => {
  let yoloInfo = await getRoomYolo(roomName);
  client.publish(yoloInfo.subscribe, yoloInfo.request);
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
  if (message === "0") return;
  roomName = roomName.slice(roomName.indexOf("/") + 1);
  SentDeviceRequest(roomName);
};

const GetDeviceResponse = (roomName, message) => {
  if (message === "0") return;
  roomName = roomName.slice(roomName.indexOf("/") + 1);
  PushNoti(roomName);
};

const PushNoti = roomName => {
  console.log("push noti is running");
};

export {
  yolosTopic,
  devicesTopic,
  SubscribeToYolos,
  SubscribeToDevices,
  SetupMQTTConfig,
  SentDeviceRequest,
  GetYoloResponse,
  GetDeviceResponse,
};
