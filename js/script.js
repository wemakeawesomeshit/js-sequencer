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

var AudioFile = (function() {

  function AudioFile() {
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
    var source = audioContext.createBufferSource();
    source.buffer = this.buffer;              
    source.connect(audioContext.destination);      
    source.noteOn(0);                         
  };
  
  return AudioFile;
})();


setupAPIs(function() {
  $(document).ready(function() {
    initCamera(function() {

      var audioFiles = [];
      for (var i=1; i < 29; i++) {
        var audioFile = new AudioFile();
        audioFile.load('music/1901-bars-'+i+'.mp3');
        audioFiles.push(audioFile);
      };

      var i = -1;
      setInterval(function() {
        audioFiles[++i % audioFiles.length].play();
      }, 6650);
      
    });
  });
});

















