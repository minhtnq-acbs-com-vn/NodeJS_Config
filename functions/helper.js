const GetDeviceTopic = device => {
  let arr = [];

  for (let key in device) {
    if (key === "topic") {
      arr.push(device[key]);
    }
  }
  return arr[0];
};

const GetDevicePacket = (device, type) => {
  let arr = [];
//   console.log(device["packet"]["ack"]);
  for (let key in device["packet"]) {
    if (key === type) {
      arr.push(device["packet"][key]);
    }
  }
  return arr[0];
};

export { GetDeviceTopic, GetDevicePacket };
