var Timer = ( function () {

	var Controller = function(timerContainer) {
		var that = this;
		that.time = 0;
		that.int = undefined;

		this.startTimer = function(seconds) {
			that.time = seconds
			if ( that.int != undefined ) {
				clearInterval(that.int);
			}
			that.int = setInterval(function(){
				if ( that.time > 0 ) {
					that.time--

					minutes = Math.floor(that.time/60);
					seconds = that.time%60;
					if ( seconds < 10 ) {
						seconds = "0" + seconds;
					}
					if ( minutes < 10 ) {
						minutes = "0" + minutes;
					}
					$(timerContainer).html(minutes + ":" + seconds)
					$('title').html(minutes + ":" + seconds)
				} else {
					$(timerContainer).html("00:00");
					$('title').html('Ding!')
					that.playSound("bell.wav");
					clearInterval(that.int);
				}
			}, 1000)
		}

		this.start = function(timerLinkClass) {
			$(timerLinkClass).click(function() {
				time = $(this).attr('time-data');
				that.startTimer(time);
				$.cookie("timerCreated", $.now(), { expires: 999} );
				console.log($.cookie("timerCreated"));
			})
		}

		this.playSound = function( url ){   
  		$('body').append("<embed src='"+url+"' hidden=true autostart=true loop=false>");
		}
	}

	return {
		Controller: Controller
	}

} )();

	
