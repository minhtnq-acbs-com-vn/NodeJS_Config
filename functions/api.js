import axios from "axios";

const request = async () => {
  let response = await axios.post(process.env.requestToken, {
    email: process.env.email,
    password: process.env.password,
  });
  return response.headers.auth;
};

const getAllConfig = async roomName => {
  let token = await request();
  let result = await axios.get(process.env.requestConfig + roomName, {
    headers: {
      auth: token,
    },
  });
  let newArr = result.data.map(obj => ({
    room: obj.room,
    loopTime: obj.loopTime,
  }));
  return newArr;
};

const getAllYolo = async () => {
  let token = await request();
  let result = await axios.get(process.env.requestAllYolo, {
    headers: {
      auth: token,
    },
  });
  let newArr = [];
  for (let i = 0; i < result.data.length; i++)
    newArr.push(result.data[i].publish);
  return newArr;
};

const getRoomYolo = async roomName => {
  let token = await request();
  let result = await axios.get(process.env.requestYolo + roomName, {
    headers: {
      auth: token,
    },
  });
  let newArr = result.data.map(obj => ({
    subscribe: obj.subscribe,
    publish: obj.publish,
    request: obj.request[0],
  }));
  return newArr[0];
};

const getRoomDevice = async roomName => {
  let token = await request();
  let result = await axios.get(process.env.requestRoomDevice + roomName, {
    headers: {
      auth: token,
    },
  });
  let newArr = result.data.map(obj => ({
    deviceModule: obj.deviceModule,
    subscribe: obj.topic.subscribe,
    publish: obj.topic.publish,
    ackTopic: obj.topic.ack,
    request: obj.request,
    ack: obj.ack,
  }));

  return newArr;
};

const getRoomConfig = async roomName => {
  let token = await request();
  let result = await axios.get(process.env.requestRoomConfig + roomName, {
    headers: {
      auth: token,
    },
  });
  return result.data;
};

let doorTopics = [];

const getAllRoomDevices = async () => {
  let token = await request();
  let result = await axios.get(process.env.requestGetAllRoom, {
    headers: {
      auth: token,
    },
  });
  let roomList = result.data.uniqueRoom;
  let filtered = [];

  for (let i = 0; i < roomList.length; i++) {
    filtered.push(await getRoomDevice(roomList[i]));
  }

  let newArr = [];
  for (let i = 0; i < filtered.length; i++) {
    for (let j = 0; j < filtered[i].length; j++) {
      newArr.push(filtered[i][j].publish);
      if (filtered[i][j].deviceModule === "Door")
        doorTopics.push(filtered[i][j].subscribe);
    }
  }
  return newArr;
};

export {
  doorTopics,
  getAllConfig,
  getAllYolo,
  getRoomYolo,
  getRoomDevice,
  getRoomConfig,
  getAllRoomDevices,
};
