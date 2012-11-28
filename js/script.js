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

function initCamera(callback) {
	var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

	video = document.querySelector('video');

	if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true, video: true}, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      callback && callback();
    }, onFailSoHard);
	} else {
    // video of someone using it
	  video.src = 'somevideo.webm'; // fallback.
	}

}

var Track = (function() {

  function Track(name) {
    this.name = name;
    this.audioFiles = [];
    
    for (var i=1; i < 29; i++) {
      var audioFile = new AudioFile();
      audioFile.load('music/chunks/'+this.name+'-chunk-'+i+'.mp3');
      this.audioFiles.push(audioFile);
    };
    
    this.view = new TrackView(this);
  }
  
  Track.prototype.playAll = function() {
    var that = this;
    var i = -1;
    setInterval(function() {
      that.playBar(++i % that.audioFiles.length)
    }, 6650);
  }
  
  Track.prototype.playBar = function(bar) {
    this.audioFiles[bar].play();
    this.view.highlightFile(bar)
  }

  return Track;
})();

var TrackView = (function() {

  function TrackView(track) {
    this.track = track;
    var view = $('<div class="track"><div class="name">'+this.track.name+'</div></div>');
    this.view = view;

    var files = $('<div class="files"></div>');
    _.each(this.track.audioFiles, function(audioFile) {
      var audioFileView = $('<div class="audioFile"></div>');
      audioFileView.click(function() {
        audioFileView.toggleClass('muted');
        audioFile.muted = audioFileView.hasClass('muted')
      });
      files.append(audioFileView);
    });
    
    files.append('<span style="clear: both;"></span>');
    this.view.append(files);
    $('#tracks').append(this.view);
  }
  
  TrackView.prototype.highlightFile = function(fileNumber) {
    this.view.find('.audioFile:eq('+(fileNumber-1)+')').removeClass('highlight');
    this.view.find('.audioFile:eq('+fileNumber+')').addClass('highlight');
  };
  
  return TrackView;
})();

var AudioFile = (function() {

  function AudioFile() {
    this.muted = false;
  }

  AudioFile.prototype.load = function(file) {
    var that = this;
        
    var request = new XMLHttpRequest();
    request.open("GET", file, true);
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
  
  AudioFile.prototype.play = function() {
    if (this.muted) return;
    if (!this.buffer) {
      console.log('This track isn\'t ready yet. Should probably make sure we\'re all loaded first');
      return;
    };
    
    var source = audioContext.createBufferSource();
    source.buffer = this.buffer;              
    source.connect(audioContext.destination);      
    source.noteOn(0);                         
  };
  
  return AudioFile;
})();


setupAPIs(function() {
  $(document).ready(function() {
    // initCamera(function() {
      
      var tracks = [];
      tracks.push(new Track('Beat'));
      tracks.push(new Track('Bass'));
      tracks.push(new Track('Rythm Guitar'));
      tracks.push(new Track('Other Guitar'));
      tracks.push(new Track('Siren'));
      tracks.push(new Track('Voice'));
      tracks.push(new Track('Synth'));
      tracks.push(new Track('Synth 2'));
      tracks.push(new Track('Keys'));
      
      
      var i = -1;
      setInterval(function() {
        var trackNo = ++i % tracks[0].audioFiles.length;
        _.each(tracks, function(track) {
          track.playBar(trackNo);
        });
      }, 6650);


  });
});

