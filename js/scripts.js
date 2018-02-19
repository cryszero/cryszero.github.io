$(document).ready(() => {
    var $header_height = $('.page-navbar').innerHeight();
    var $stickyHeader = $('.page-navbar').offset().top;
    if ($(window).scrollTop() > $stickyHeader) { // Чекаем если вьюпорт ниже хедера, то панелька прилипнет
        $('.page-navbar').addClass('page-navbar--sticky');
        $('body').css('padding-top', $header_height);
    }

    $(window).scroll(function() { // заделываем прилипалу на скролл
        if ($(window).scrollTop() >= $stickyHeader) {
            $('.page-navbar').addClass('page-navbar--sticky');
            $('body').css('padding-top', $header_height);
        } else {
            $('body').css('padding-top', 0);
            $('.page-navbar').removeClass('page-navbar--sticky');
        }
    });

    $('.page-navbar__button').click(function() { // Милый слайд списка в панельке
        $('.page-navbar__list').slideToggle('slow');
        $('.page-navbar__button').toggleClass('page-navbar__button--active');
    });



    $('.page-navbar__link').click(function() { // Гладкий скролл до якоря
        var href = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(href).offset().top
        }, 800);
    });

    $('.contacts__form').submit(function() {
    	var form = $(this);
    	var data = form.serialize();
    	$.ajax({
    		type: 'POST',
    		url: 'send.php',
    		dataType: 'json',
    		data: data,
    		beforeSend: function(data) {
    			form.find('input[type="submit"]').attr('disabled', 'disabled');
    		},
    		success: function(data) {
    			alert('Пысьмо отправлено');
    		},
    		complete: function(data) {
    			form.find('input[type="submit"]').prop('disabled', false);
    		}
    	});
    	return false;
    });
});