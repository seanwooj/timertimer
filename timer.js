(function () {
  var T3 = window.T3 = {};

  var Controller = Timer.T3 = function (timerContainer) {
    this.$timerContainer = $(timerContainer);

    this.secondsLeft = 0;
    this.lastTick = undefined;
    this.timerId = undefined;
  };

  Controller.prototype.startTimer = function (seconds) {
    this.secondsLeft = secondsLeft;
    this.lastTick = new Date().getTime();

    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
    }

    this.timerId = setInterval(this.tick.bind(this), 1000);
  };

  function formatTimeString = function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }

  Controller.prototype.tick = function () {
    var now = new Date().getTime();
    var millisElapsed = this.lastTick - now;

    this.lastTick = now;
    this.secondsLeft -= millisElapsed / 1000;

    if (this.secondsLeft <= 0 ) {
      clearInterval(this.timerId);
      this.ding();
      return;
    }

    var timeString = formatTimeString(this.secondsLeft);
    this.$timerContainer.html(timeString);
    $('title').html(timeString);
  };

  this.ding = function () {
    this.$timerContainer.html("00:00");
    $('title').html('Ding!');

    // notifications
    window.webkitNotifications.createNotification(
      "clock.png", "DING!", "Time is up!"
    ).show();

    // hack to play sound
    var $ring = $("<audio>")
      .attr("src", "bell.wav")
      .attr("autostart", "true")
      .attr("loop", "false")
      .hidden(true);

    $('body').append($ring);
  };

  var CookieLoader = T3.CookieLoader = function () {
  };

  CookieLoader.prototype.loadCookieTimerData = function () {
    if ( $.cookie("timerCreated") ) {
      var timeSince = Math.floor(($.now() - $.cookie('timerCreated'))/1000);
      var remainingTime = $.cookie("timerLength") - timeSince;
      
      if (remainingTime > 0) {
        that.startTimer(remainingTime);
      }
      return true;
    }
  };

  CookieLoader.prototype.load = function () {
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

  CookieLoader.prototype.saveCookieHistory = function (type, startedAt) {
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
})();
