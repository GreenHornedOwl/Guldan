(function(){
	$(window).on("scroll", function(){	
		if ($(this).scrollTop() > 1) {
            $('.header').addClass("modified");
        } else {
            $('.header').removeClass("modified");
        }
	})	
})();

