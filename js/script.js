/* Author: 

*/

var video;
var audioContext = new webkitAudioContext;

function setupAPIs(callback) {
  window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	var audioSupport = !(typeof webkitAudioContext === 'undefined' && typeof AudioContext === 'undefined');

	if (navigator.getUserMedia && audioSupport) callback && callback()
	else alert('Unsupported browser. Try Google Chrome')
}

var TimeSlice = (function() {

  function TimeSlice(samples) {
    this.samples = samples;
    this.activeSamples = [];
  }
  
  TimeSlice.prototype.playActiveSamples = function(bar) {
    var that = this;

    function isActive(_, i) { return !!that.activeSamples[i]; }
    var activeSamples = _.filter(that.samples, isActive);
    _.invoke(activeSamples, 'play');
  }
  
  TimeSlice.prototype.updateActiveSamples = function(activeSamples) {
    this.activeSamples = activeSamples;
  }

  return TimeSlice;
})();


var View = (function() {

  function View(timeSlices) {
    this.timeSlices = timeSlices;
    this.render();
    this.updateTimeSlices();
  }
  
  View.prototype.render = function() {
    var view = $('<div></div>');
    this.view = view;
    var that = this;
    
    _.each(this.timeSlices, function(timeSlice, i) {
      var timeSliceView = $('<div class="timeSlice"></div>');
      timeSliceView.click(function() {
        currentSliceTicker = i-1;
        // cancel and start slice
        stopAll();
        
        clearInterval(playInterval);
        playInterval = setInterval(playCurrentSlice, 6650);
        playCurrentSlice();
      });
      
      _.each(timeSlice.samples, function(sample, j) {
        var wasActive = localStorage['activeSamples:'+i+':'+j] == 'true' ? 'enabled' : '';
        var audioFileView = $('<div class="sample '+ sample.instrument() + ' ' + wasActive + '" title="'+sample.name+'"></div>');
        audioFileView.click(function() {
          audioFileView.toggleClass('enabled');
          localStorage['activeSamples:'+i+':'+j] = audioFileView.hasClass('enabled');
          that.updateTimeSlices();
          return false;
        });
        
        timeSliceView.append(audioFileView);
      });
      
      that.view.append(timeSliceView);
      timeSliceView.append('<span style="clear: both;">&nbsp;</span>');
      
    });
    
    $('#timeSlices').append(this.view);
    
  }
  
  View.prototype.updateTimeSlices = function() {
    var that = this;
    $('.timeSlice').each(function(timeSliceIndex) {
      var currentTimeSlice = that.timeSlices[timeSliceIndex];
      
      var activeSamples = $(this).find('.sample').map(function(sampleIndex) {
        return $(this).hasClass('enabled');
      });
      
      currentTimeSlice.updateActiveSamples(activeSamples);
    });
  }
  
  View.prototype.highlightSlice = function(sliceNo) {
    var that = this;
    $('.timeSlice').css('background-color', 'transparent');
    $('.timeSlice:eq('+sliceNo+')').css('background-color', 'darkgray');
  }
  
  return View;
})();



var Sample = (function() {

  function Sample(file) {
    this.name = file;
    var that = this;
        
    var request = new XMLHttpRequest();
    request.open("GET", 'music/samples/'+file, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          that.buffer = buffer;
        }, function() {
          return alert('Unsupported file format');
        });
    };
    request.send();
  
  };
  
  Sample.prototype.play = function() {
    if (!this.buffer) {
      console.log('This track isn\'t ready yet. Should probably make sure we\'re all loaded first');
      return;
    };
    
    // Could probably do this bit on init
    this.source = audioContext.createBufferSource();
    this.source.buffer = this.buffer;              
    this.source.connect(audioContext.destination);      
    this.source.noteOn(0);      
  };
  
  Sample.prototype.instrument = function() {
    return this.name.match(/^(.+)(?:-chunk).+$/)[1].replace(/ /g,'');
  };
  
  return Sample;
})();

stopAll = function() {
  _.each(samples, function(sample) {
    if (sample.source) sample.source.noteOff(0);
  });
}

var currentSliceTicker = -1;
var playInterval;
var view;
var samples;
setupAPIs(function() {
  $(document).ready(function() {
    // initCamera(function() {
      
      samples = _.map(sampleURLs, function(sampleURL) {
        return new Sample(sampleURL);
      });
      
      timeSlices = [];
      var numOfTimeslices = 8;
      for (var i=0; i < numOfTimeslices; i++) {
        timeSlices.push(new TimeSlice(samples));
      };
      
      view = new View(timeSlices);
      
      playInterval = setInterval(playCurrentSlice, 6650);
      playCurrentSlice();
  });
});


function playCurrentSlice() {        
  var currentPos = ++currentSliceTicker % timeSlices.length;
  timeSlices[currentPos].playActiveSamples();
  view.highlightSlice(currentPos);
}



var sampleURLs = ['Bass-chunk-12.mp3',
'Bass-chunk-13.mp3',
'Bass-chunk-15.mp3',
'Bass-chunk-21.mp3',
'Bass-chunk-22.mp3',
'Beat-chunk-10.mp3',
'Beat-chunk-6.mp3',
'Beat-chunk-7.mp3',
'Beat-chunk-9.mp3',
'Keys-chunk-10.mp3',
'Keys-chunk-14.mp3',
'Keys-chunk-4.mp3',
'Keys-chunk-9.mp3',
'Other Guitar-chunk-20.mp3',
'Other Guitar-chunk-21.mp3',
'Other Guitar-chunk-22.mp3',
'Other Guitar-chunk-23.mp3',
'Other Guitar-chunk-24.mp3',
'Other Guitar-chunk-3.mp3',
'Other Guitar-chunk-4.mp3',
'Rythm Guitar-chunk-12.mp3',
'Rythm Guitar-chunk-4.mp3',
'Rythm Guitar-chunk-5.mp3',
'Synth 2-chunk-10.mp3',
'Synth 2-chunk-11.mp3',
'Synth 2-chunk-12.mp3',
'Synth 2-chunk-13.mp3',
'Synth 2-chunk-14.mp3',
'Synth-chunk-20.mp3',
'Synth-chunk-21.mp3',
'Synth-chunk-23.mp3',
'Synth-chunk-24.mp3',
'Voice-chunk-14.mp3',
'Voice-chunk-15.mp3',
'Voice-chunk-16.mp3',
'Voice-chunk-17.mp3',
'Voice-chunk-18.mp3',
'Voice-chunk-19.mp3',
'Voice-chunk-20.mp3',
'Voice-chunk-21.mp3',
'Voice-chunk-22.mp3',
'Voice-chunk-23.mp3',
'Voice-chunk-24.mp3',
'Voice-chunk-5.mp3',
'Voice-chunk-6.mp3',
'Voice-chunk-7.mp3',
'Voice-chunk-8.mp3'];