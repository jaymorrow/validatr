(function ($) {
    $.extend($.validatr.messages, {
        checkbox: 'Please check this box if you want to proceed.',
        color: 'Please enter a color in the format #xxxxxx',
        email: {
            single: 'Please enter an email address.',
            multiple: 'Please enter a comma separated list of email addresses.'
        },
        pattern: 'Please match the requested format.',
        radio: 'Please select one of these options.',
        range: {
            base: 'Please enter a {{type}}',
            overflow: 'Please enter a {{type}} greater than or equal to {{min}}.', 
            overUnder: 'Please enter a {{type}} greater than or equal to {{min}}<br> and less than or equal to {{max}}.',
            invalid: 'Invalid {{type}}',
            underflow: 'Please enter a {{type}} less than or equal to {{max}}.'
        },
        required: 'Please fill out this field.',
        select: 'Please select an item in the list.',
        time: 'Please enter a time in the format hh:mm:ss',
        url: 'Please enter a url.'
    });
}(jQuery));
