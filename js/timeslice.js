var TimeSlice = (function() {

  function TimeSlice(samples) {
    this.samples = samples;
    this.activeSamples = [];
  }
  
  TimeSlice.prototype.playActiveSamples = function(bar) {
    var that = this;

    function isActive(_, i) { return that.activeSamples[i]; }
    var activeSamples = _.filter(that.samples, isActive);
    _.invoke(activeSamples, 'play');
  }
  
  TimeSlice.prototype.updateActiveSamples = function(activeSamples) {
    this.activeSamples = activeSamples;
  }

  return TimeSlice;
})();