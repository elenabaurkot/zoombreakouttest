/* globals zoomSdk */
import zoomSdk from "@zoom/appssdk"
import { apis } from "./zoom_breakout_app"

const getParticipants = () => {
  return zoomSdk.getMeetingParticipants()
}

const addBreakoutRoom = (numberOfRooms) => {
  console.log(numberOfRooms);
  let roomsToAdd = {};
  console.log(roomsToAdd);
  for(let num = 1; num <= numberOfRooms; num++) {
    roomsToAdd['name'] = `room${num}`;
  }
  console.log(roomsToAdd);

  return zoomSdk.addBreakoutRoom(roomsToAdd)
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
  addBreakoutRoom
}
