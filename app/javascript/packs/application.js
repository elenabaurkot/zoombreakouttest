require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

import { apis } from "./zoom_apis"
import zoomSdk from "@zoom/appssdk"


document.addEventListener("DOMContentLoaded", _ => {
  const randomizeBtn = document.getElementById('randomize-btn');

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
  
  configureSdk();

  
  // async function getParticipants() {
  //   response = await zoomSdk.getMeetingParticipants();
  //   console.log(response)
  //   return response.participants;
  // }
  async function getParticipants() {
    try { return await zoomSdk.getMeetingParticipants().promise(); }
    catch (error) { console.log('error' + error); }
    finally { console.log('finished getting participants'); }
  }

  // const getParticipants = () => {
  //   zoomSdk.getMeetingParticipants().then(response => {
  //     console.log(response.participants)
  //     return response.participants
  //   })
  // }

//   async function getData() {
//     try {
//         return await $.getJSON('./data.json').promise();
//     }
//     catch (error) {
//         console.log("error" + error);
//     }
//     finally {
//         console.log('done');
//     }
// }

  async function randomizeBreakoutRooms() {
    console.log('time to randomize');
    
    let participants = await getParticipants();
    console.log(participants)
  }

  zoomSdk.addEventListener('onParticipantChange', getParticipants)
  randomizeBtn.addEventListener('click', randomizeBreakoutRooms)
})


// async function configureSdk() {
//   // to account for the 2 hour timeout for config
//   const configTimer = setTimeout(() => {
//     setCounter(counter + 1);
//   }, 120 * 60 * 1000);

//   try {
//     // Configure the JS SDK, required to call JS APIs in the Zoom App
//     // These items must be selected in the Features -> Zoom App SDK -> Add APIs tool in Marketplace
    // const configResponse = await zoomSdk.config({
    //   capabilities: [
    //     // apis demoed in the buttons
    //     ...apis.map((api) => api.name), // IMPORTANT

    //     // demo events
    //     "onSendAppInvitation",
    //     "onShareApp",
    //     "onActiveSpeakerChange",
    //     "onMeeting",
    //     "onBreakoutRoomChange",

    //     // connect api and event
    //     "connect",
    //     "onConnect",
    //     "postMessage",
    //     "onMessage",

    //     // in-client api and event
    //     "authorize",
    //     "onAuthorized",
    //     "promptAuthorize",
    //     "getUserContext",
    //     "onMyUserContextChange",
    //     "sendAppInvitationToAllParticipants",
    //     "sendAppInvitation",
    //     "getMeetingParticipants",
    //     "createBreakoutRooms",
    //     "configureBreakoutRooms",
    //     "openBreakoutRooms",
    //     "closeBreakoutRooms",
    //     "addBreakoutRoom",
    //     "deleteBreakoutRoom",
    //     "renameBreakoutRoom",
    //     "changeBreakoutRoom",
    //     "assignParticipantToBreakoutRoom",
    //     "getBreakoutRoomList",
    //   ],
    //   version: "0.16.0",
    // });
    // console.log("App configured", configResponse);
//     // The config method returns the running context of the Zoom App
//     setRunningContext(configResponse.runningContext);
//     setUserContextStatus(configResponse.auth.status);
//     zoomSdk.onSendAppInvitation((data) => {
//       console.log(data);
//     });
//     zoomSdk.onShareApp((data) => {
//       console.log(data);
//     });
//   } catch (error) {
//     console.log(error);
//     setError("There was an error configuring the JS SDK");
//   }
//   return () => {
//     clearTimeout(configTimer);
//   };
// }
// configureSdk();
// }, [counter]);
