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
  configureSdk().then(response => {
    console.log(response);

    const randomizeBtn = document.getElementById('randomize-btn');
    console.log(randomizeBtn)
    
    const getNumberOfBreakoutRooms = (participants) => {
      console.log(participants);
      console.log(participants.length);
      // get number of volunteers (prefix of V - )
      // get number of Fellows (prefix of # - )
      // Don't want to include staff in these numbers
  
      // if there are more Fellows than volunteers, create same num of rooms as there are volunteers
        // wont pair fellows
      // if more volunteers, create same num of rooms as there are Fellows
        // Will pair volunteers
      let numberOfRooms = Math.floor(participants.length / 2)
      return numberOfRooms
    }
  
  
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
  
    zoomSdk.addEventListener('onParticipantChange', getParticipants)
    randomizeBtn.addEventListener('click', randomizeBreakoutRooms)
  })
})

// Things we will need to test:
// - adding our own breakout rooms after configuration and adding people to them
// - updating the save verison of breakouts to the newest configurations 
// - seeing what assignments hold if people leave the breakout room or the meeting
// - what happens if someone comes back after joining 
// option to resave matches?
// re-randomize (should prob take in previous set of matches to ensure no doubles)