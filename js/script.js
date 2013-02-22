/* Author: 

*/

var sequencer = {
  samples: [],
  timeSlices: [],
  numOfTimeslices: 48,
  view: null,
  playInterval: null
}

var audioContext = new webkitAudioContext;

var instrumentLabels = {
  Bass: '#instrumentNames #bass',
  Beat: '#instrumentNames #beat',
  Keys: '#instrumentNames #keys',
  OtherGuitar: '#instrumentNames #guitar',
  RythmGuitar: '#instrumentNames #guitar',
  Synth2: '#instrumentNames #synth',
  Synth: '#instrumentNames #synth',
  Voice: '#instrumentNames #voice'
}

function setupAPIs(callback) {
	var audioSupport = !(typeof webkitAudioContext === 'undefined' && typeof AudioContext === 'undefined' && (!'webkitAudioContext' in window));

  if (audioSupport) callback && callback()
	else alert('Unsupported browser. Try Google Chrome')
}

sequencer.stopPlayback = function() {
  sequencer.paused = true;
  clearInterval(sequencer.playInterval);

  _.each(sequencer.samples, function(sample) {
    if (sample.source) sample.source.noteOff(0);
  });
}

sequencer.startPlayback = function() {
  sequencer.paused = false;
  sequencer.playInterval = setInterval(sequencer.playNextSlice, 6650);
  sequencer.playCurrentSlice();
}

var currentSliceTicker = 0;
var loading;
setupAPIs(function() {
  $(document).ready(function() {
    sequencer.samples = _.map(sampleURLs, function(sampleURL) {
      return new Sample(sampleURL);
    });
    
    for (var i=0; i < sequencer.numOfTimeslices; i++) {
      sequencer.timeSlices.push(new TimeSlice(sequencer.samples));
    };

    loading = new Loading();
    loading.countToLoad = sequencer.samples.length;
    loading.onFinished = sequencer.startPlayback;
    
    sequencer.view = new View();
  });
});


sequencer.playCurrentSlice = function() {        
  var currentPos = currentSliceTicker % sequencer.timeSlices.length;
  sequencer.timeSlices[currentPos].playActiveSamples();
  sequencer.view.highlightSlice(currentPos);
}
sequencer.playNextSlice = function() {        
  currentSliceTicker++;
  sequencer.playCurrentSlice();
}


var sampleURLs = [
'Beat-chunk-6.mp3',
'Beat-chunk-7.mp3',
'Beat-chunk-9.mp3',
'Beat-chunk-10.mp3',
'Bass-chunk-12.mp3',
'Bass-chunk-13.mp3',
'Bass-chunk-15.mp3',
'Bass-chunk-21.mp3',
'Keys-chunk-4.mp3',
'Keys-chunk-9.mp3',
'Keys-chunk-10.mp3',
'Keys-chunk-14.mp3',
'Other Guitar-chunk-3.mp3',
'Other Guitar-chunk-4.mp3',
'Other Guitar-chunk-21.mp3',
'Other Guitar-chunk-20.mp3',
'Other Guitar-chunk-22.mp3',
'Other Guitar-chunk-23.mp3',
'Rythm Guitar-chunk-4.mp3',
'Rythm Guitar-chunk-5.mp3',
'Rythm Guitar-chunk-12.mp3',
'Synth 2-chunk-10.mp3',
'Synth 2-chunk-11.mp3',
'Synth 2-chunk-12.mp3',
'Synth 2-chunk-13.mp3',
'Synth 2-chunk-14.mp3',
'Synth-chunk-23.mp3',
'Synth-chunk-24.mp3',
'Synth-chunk-21.mp3',
'Synth-chunk-20.mp3',
'Voice-chunk-5.mp3',
'Voice-chunk-6.mp3',
'Voice-chunk-7.mp3',
'Voice-chunk-8.mp3',
'Voice-chunk-19.mp3',
'Voice-chunk-20.mp3',
'Voice-chunk-21.mp3',
'Voice-chunk-22.mp3',
'Voice-chunk-14.mp3',
'Voice-chunk-16.mp3',
'Voice-chunk-17.mp3'
];