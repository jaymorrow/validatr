jQuery(function ($) {
    window.prettyPrint && prettyPrint();

    $('form').validatr({
        theme: 'bootstrap',
        valid: function () {
            $(this).find('.alert-success').css('visibility', 'visible').delay(3000).animate({opacity: 0}, function () {
                $(this).css('visibility', 'hidden');
                $(this).css('opacity', 1);
            });
            return false;
        }
    }).on('reset', function () {
        $(this).find('.alert-success').css('visibility', 'hidden');
    });
});
