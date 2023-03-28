require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

// general flow
// participants enter (maybe have to authorize app?)
// when ready, randomize brekaout rooms
  // it gets the participants
  // creates breakout rooms based on numbers of vols and fellows
  // adds participants to rooms
  // opens rooms
  // saves configuration
// after rooms are created you can manually add rooms and add ppl to them
  // if you do this you must click to save the new configuration when done
  // if you don't save the manual updates you made won't be accounted for
  // when making the next round of breakouts which could result in double matching

import zoomSdk from "@zoom/appssdk"
import { 
  configureSdk,
  getParticipants,
  createBreakoutRooms
} from "./zoom_breakout/zoom_breakout_api"


document.addEventListener("DOMContentLoaded", _ => {
  // Thinking I should update this to configureSdk.then
  // and nest everything else inside the .then?
  configureSdk();

  const randomizeBtn = document.getElementById('randomize-btn');
  console.log(randomizeBtn)

  
  // async function getParticipants() {
  //   response = await zoomSdk.getMeetingParticipants();
  //   console.log(response)
  //   return response.participants;
  // }
  // async function getParticipants() {
  //   try { return await zoomSdk.getMeetingParticipants().promise(); }
  //   catch (error) { console.log('error' + error); }
  //   finally { console.log('finished getting participants'); }
  // }

  // const getParticipants = () => {
  //   return zoomSdk.getMeetingParticipants()
  // }

  // const addBreakoutRoom = (name, name1) => {
  //   return zoomSdk.addBreakoutRoom({
  //     name: name,
  //     name: name1
  //   })
  //   // zoomSdk.addBreakoutRoom(name).then(response => {
  //   //   console.log(response);
  //   //   return response;
  //   // })
  // }
  
  const getNumberOfBreakoutRooms = (participants) => {
    console.log(participants);
    console.log(participants.length);
    // get number of volunteers
    // get number of Fellows
    // if there are more Fellows than volunteers, create same num of rooms as there are volunteers
      // wont pair fellows
    // if more volunteers, create same num of rooms as there are Fellows
      // Will pair volunteers
    let numberOfRooms = Math.floor(participants.length / 2)
    return numberOfRooms
  }

  // const addBreakoutRoom = (numberOfRooms) => {
  //   console.log(numberOfRooms);
  //   roomsToAdd = {};
  //   console.log(roomsToAdd);
  //   for(let num = 1; num <= numberOfRooms; num++) {
  //     roomsToAdd[`room${num}`] = `room${num}`;
  //   }
  //   console.log(roomsToAdd);
  
  //   return zoomSdk.addBreakoutRoom(roomsToAdd)
  // }

  async function randomizeBreakoutRooms() {
    let participantResponse = await getParticipants();
    let participants = participantResponse.participants;
    console.log(participants);

    let numberOfRooms = getNumberOfBreakoutRooms(participants);
    // error handling (if number = 0...)
    console.log(`number of rooms = ${numberOfRooms}`)

    // let response = await zoomSdk.createBreakoutRooms({numberOfRooms: 5, assign: 'manually'})
    // console.log(response)
    let room = await createBreakoutRooms(numberOfRooms);
    console.log(room);

    // createMatches
    // add matches to rooms
    // export matches
  }

  // option to resave matches?
  // re-randomize (should prob take in previous set of matches to ensure no doubles)

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
