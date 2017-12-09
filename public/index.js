$(function() {
  var state = false;
  var username;
  var synth = new Tone.PolySynth(7, Tone.Synth, {
    "volume" : -8,
    "oscillator" : {
      "partials" : [1, 2, 1],
    },
    "portamento" : 0.05
  }).toMaster()

  //TODO add error handling if not valid GitHub account
  $("#start-button").on("click", function(event) {
    event.preventDefault();
    if (typeof username === 'undefined') {
      username = $("#github-username").val().trim();
      state = true;
      githubScrape(username);
    } else if (!state) {
      var newuser = $("#github-username").val().trim();
      if (newuser != username) {
        username = newuser;
        console.log("newuser");
        //TODO find Tone.js method for removing/clearing Transport or Part
        // githubScrape(username);
      }
      state = true;
      Tone.Transport.start();
    } else {
      console.log("Tone!");
    }
  });

  $("#stop-button").on("click", function(event) {
    event.preventDefault();
    Tone.Transport.pause();
    state = false;
  });

  function githubScrape(username) {
    $.get('/scrape/' + username, function(data){
      buildChords(data);
    });
  } // end gitHubScrape

  //GitHub graph hex vals, most to least: #196127, #239a3b, #7bc96f, #c6e48b, #ebedf0
  //C, D, E, G, A (https://en.wikipedia.org/wiki/Pentatonic_scale)
  function buildChords(data) {
    var chords = [];
    //TODO https://github.com/Tonejs/Tone.js/wiki/Time
    var time = 0;
    for (key in data) {
      var chord = [];
      chord.push(time + "i");
      time+=10;
      var notes = [];
      for (var i = 1; i <= data[key].length; i++){
        if (data[key][i-1] === "#196127") {
          notes.push(data[key][i-1] = "E" + i);
        }
        else if (data[key][i-1] === "#239a3b") {
          notes.push(data[key][i-1] = "D" + i);
        }
        else if (data[key][i-1] === "#7bc96f") {
          notes.push(data[key][i-1] = "B" + i);
        }
        else if (data[key][i-1] === "#c6e48b") {
          notes.push(data[key][i-1] = "A" + i);
        }
        else {
          notes.push(data[key][i-1] = "G" + i);
        }
      }
      chord.push(notes);
      chords.push(chord);
    }
    playScrape(chords);
  }// end buildChords

  //TODO read up for better handling of Draw https://tonejs.github.io/docs/r11/Part
  function playScrape(chords) {
    var n = '16n';
    var synthPart = new Tone.Part(function(time, chord){
      synth.triggerAttackRelease(chord, n, time);

      Tone.Draw.schedule(function(){
        renderGraph(chord);
        if (chord == chords[0][1]) {
          $("#contribution-graph").empty();
        }
      }, time);
    }, chords).start("0");

    synthPart.loop = true;
    // synthPart.loopEnd = "0m";
    synthPart.humanize = false;

    Tone.Transport.bpm.value = 10;
    Tone.Transport.start("+0.1");
  } // end playScrape
  //TODO https://github.com/Tonejs/Tone.js/wiki/Arpeggiator

  function renderGraph(chord) {

    var sun = $("<div>&nbsp;</div>").attr("class", chord[0]);
    var mon = $("<div>&nbsp;</div>").attr("class", chord[1]);
    var tue = $("<div>&nbsp;</div>").attr("class", chord[2]);
    var wed = $("<div>&nbsp;</div>").attr("class", chord[3]);
    var thu = $("<div>&nbsp;</div>").attr("class", chord[4]);
    var fri = $("<div>&nbsp;</div>").attr("class", chord[5]);
    var sat = $("<div>&nbsp;</div>").attr("class", chord[6]);

    var week = $("<div>").attr("class", "week").append(sun, mon, tue, wed, thu, fri, sat);
    $("#contribution-graph").append(week);

  }
});
