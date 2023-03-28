/* globals zoomSdk */
import zoomSdk from "@zoom/appssdk"
import { apis } from "./zoom_breakout_app"

const getParticipants = () => {
  return zoomSdk.getMeetingParticipants()
}

const createBreakoutRooms = (numberOfRooms) => {
  console.log(numberOfRooms);
  // let roomsToAdd = {};
  // console.log(roomsToAdd);
  // for(let num = 1; num <= 6; num++) {
  //   roomsToAdd['name'] = `room${num}`;
  // }
  // console.log(roomsToAdd);
  // can also pass name: ['room1', 'room2', ect.]
  return zoomSdk.createBreakoutRooms('numberOfRooms'= numberOfRooms)
}

async function configureSdk() {
  // // to account for the 2 hour timeout for config
  // const configTimer = setTimeout(() => {
  //   setCounter(counter + 1);
  // }, 120 * 60 * 1000);

  const configResponse = await zoomSdk.config({
    capabilities: [
      // apis demoed in the buttons
      ...apis.map((api) => api.name), // IMPORTANT

      // demo events
      "onSendAppInvitation",
      "onShareApp",
      "onActiveSpeakerChange",
      "onMeeting",
      "onBreakoutRoomChange",

      // connect api and event
      "connect",
      "onConnect",
      "postMessage",
      "onMessage",

      // in-client api and event
      "authorize",
      "onAuthorized",
      "promptAuthorize",
      "getUserContext",
      "onMyUserContextChange",
      "sendAppInvitationToAllParticipants",
      "sendAppInvitation",
      "getMeetingParticipants",
      "createBreakoutRooms",
      "configureBreakoutRooms",
      "openBreakoutRooms",
      "closeBreakoutRooms",
      "addBreakoutRoom",
      "deleteBreakoutRoom",
      "renameBreakoutRoom",
      "changeBreakoutRoom",
      "assignParticipantToBreakoutRoom",
      "getBreakoutRoomList",
      "onParticipantChange"
    ],
    version: "0.16.0",
  });
  console.log("App configured", configResponse);
}

export {
  configureSdk,
  getParticipants,
  createBreakoutRooms
}
