import axios from "axios";

const requestConfig = "https://perfect-cow-14.telebit.io/api/v1/config";
const requestYolo = "https://perfect-cow-14.telebit.io/api/v1/yolov5/";
const requestAllYolo = "https://perfect-cow-14.telebit.io/api/v1/yolov5";
const requestRoomDevice =
  "https://perfect-cow-14.telebit.io/api/v1/room/device/";

const getAllConfig = async () => {
  let result = await axios.get(requestConfig);
  let newArr = result.data.map(obj => ({
    room: obj.room,
    loopTime: obj.loopTime,
  }));
  return newArr;
};

const getAllYolo = async () => {
  let result = await axios.get(requestAllYolo);
  let newArr = [];
  for (let i = 0; i < result.length; i++) newArr.push(result[i].publish);
  return newArr;
};

const getRoomYolo = async roomName => {
  let result = await axios.get(requestYolo + roomName);
  let newArr = result.data.map(obj => ({
    subscribe: obj.subscribe,
    publish: obj.publish,
    request: obj.request[0],
  }));
  return newArr[0];
};

const getRoomDevice = async roomName => {
  let result = await axios.get(requestRoomDevice + roomName);
  let newArr = result.data.map(obj => ({
    subscribe: obj.topic.subscribe,
    publish: obj.topic.publish,
    ackTopic: obj.topic.ack,
    request: obj.request,
    ack: obj.ack,
  }));
  return newArr;
};

export { getAllConfig, getAllYolo, getRoomYolo, getRoomDevice };
