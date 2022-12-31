import { CameraPacks, AC_Light, Door } from "../config/init.js";

let subscribeObj = {
  CameraPacks: {
    Request: CameraPacks.topic.subscribe,
    Confirmation: CameraPacks.topic.ack,
  },
  AC_Light: {
    Request: AC_Light.topic.subscribe,
    Confirmation: AC_Light.topic.ack,
  },
  Door: { Request: Door.topic.subscribe, Confirmation: Door.topic.ack },
};

const ObjectToArray = obj => {
  let arr = [];
  for (let device in obj) {
    arr.push(obj[device][Request]);
    arr.push(obj[device][Confirmation]);
  }
  return arr;
};

const SubscribeToTopics = client => {
  let topicsArr = ObjectToArray(subscribeObj);
  for (let i = 0; i < topicsArr.length; i++) {
    client.subscribe(topicsArr[i], (err, granted) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${granted[0].topic} was subscribed`);
      }
    });
  }
};

const RequestHandler = (topic, message) => {};

const TopicHandler = topic => {};

const MessageHandler = Message => {};

export { SubscribeToTopics, RequestHandler };
