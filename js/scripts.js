$('.page-navbar__button').click(function() {
	$('.page-navbar__list').toggleClass('page-navbar__list--visible');
});

$(function() {
var stickyHeader = $('.page-navbar').offset().top;

$(window).scroll(function() {
	if($(window).scrollTop() >= stickyHeader) {
		$('.page-navbar').addClass('page-navbar--sticky');
	}
	else {
		$('.page-navbar').removeClass('page-navbar--sticky');
	}
});
});