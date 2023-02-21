import axios from "axios";

const requestConfig = "https://perfect-cow-14.telebit.io/api/v1/config";
const requestYolo = "https://perfect-cow-14.telebit.io/api/v1/yolov5/";

const getAllConfig = async () => {
  let result = await axios.get(requestConfig);
  let newArr = result.data.map(obj => ({
    room: obj.room,
    loopTime: obj.loopTime,
  }));
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

export { getAllConfig, getRoomYolo };
