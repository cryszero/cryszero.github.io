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

    // $('#kitten').click((evt) => {
    //     evt.preventDefault();
    //     var font_size = Math.random() * 20 + 10;
    //     ReactDOM.render(React.createElement(
    //         'div', { className: 'meow-modal', style: { fontSize: font_size } },
    //         'Meow'
    //     ), document.getElementById('about'));
    // }); побаловался с реактом, но это не совсем то, что нужно)

    $('#kitten').click((evt) => {
        evt.preventDefault();
        var aboutStart = $('#about').offset().top;
        var aboutEnd = aboutStart + $('#about').height();
        posX = (Math.random() * ($('#about').width() - 214) + 107).toFixed();
        posY = (Math.random() * (aboutEnd - aboutStart) + aboutStart).toFixed();
        $meow = $('<div/>').text('Meow').css({
            'position': 'absolute',
            'fontSize': Math.floor(Math.random() * 30 + 20) + 'px',
            'left': posX+'px',
            'top': posY+'px',
            'z-index': '-1'
        }).appendTo('#about').fadeIn(1000).delay(1000).fadeOut(500, function() {
            $(this).remove();
        });
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