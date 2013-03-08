var modal = (function(){
	var method = {}, $overlay, $modal, $content, $close;

	method.center = function () {
		var top, left;

		top = Math.max($(window).height() - $('.modal').outerHeight(), 0) / 2;
		left = Math.max($(window).width() - $('.modal').outerWidth(), 0) / 2;

		$('.modal').css({
			top: top + $(window).scrollTop(),
			left: left + $(window).scrollLeft()
		})
	};

	method.open = function ( settings ) {
		$('.modal').fadeIn();
		$('.overlay').fadeIn();
		method.center();
	};

	method.close = function () {
		$('.modal').fadeOut();
		$('.overlay').fadeOut();
	};

	return method;
})();