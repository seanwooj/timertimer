var Timer = ( function () {

	var Controller = function(timerContainer) {
		var that = this;
		that.time = 0;
		that.int = undefined;

		this.startTimer = function(seconds) {
			that.time = seconds;
			if ( that.int !== undefined ) {
				clearInterval(that.int);
			}
			that.int = setInterval(function(){
				if ( that.time > 0 ) {
					that.time--;

					minutes = Math.floor(that.time/60);
					seconds = that.time%60;
					if ( seconds < 10 ) {
						seconds = "0" + seconds;
					}
					if ( minutes < 10 ) {
						minutes = "0" + minutes;
					}
					$(timerContainer).html(minutes + ":" + seconds);
					$('title').html(minutes + ":" + seconds);
				} else {
					$(timerContainer).html("00:00");
					$('title').html('Ding!');

					//notifications 
					window.webkitNotifications.createNotification("clock.png", "DING!", "Time is up!").show();
					that.playSound("bell.wav");
					clearInterval(that.int);
				}
			}, 1000);
		};

		this.loadCookieTimerData = function() {
			if ( $.cookie("timerCreated") ) {
				var timeSince = Math.floor(($.now() - $.cookie('timerCreated'))/1000);
				var remainingTime = $.cookie("timerLength") - timeSince;

				if (remainingTime > 0) {
					that.startTimer(remainingTime);
				}
				return true;
			}
		};

		this.loadCookieHistory = function() {
			$('.stats-table').empty();
			if ( $.cookie("history") ) {
				$.each($.cookie("history"), function(key, value) {
					timeAgo = Math.floor(($.now() - value.startedAt)/1000/60);
					if ( timeAgo >= 60 ) {
						timeAgo = Math.floor( timeAgo / 60 );
						$('.stats-table').prepend('<div class="stats-row"><span class="stat-key">' + value.type +'</span><span class="stat-value">about ' + timeAgo + ' hours ago</span></div>');
					} else {
						$('.stats-table').prepend('<div class="stats-row"><span class="stat-key">' + value.type +'</span><span class="stat-value">' + timeAgo + ' minutes ago</span></div>');
					}
				});
			}
		};

		this.saveCookieHistory = function(type, startedAt) {
			if ( $.cookie("history") ) {
				var oldData = $.cookie("history");
				if ( oldData.length > 5 ) {
					oldData.shift();
				}
				oldData.push( { "type" : type , "startedAt": startedAt } );
				$.cookie("history", oldData);
			} else {
				$.cookie("history", [ { "type" : type , "startedAt": startedAt } ]);
			}
			// console.log($.cookie("history"));
		};

		this.start = function(timerLinkClass) {
			$.cookie.json = true;
			that.loadCookieTimerData();
				that.loadCookieHistory();
			$(timerLinkClass).click(function() {
				time = $(this).attr('time-data');
				type = $(this).html();
				that.startTimer(time);
				$.cookie("timerCreated", $.now(), { expires: 1} );
				$.cookie("timerLength", time, { expires: 1} );
				that.saveCookieHistory(type, $.now());
				that.loadCookieHistory();
			});
			$('.custom-timer').submit(function() {
				time = $('input.minutes-input').val();
				timerName = $('input.name-input').val();
				if ( !isNaN(Number(time)) ) {
					time = time * 60;
					that.startTimer(time);
					$.cookie("timerCreated", $.now(), { expires: 1} );
					$.cookie("timerLength", time, { expires: 1} );
					that.saveCookieHistory(timerName, $.now());
					that.loadCookieHistory();
				} else {
					alert("that's not a number, man.");
				}
				modal.close();				
				
			});
		};

		this.playSound = function( url ){   
			$('body').append("<embed src='"+url+"' hidden=true autostart=true loop=false>");

		};

		this.checkForNotificationsSupport = function() {
			if (window.webkitNotifications) {
				return true;
			} else {
				return false;
			}
		};
	};

	return {
		Controller: Controller
	};

} )();

	