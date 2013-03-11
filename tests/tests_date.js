/*
======== A Handy Little QUnit Reference ========
http://api.qunitjs.com/

Test methods:
    module(name, {[setup][ ,teardown]})
    test(name, callback)
    expect(numberOfAssertions)
    stop(increment)
    start(decrement)
Test assertions:
    ok(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    throws(block, [expected], [message])
*/

(function($) {

    var InputTypes = $.validatr.Support.inputtypes,
        Tests = $.validatr.Tests,
        parseISODate = $.validatr.Format.parseISODate,
        formatISODate = $.validatr.Format.formatISODate;

    module('tests: date', {
        setup: function () {
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'date');
        }
    });

    if (InputTypes.date) {
        test('support', function () {
            ok(InputTypes.date === true, '\'date\' type validation is supported by your browser');
        });
    }

    if (!InputTypes.date) {
        $.fn.validatr.defaultOptions.dateFormat = 'mm/dd/yyyy';

        test('no support', function () {
            ok(InputTypes.date === false, '\'date\' type vaildation is not supported by your browser');
        });
    
        test('parseISODate', function () {
            var isoDate = parseISODate('2013-01-01').toString(),
                date = new Date('01/01/2013').toString();

            equal(isoDate, date, isoDate + ' equals ' + date);
        }); 

        test('formatISODate', function () {
            var iso = '2013-01-01',
                isoDate = parseISODate(iso),
                date = formatISODate(isoDate, this.input);

            equal(date, '01/01/2013', iso + ' formatted to 01/01/2013');
        });
    
        test('required', function () {
            ok(Tests.required(this.input).valid === false, 'field invalid with no value');

            this.input.value = '1';
            ok(Tests.required(this.input).valid === true, 'field valid with value');            
        });

        test('format', function () {
            this.input.value = '2013-01-01';
            ok(Tests.date(this.input).valid === false, 'field is invalid with ISO date and defualt formatting of mm/dd/yyyy');

            this.input.value = '01/01/2013';
            ok(Tests.date(this.input).valid === true, 'field is valid with defualt formatting of mm/dd/yyyy');

            this.input.setAttribute('data-format', 'yyyy-mm-dd');
            this.input.value = '2013-01-01';
            ok(Tests.date(this.input).valid === true, 'field is valid with ISO date and formatting changed to yyyy/mm/dd');

            this.input.setAttribute('data-format', 'mm.dd.yyyy');
            this.input.value = '01.01.2013';
            ok(Tests.date(this.input).valid === true, 'field is valid with formatting changed to mm.dd.yyyy');

            this.input.setAttribute('data-format', 'mm/dd/yy');
            this.input.value = '01/01/13';
            ok(Tests.date(this.input).valid === false, 'field is invalid with formatting changed to mm/dd/yy');
        });

        test('min', function () {
            var min = '2013-01-01',
                minDate = parseISODate(min);

            this.input.value = '01/01/2013';
            this.input.setAttribute('min', min);
            
            ok(Tests.date(this.input).valid === true, this.input.value + ' is equal to ' + min);

            this.input.value = '01/02/2013';
            ok(Tests.date(this.input).valid === true, this.input.value + ' is greater than ' + min);

            this.input.value = '12/31/2012';
            var t = Tests.date(this.input);
            ok(t.valid === false, this.input.value + ' is less than ' + min);
            equal(t.message, 'Please enter a date greater than or equal to ' + formatISODate(minDate, this.input) + '.', this.input.value + ': correct error message sent');
        });

        test('max', function () {
            var max = '2013-01-01',
                maxDate = parseISODate(max);

            this.input.value = '01/01/2013';
            this.input.setAttribute('max', max);
            
            ok(Tests.date(this.input).valid === true, this.input.value + ' is equal to ' + max);

            this.input.value = '12/31/2012';
            ok(Tests.date(this.input).valid === true, this.input.value + ' is less than ' + max);

            this.input.value = '01/02/2013';
            var t = Tests.date(this.input);
            ok(t.valid === false, this.input.value + ' is grater than ' + max);
            equal(t.message, 'Please enter a date less than or equal to ' + formatISODate(maxDate, this.input) + '.', this.input.value + ': correct error message sent');
        });
        
        test('min/max', function () {
            var min = '2013-01-01',
                max = '2013-01-03',
                minDate = parseISODate(min),
                maxDate = parseISODate(max);

            this.input.setAttribute('min', min);
            this.input.setAttribute('max', max);
            
            this.input.value = '01/01/2013';
            ok(Tests.date(this.input).valid === true, this.input.value + ' is equal to ' + min);

            this.input.value = '01/03/2013';
            ok(Tests.date(this.input).valid === true, this.input.value + ' is equal to ' + max);

            this.input.value = '01/02/2013';
            ok(Tests.date(this.input).valid === true, this.input.value + ' greater than ' + min + ' and less than ' + max);
    
            var t;
            this.input.value = '12/31/2012';
            t = Tests.date(this.input);
            ok(t.valid === false, this.input.value + ' is less than ' + min);
            equal(t.message, 'Please enter a date greater than or equal to ' + formatISODate(minDate, this.input) + '<br> and less than or equal to ' + formatISODate(maxDate, this.input) + '.', this.input.value + ': correct error message sent');

            this.input.value = '01/04/2013';
            t = Tests.date(this.input);
            ok(t.valid === false, this.input.value + ' is greater than ' + max);
            equal(t.message, 'Please enter a date greater than or equal to ' + formatISODate(minDate, this.input) + '<br> and less than or equal to ' + formatISODate(maxDate, this.input) + '.', this.input.value + ': correct error message sent');
        });
    }
}(jQuery));
