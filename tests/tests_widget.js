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
    var form = '<form><fieldset><legend>Legend</legend><input type="text" name="text" required></fieldset></form>',
        validatr = $.validatr;

    module('instance', {
        setup: function () {
            var fixture = $('#qunit-fixture').append(form);
            this.form = fixture.find('form');
            this.input = this.form.find('input');
        }
    });

    test('method: getElements', function () {
        var input = validatr.getElements(this.form);
        ok(input.length === 1, 'returned one input');
        ok(input.is(this.input), 'input elements are the same');
    });

    test('method: validateElement', function () {
        var valid = validatr.validateElement(this.input);
        ok(valid === false, 'jQuery input is invalid');

        valid = validatr.validateElement(this.input[0]);
        ok(valid === false, 'input is invalid');

        this.input[0].value = 1;
        valid = validatr.validateElement(this.input);
        ok(valid === true, 'jQuery input is valid');
        
        valid = validatr.validateElement(this.input[0]);
        ok(valid === true, 'input is valid');
    });

    test('method: validateForm', function () {
        var valid = validatr.validateForm(this.form);
        ok(valid === false, 'jQuery form is invalid');

        valid = validatr.validateForm(this.form[0]);
        ok(valid === false, 'form is invalid');

        this.input[0].value = 1;
        valid = validatr.validateForm(this.form);
        ok(valid === true, 'jQuery form is valid');
        
        valid = validatr.validateForm(this.form[0]);
        ok(valid === true, 'form is valid');
    });

    module('widget', {
        setup: function () {
            var fixture = $('#qunit-fixture').append(form);
            this.form = fixture.find('form').validatr();
            this.input = this.form.find('input');
        }
    });

    test('init', function () {
        ok(this.form.is(':validatr'), 'validatr initialized');
        deepEqual(this.form.data('validatr').options, $.fn.validatr.defaultOptions, 'default options set');
    });

    test('method: option', function () {
        deepEqual(this.form.validatr('option'), $.fn.validatr.defaultOptions, 'default options retrieved');

        this.form.validatr('option', 'location', 'left');
        equal(this.form.data('validatr').options.location, 'left', 'location set to left');
        equal(this.form.validatr('option', 'location'), 'left', 'location option retrieved');
    });

    test('method: getElements', function () {
        var input = this.form.validatr('getElements');
        ok(input.length === 1, 'returned one input');
        ok(input.is(this.input), 'input elements are the same');
    });

    test('method: validateElement', function () {
        var valid = this.form.validatr('validateElement', this.input);
        ok(valid === false, 'jQuery input is invalid');

        valid = this.form.validatr('validateElement', this.input[0]);
        ok(valid === false, 'input is invalid');

        this.input[0].value = 1;
        valid = this.form.validatr('validateElement', this.input);
        ok(valid === true, 'jQuery input is valid');
        
        valid = this.form.validatr('validateElement', this.input[0]);
        ok(valid === true, 'input is valid');
    });

    test('method: validateForm', function () {
        var valid = this.form.validatr('validateForm');
        ok(valid === false, 'form is invalid');

        this.input[0].value = 1;        
        valid = this.form.validatr('validateForm');
        ok(valid === true, 'form is valid');
    });

    test('event: submit', function () {
        expect(2);

        this.form.validatr('option', 'valid', function () {
            ok(1, 'form is valid');
            return false;
        })
        .on('invalid', function () {
            ok(1, 'form is invalid');
        });

        this.form.trigger('submit');

        this.input[0].value = 1;
        this.form.trigger('submit');
    });

    test('error message', function () {
        this.form.trigger('submit');
        ok(this.input.next().hasClass('validatr-message'), 'error message inserted after field');
    });

    test('event: reset', function () {
        this.form.trigger('submit');
        this.form.trigger('reset');
        ok(this.input.next().length === 0, 'error message has been removed');
    });

}(jQuery));
