jQuery(function ($) {
    window.prettyPrint && prettyPrint();

    $('form').validatr({
        theme: 'bootstrap',
        valid: function () {
            return false;
        }
    });
});
