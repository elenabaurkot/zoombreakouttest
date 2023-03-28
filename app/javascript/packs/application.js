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
  createBreakoutRooms,
  assignParticipantToBreakoutRoom
} from "./zoom_breakout/zoom_breakout_api"


document.addEventListener("DOMContentLoaded", _ => {
  // Thinking I should update this to configureSdk.then
  // and nest everything else inside the .then?
  configureSdk().then(response => {
    // not sure what we will need to return in (in the case of a timeout?)
    console.log(response);
    let randomizeBtn = document.getElementById('randomize-btn');

    async function getFellowsAndVolunteers() {
      let participantResponse = await getParticipants();
      let participants = participantResponse.participants;
      console.log(participants);

      let fellows = [];
      let volunteers = [];

      participants.forEach(participant => {
        // Volunteers formatted with prefix 'V - ' (ex: V - VolunteerName)
        if(participant.screenName.match(/^v\s?-/i)) { volunteers.push(participant) }
        // Fellows formatted with prefix '# - ' (ex: 1 - FellowName)
        if(participant.screenName.match(/^\d\s?-/)) { fellows.push(participant) }
      })

      return { fellows: fellows, volunteers: volunteers }
    }

    const getNumberOfBreakoutRooms = (fellowVolunteerObj) => {
      // get number of volunteers (prefix of V - ) && number of Fellows (prefix of # - )
      let volunteerCount = fellowVolunteerObj['volunteers'].length;
      let fellowCount = fellowVolunteerObj['fellows'].length;
      let numberOfRooms;

      // With less Fellows than volunteers, create same num of rooms as Fellows because we can pair volunteers
      // With more Fellows than volunteers, create the same num of rooms as there are volunteers
        // We don't pair fellows because we want them to have 1-on-1 volunteer time for networking purposes
      if(fellowCount == volunteerCount || fellowCount < volunteerCount) {
        numberOfRooms = fellowCount;
      } else {
        numberOfRooms = volunteerCount;
      }

      return numberOfRooms
    }

    // const createBreakoutMatches= (fellowVolunteerObj, numberOfRooms) => {
    //   {
    //     ``
    //   }
      // get ratio
      // this could help us get num of volunteers in a room (will always be one fellow)
      // let ratio = Math.ceiling(fellowVolunteerObj['volunteers'].length / fellowVolunteerObj['fellows'].length);

      // If fellows > volunteers -> 1 : 1 ratio with leftover fellows
      // If fellows < volunteers -> 1 : many ratio 
        // ( volunteers / fellows ).round_up

      // 1. Loop through breakout rooms
      // 2. create key add fellow and volunteer object as value
      // 3. when done with loop if there are more fellows, add them to leftover_fellows key as array
      // 4. if there are leftover volunteers get count and start the loop from the beginning to just add volunteers until all have a room
      // 5. return the breakoutRoomMatchesObj

      // fellowVolunteerObj = {
      // 
      // }

      // breakoutRooms = {
      //   rooms: [
      //     {name: "Room 1", participants: [], breakoutRoomId: "689224F7-E4F3-4C3E-A130-D7D4B9B20FF5"},
      //     {name: "Room 2", participants: [], breakoutRoomId: "689224F7-E4F3-4C3E-A130-D7D4B9B20FF6"}
      //   ]
      // }


      // OBJECT TO RETURN 
      // let matchingObject = {
      //   breakout_room_uuid: {fellow: fellow, volunteers: [volunteer]},
      //   breakout_room_uuid: {fellow: fellow, volunteers: [volunteer]},
      //   unmatched_fellows: []
      // }

      // {
      //   fellow : [volunteers]
      // }



      // if fellows > volunteers
        // add one fellow to every room
        // store leftover fellws
        // add one volunteer to every room

      // if volunteers > fellows
        // add one fellow to every room
        // add one volunteer to every room
        // loop back over until all volunteers are matched to a room



      // get our matches
      // after returning
      // add matches to breakout room
    // }

    const assignParticipantsToBreakoutRooms = (fellowVolunteerObj, breakoutRooms) => {
      // breakoutRooms = {
      //   rooms: [
      //     {name: "Room 1", participants: [], breakoutRoomId: "689224F7-E4F3-4C3E-A130-D7D4B9B20FF5"},
      //     {name: "Room 2", participants: [], breakoutRoomId: "689224F7-E4F3-4C3E-A130-D7D4B9B20FF6"}
      //   ]
      // }
      breakoutRooms.rooms.forEach((room, index) => {
        // fellowVolObj = {
        //  fellows: [
        //      {screenName: "Elena Baurkot", participantUUID: "D979BD6F-70A6-5C5F-E704-A81D78462274",
        //       participantId: "16778240", role: "host"},
        //       {}, {}],
        //  volunteers: [{}, {}, {}]
        // }
        assignParticipantToBreakoutRoom(room.breakoutRoomId, fellowVolunteerObj.fellows[index].participantId);
        assignParticipantToBreakoutRoom(room.breakoutRoomId, fellowVolunteerObj.volunteers[index].participantId);

      })
    }
  
  
    async function randomizeBreakoutRooms() {
      // not sure if I need the await here or not
      let fellowVolunteerObj = await getFellowsAndVolunteers();
      console.log(fellowVolunteerObj);

      let numberOfRooms = getNumberOfBreakoutRooms(fellowVolunteerObj);
      // error handling (if number = 0...)
      console.log(`number of rooms = ${numberOfRooms}`)
  
      let breakoutRooms = await createBreakoutRooms(numberOfRooms);
      console.log(breakoutRooms);
  
      assignParticipantsToBreakoutRooms(fellowVolunteerObj, breakoutRooms)
      // createMatches
      // probably want to pass in previous sets of matches here too
      // let matches = createBreakoutMatches(fellowVolunteerObj, numberOfRooms);

      // add matches to rooms
      // let createdMatches = assignToBreakoutRooms(matches, breakoutRooms)
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