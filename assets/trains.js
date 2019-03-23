

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBLs8da6xCHrTdy7jotKBe7pvlyERPsq84",
    authDomain: "trains-50e2d.firebaseapp.com",
    databaseURL: "https://trains-50e2d.firebaseio.com",
    projectId: "trains-50e2d",
    storageBucket: "",
    messagingSenderId: "999060687675"
  };
  firebase.initializeApp(config);


$("#submit").on("click", function(event) {
    event.preventDefault();
    computeValues();
  });
  
      function computeValues() {
      // Capture values from text boxes
      trainName = $("#trainName").val().trim();
      destination = $("#destination").val().trim();
      time = $("#time").val().trim();
      frequency = $("#frequency").val().trim();
      
    
      if (time.match(/\D/).index === 1) { 
          time = "0" + time;
      }
  
      var currentTime = moment().format("YYYY-MM-DD HH:mm"),
     
      convertedTime = moment().format("YYYY-MM-DD") + " " + time;
  
    
      function nextTrainTime() {
          nextTrain = moment(convertedTime).format("HH:mm A");
          if (nextTrain === "00:00 AM") {
              nextTrain = "12:00 AM";
          }
      }
  
      if (convertedTime > currentTime) {
          nextTrain = time;
          minutesAway = moment(convertedTime).diff(moment(currentTime), "minutes");
          nextTrainTime();
      }
      else {
          while (convertedTime < currentTime) {
          
              var incrementTime = moment(convertedTime).add(frequency, "minutes"),
       
              newTime = moment(incrementTime._d).format("YYYY-MM-DD HH:mm");
             
              convertedTime = newTime;
          }
          nextTrainTime();
      
          minutesAway = moment(convertedTime).diff(moment(currentTime), "minutes");
      }
      
      if (minutesAway > 60) {
          if (minutesAway%60 === 0) {
              minutesAway = Math.floor(minutesAway/60) + " hours"
          }
          else {
              minutesAway = Math.floor(minutesAway/60) + "h " + minutesAway%60 + "m";
          }
      }
      else { 
          minutesAway = minutesAway + " minutes";
      }
  
      if (frequency > 60) {
          if (frequency%60 === 0) { 
              frequency = Math.floor(frequency/60) + " hours"
          }
          else {
              frequency = Math.floor(frequency/60) + "h " + frequency%60 + "m";
          }
      }
      else {
          frequency = frequency + " minutes";
      }
  
      var hourConv = Math.abs(nextTrain.substr(0, 2));
      if (hourConv > 12) {
          hourConv = hourConv - 12;
          nextTrain = hourConv + nextTrain.substr(2);
      }
  
      database.ref().push({
          trainName: trainName,
          destination: destination,
          frequency: frequency,
          nextTrain: nextTrain,
          minutesAway: minutesAway
      });
  } 

  

  database.ref().on("child_added", function(childSnapshot) {
      //Append lastest results
      $("#trainSchedule").append("<tr>" +
      "<td>" + childSnapshot.val().trainName + "</td>" +
      "<td>" + childSnapshot.val().destination + "</td>" +
      "<td>" + childSnapshot.val().frequency + "</td>" +
      "<td>" + childSnapshot.val().nextTrain + "</td>" +
      "<td>" + childSnapshot.val().minutesAway + "</td>" +
      "</tr>"
      );
  
      // clear variables
      nextTrain = "";
      minutesAway = "";
  
  });