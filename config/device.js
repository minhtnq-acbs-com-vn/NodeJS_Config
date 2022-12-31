const CameraPacks = {
  topic: {
    subscribe: "espInCameraPacks/room1",
    ack: "espInCameraPacks/room1/ACK",
    publish: "espInCameraPacks/room1/server",
  },
  packet: {
    ack: {
      lightState: "deviceLightStateConfirmed",
      temp: "deviceTempConfirmed",
      soundState: "deviceSoundStateConfirmed",
      servo: "deviceServoConfirmed",
    },
    request: {
      lightState: "requestLightState",
      temp: "requestTemp",
      soundState: "requestSoundState",
      servo: "requestServo",
    },
  },
};

const AC_Light = {
  topic: {
    subscribe: "espInACwithLight/room1",
    ack: "espInACwithLight/room1/ACK",
    publish: "espInACwithLight/room1/server",
  },
  packet: {
    ack: {
      ac: "deviceACConfirmed",
      light: "deviceLightConfirmed",
    },
    request: {
      acOn: "requestACOn",
      acOff: "requestACOff",
      lightOn: "requestLightOn",
      lightOff: "requestLightOff",
    },
  },
};

const Door = {
  topic: {
    subscribe: "espInDoor/room1",
    ack: "espInDoor/room1/ACK",
    publish: "espInDoor/room1/server",
  },
  packet: {
    ack: {
      door: "deviceDoorConfirmed",
    },
    request: {
      doorStatus: "requestDoorStatus",
    },
  },
};

export { CameraPacks, AC_Light, Door };
