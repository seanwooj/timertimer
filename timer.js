(function () {
  var T3 = window.T3 = {};

  var Controller = T3.Controller
    = function ($timerContainer, $buttons) {
      this.$timerContainer = $timerContainer;
      this.$buttons = $buttons;

      this.$buttons.on(
        "click",
        this.handleButtonClick.bind(this)
      );
      $('.custom-timer').on(
        "submit", this.handleCustomSubmit.bind(this)
      );

      this.secondsLeft = 0;
      this.lastTick = undefined;
      this.timerId = undefined;
    };

  Controller.prototype.handleButtonClick = function (event) {
    var $button = $(event.currentTarget);
    var seconds = $button.attr('data-time');
    this.startTimer(seconds);

    T3.CookieLoader.registerTimer($button.html(), seconds);
  };

  Controller.prototype.handleCustomSubmit = function (event) {
    var $form = $(event.currentTarget);

    var minutes = $form.find('input.minutes-input').val();
    var timerName = $form.find('input.name-input').val();

    if (isNaN(Number(minutes))) {
      alert("that's not a number, man.");
      return;
    }

    var seconds = minutes * 60;
    this.startTimer(seconds);

    T3.CookieLoader.registerTimer(timerName, seconds);

    modal.close();
  };

  Controller.prototype.startTimer = function (seconds) {
    this.secondsLeft = seconds;
    this.lastTick = new Date().getTime();

    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
    }

    this.timerId = setInterval(this.tick.bind(this), 1000);
  };

  function formatTimeString (seconds) {
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
    var millisElapsed = now - this.lastTick;

    this.lastTick = now;
    this.secondsLeft -= Math.floor(millisElapsed / 1000);

    if (this.secondsLeft <= 0 ) {
      clearInterval(this.timerId);
      this.ding();
      return;
    }

    var timeString = formatTimeString(this.secondsLeft);
    this.$timerContainer.html(timeString);
    $('title').html(timeString);
  };

  Controller.prototype.ding = function () {
    this.$timerContainer.html("00:00");
    $('title').html('Ding!');

    // notifications
    window.webkitNotifications.createNotification(
      "clock.png", "DING!", "Time is up!"
    ).show();

    $("#bell-wav")[0]
      .play();

  };
 
  var CookieLoader = T3.CookieLoader = {};

  CookieLoader.initialize = function (controller) {
    this.controller = controller;

    $.cookie.json = true;
    this.maybeRestoreTimer();

    this.render();
  };

  CookieLoader.maybeRestoreTimer = function () {
    if (!$.cookie("timerCreated")) {
      return;
    }
    console.log("Maybe?");

    var secondsSince = Math.floor(($.now() - $.cookie('timerCreated')) / 1000);
    var secondsRemaining = $.cookie("timerLength") - secondsSince;

    if (secondsRemaining > 0) {
      this.controller.startTimer(secondsRemaining);
    }
  };

  CookieLoader.render = function () {
    var cookieLoader = this;

    if (!$.cookie("history")) {
      return;
    }

    var $statsTable = $(".stats-table");
    $statsTable.empty();
    $.each($.cookie("history"), function (key, val) {
      $statsTable.prepend(cookieLoader.renderTimer(val));
    });
  };

  CookieLoader.renderTimer = function (timerEntry) {
    var timeAgoMin = Math.floor(($.now() - timerEntry.startedAt) / 1000 / 60);

    var timeStr = null;
    if (timeAgoMin >= 60) {
      timeStr = "about " + Math.floor(timeAgoMin / 60) + " hours ago";
    } else {
      timeStr = timeAgoMin + " minutes ago";
    }

    return $('<div class="stats-row"><span class="stat-key">' + timerEntry.type +'</span><span class="stat-value">' + timeStr + '</span></div>');
  };

  CookieLoader.registerTimer = function (type, seconds) {
    $.cookie("timerCreated", $.now(), { expires: 1 } );
    $.cookie("timerLength", seconds, { expires: 1 } );

    this.saveCookieHistory(type, $.now());
    this.render();
  };

  CookieLoader.saveCookieHistory = function (type, startedAt) {
    if (!$.cookie("history")) {
      $.cookie("history", [ { "type" : type , "startedAt": startedAt } ]);
      return;
    }

    var oldData = $.cookie("history");
    if ( oldData.length > 5 ) {
      oldData.shift();
    }

    oldData.push({ "type" : type , "startedAt": startedAt });
    $.cookie("history", oldData);
  };
})();
