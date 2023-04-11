import { client } from "../config.js";
import { checkOfficeHour } from "./helper.js";
import {
  getAllYolo,
  getAllRoomDevices,
  getRoomDevice,
  getRoomYolo,
  triggerPushNoti,
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

const SentDeviceRequest = async (roomName, uid) => {
  let deviceArr = await getRoomDevice(roomName, uid);

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

const GetYoloResponse = (topic, message) => {
  console.log("yolo response: ", message);
  let uid = topic.slice(0, topic.indexOf("/"));
  let roomName = topic.slice(topic.lastIndexOf("/") + 1);
  let officeHour = checkOfficeHour();
  if (officeHour && message === "1") return;
  SentDeviceRequest(roomName, uid);
};

const GetDeviceResponse = async (topic, message) => {
  console.log("device response: ", message);
  let officeHour = checkOfficeHour();
  let uid = topic.slice(0, topic.indexOf("/"));
  let module = topic.slice(topic.indexOf("/") + 1, topic.lastIndexOf("/"));
  let roomName = topic.slice(topic.lastIndexOf("/") + 1);
  let sensor = message.slice(0, message.indexOf(":"));
  let response = message.slice(message.indexOf(":") + 1);

  console.log("office hour:", officeHour);

  if (!officeHour) {
    if (module === "Door" && sensor === "pir" && response !== "0") {
      let yoloInfo = await getRoomYolo(roomName, uid);
      client.publish(yoloInfo.subscribe, yoloInfo.request);
      await PushNoti(uid, roomName, sensor);
    }
  }

  if (module === "Door" && sensor === "door" && response !== "0") {
    await PushNoti(uid, roomName, sensor);
  }

  if (module === "CameraPack") {
    if (sensor === "temp" && parseInt(response) < 29) {
      await PushNoti(uid, roomName, sensor);
    }
    if (sensor === "light" && response !== "0") {
      await PushNoti(uid, roomName, sensor);
    }
  }
};

const PushNoti = async (uid, roomName, sensor) => {
  let data = "";
  if (sensor === "door") {
    data = `In room ${roomName}: ${sensor} is not locked`;
  }
  if (sensor === "light") {
    data = `In room ${roomName}: ${sensor} is not turnoff`;
  }
  if (sensor === "temp") {
    data = `In room ${roomName}: AC is not turnoff`;
  }
  if (sensor === "pir") {
    data = `In room ${roomName}: Detect movement outside of working hours`;
  }
  console.log("push noti data", uid, data);
  let result = await triggerPushNoti(uid, data);
  if (!result) console.log("failed to send noti");
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
