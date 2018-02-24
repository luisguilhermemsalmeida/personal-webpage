(function($) {
	/*---------------------------------------------------- */
	/* Preloader
	------------------------------------------------------ */
	$(window).load(function() {
		$("#loader").fadeOut("slow", function(){
			$("#preloader").delay(300).fadeOut("slow");
			initParticles();
		});
	});
	/*---------------------------------------------------- */
	/* Smooth Scrolling
	------------------------------------------------------ */
	$('.smoothscroll').on('click', function (e) {
		e.preventDefault();
		var target = this.hash,
		$target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top
		}, 800, 'swing', function () {
			window.location.hash = target;
		});
	});
	/*---------------------------------------------------- */
	/* FitText Settings
	------------------------------------------------------ */
	// setTimeout(function() {
	//
	// $('#intro h1').fitText(1, { minFontSize: '42px', maxFontSize: '84px' });
	//
	// }, 100);
	//
})(jQuery);