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

    $('a.download').on('click', function (e) {
        e.preventDefault();
        var link = this;
        _gaq.push(['_trackEvent', 'Download', link.getAttribute('data-type')]);
        setTimeout(function() {
            document.location.href = link.href;
        }, 100);
    });
});
