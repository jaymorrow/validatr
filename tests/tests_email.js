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
        Tests = $.validatr.Tests;

    module('tests: email', {
        setup: function () {
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'email');
        }
    });

    if (InputTypes.email) {
        test('support', function () {
            ok(InputTypes.email === true, '\'email\' type validation is supported by your browser');
        });
    }

    if (!InputTypes.email) {
        test('no support', function () {
            ok(InputTypes.email === false, '\'email\' type validation is not supported by your browser');
        });

        test('required', function () {
            ok(Tests.required(this.input).valid === false, 'field invalid without a value');

            this.input.value = '1';
            ok(Tests.required(this.input).valid === true, 'field valid with a value');            
        });

        test('format', function () {
            this.input.value = 'a';
            ok(Tests.email(this.input).valid === false, this.input.value + ' is an invalid email address');

            this.input.value = 'a@';
            ok(Tests.email(this.input).valid === false, this.input.value + ' is an invalid email address');

            this.input.value = 'a@a.';
            ok(Tests.email(this.input).valid === false, this.input.value + ' is an invalid email address');

            this.input.value = 'a@a.com.';
            ok(Tests.email(this.input).valid === false, this.input.value + ' is an invalid email address');

            this.input.value = 'a@a';
            ok(Tests.email(this.input).valid === true, this.input.value + ' is a valid email address');            

            this.input.value = 'a@a.com';
            ok(Tests.email(this.input).valid === true, this.input.value + ' is a valid email address');            
        });        

        test('multiple', function () {
            this.input.setAttribute('multiple');

            this.input.value = 'a@a.com a@a.com';
            ok(Tests.email(this.input).valid === false, this.input.value + ' is an invalid list of email addresses');

            this.input.value = 'a@a.,a@a.com';
            ok(Tests.email(this.input).valid === false, this.input.value + ' is an invalid list of email addresses');

            this.input.value = 'a@a.com';
            ok(Tests.email(this.input).valid === true, this.input.value + ' is a valid email address');

            this.input.value = 'a@a.com,a@a.com';
            ok(Tests.email(this.input).valid === true, this.input.value + ' is a valid comma separated list of email addresses');

            this.input.value = 'a@a.com, a@a.com';
            ok(Tests.email(this.input).valid === true, this.input.value + ' is a valid comma separated list of email addresses');
        });
    }

}(jQuery));
