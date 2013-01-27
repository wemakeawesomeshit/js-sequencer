

var View = (function() {

  function View() {
    this.render();
    this.updateTimeSlices();
  }
  
  View.prototype.render = function() {
    var view = $('<div></div>');
    this.view = view;
    var that = this;
    
    var mouseIsDown = false;
    $(window).bind("mousedown", function() {
      mouseIsDown = true;
    });
    $(window).bind("mouseup", function() {
      mouseIsDown = false;
    });
    
    $('#instrumentNames span').click(function() {
      $(this).toggleClass('muted');
    });
    
    $('#pause').click(function(e) {
      if (sequencer.paused) {
        $('#pause').text('PAUSE');
        sequencer.startPlayback();
      } else {
        $('#pause').text('PLAY');
        sequencer.stopPlayback();
      }
    });
    
    _.each(sequencer.timeSlices, function(timeSlice, i) {
      var timeSliceView = $('<div class="timeSlice"></div>');
      timeSliceView.click(function() {
        currentSliceTicker = i;
        sequencer.stopPlayback();
        sequencer.startPlayback();
      });
      
      var selectedOfInstrument = {};

      _.each(timeSlice.samples, function(sample, j) {
        var lsKey = 'activeSamples:'+i+':'+j;
        var wasActive = localStorage[lsKey] ? 'enabled' : '';
        var lastOfInstrument = timeSlice.samples[j+1] && timeSlice.samples[j+1].instrument != sample.instrument;
        lastOfInstrument = lastOfInstrument ? 'lastOfInstrument' : '';
        var audioFileView = $('<div class="sample '+ sample.instrument + ' ' + wasActive + ' ' + lastOfInstrument + '" title="'+sample.name+'"></div>');
        if (wasActive) selectedOfInstrument[sample.instrument] = audioFileView;
        
        audioFileView.click(function(e) {
          e.stopPropagation();
        });
        audioFileView.hover(function() {
          if (mouseIsDown) {
            if (!audioFileView.hasClass('enabled')) {
              audioFileView.trigger("triggerClick");
            }
          }
        });

        audioFileView.bind("mousedown", function() {
          audioFileView.trigger("triggerClick");
        });

        audioFileView.bind("triggerClick",function() {
          audioFileView.toggleClass('enabled');
          if (audioFileView.hasClass('enabled')) {
            localStorage[lsKey] = true;
            var existingOfInstrument = selectedOfInstrument[sample.instrument];
            if (existingOfInstrument && existingOfInstrument != audioFileView) {
              existingOfInstrument.trigger('triggerClick');
            }
            selectedOfInstrument[sample.instrument] = audioFileView;
          } else {
            localStorage.removeItem(lsKey);
            selectedOfInstrument[sample.instrument] = null;
          }
          that.updateTimeSlices();
          return false;
        });
        
        timeSliceView.append(audioFileView);
      });
      
      that.view.append(timeSliceView);
      timeSliceView.append('<span style="clear: both;">&nbsp;</span>');
      
    });
    
    $('#timeSlices').append(this.view);
    
    _.each(sequencer.samples, function(sample, i) {
      $(instrumentLabels[sample.instrument]).click(function() {
        sample.toggleMute($(this).hasClass('muted'))
      });
    });
    
    
  }
  
  View.prototype.updateTimeSlices = function() {
    $('.timeSlice').each(function(timeSliceIndex) {
      var currentTimeSlice = sequencer.timeSlices[timeSliceIndex];
      
      var activeSamples = $(this).find('.sample').map(function(sampleIndex) {
        return $(this).hasClass('enabled');
      });
      
      currentTimeSlice.updateActiveSamples(activeSamples);
    });
  }
  
  View.prototype.highlightSlice = function(sliceNo) {
    var that = this;
    $('.timeSlice.active').removeClass('active');
    $('.timeSlice:eq('+sliceNo+')').addClass('active');
  }
  
  return View;
})();
