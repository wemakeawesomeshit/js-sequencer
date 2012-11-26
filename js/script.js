/* Author: 

*/

var video;

if (navigator.getUserMedia) {}
else if (navigator.webkitGetUserMedia) { navigator.getUserMedia = navigator.webkitGetUserMedia}
else if (navigator.mozGetUserMedia) { navigator.getUserMedia = navigator.mozGetUserMedia}
else if (navigator.msGetUserMedia) { navigator.getUserMedia = navigator.msGetUserMedia}




$(document).ready(function() {

	 var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };


	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

	video = document.querySelector('video');

	if (navigator.getUserMedia) {

		  navigator.getUserMedia({audio: true, video: true}, function(stream) {
		   video.src = window.URL.createObjectURL(stream);
		   initialize();
		  }, onFailSoHard);
		

	} else {
	  video.src = 'somevideo.webm'; // fallback.
	}

})














