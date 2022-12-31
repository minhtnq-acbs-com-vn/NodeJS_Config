import { CameraPacks, AC_Light, Door } from "../config/init.js";

import { GetDeviceTopic, GetDevicePacket } from "./helper.js";

GetDevicePacket(CameraPacks, "request");

const SubscribeToTopics = client => {
  let topicsArr = [
    GetDeviceTopic(CameraPacks).subscribe,
    GetDeviceTopic(CameraPacks).ack,
    GetDeviceTopic(AC_Light).subscribe,
    GetDeviceTopic(AC_Light).ack,
    GetDeviceTopic(Door).subscribe,
    GetDeviceTopic(Door).ack,
  ];
  for (let i = 0; i < topicsArr.length; i++) {
    client.subscribe(topicsArr[i], (err, granted) => {
      if (err) console.log(err);
      else console.log(granted);
    });
  }
};

const RequestHandler = (client, topic, message) => {};

const TopicHandler = (client, topic) => {};

const MessageHandler = (client, message) => {};

export { SubscribeToTopics, RequestHandler };
