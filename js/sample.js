
var samplesLoaded = 0;

var Sample = (function() {

  function Sample(file) {
    this.name = file;
    var that = this;
    
    this.instrument = this.name.match(/^(.+)(?:-chunk).+$/)[1].replace(/ /g,'');
        
    var request = new XMLHttpRequest();
    request.open("GET", 'music/samples/'+file, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          that.buffer = buffer;
          
          if (++samplesLoaded == sequencer.samples.length) {
            sequencer.startPlayback();
          }
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
    
    this.source = audioContext.createBufferSource();
    this.gainNode = audioContext.createGainNode();

    this.source.buffer = this.buffer;  
    this.source.connect(this.gainNode);
    this.gainNode.connect(audioContext.destination);
    this.gainNode.gain.value = this.muted ? 0 : 1;
    this.source.noteOn(0);
  };
  
  Sample.prototype.toggleMute = function(muted) {
    this.muted = muted;
    if (!this.gainNode) return;
    this.gainNode.gain.value = muted ? 0 : 1;
  }

  return Sample;
})();
