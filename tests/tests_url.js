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

    module('tests: url', {
        setup: function () {
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'url');
        }
    });

    if (InputTypes.url) {
        test('support', function () {
            ok(InputTypes.url === true, '\'url\' type validation is supported by your browser');
        });
    }

    if (!InputTypes.url) {
        test('no support', function () {
            ok(InputTypes.url === false, '\'url\' type validation is not supported by your browser');
        });

        test('required', function () {
            ok(Tests.required(this.input).valid === false, 'field invalid without a value');

            this.input.value = '1';
            ok(Tests.required(this.input).valid === true, 'field valid with a value');            
        });

        test('format', function () {
            this.input.value = 'example';
            ok(Tests.url(this.input).valid === false, this.input.value + ' is an invalid url');

            this.input.value = 'example.com';
            ok(Tests.url(this.input).valid === false, this.input.value + ' is an invalid url');

            this.input.value = 'www.example.com';
            ok(Tests.url(this.input).valid === false, this.input.value + ' is an invalid url');

            this.input.value = '//www.example.com';
            ok(Tests.url(this.input).valid === false, this.input.value + ' is an invalid url');

            this.input.value = '://www.example.com';
            ok(Tests.url(this.input).valid === false, this.input.value + ' is an invalid url');

            this.input.value = 'http://';
            ok(Tests.url(this.input).valid === false, this.input.value + ' is an invalid url');

            this.input.value = 'http://www.example.com';
            ok(Tests.url(this.input).valid === true, this.input.value + ' is a valid url');            

            this.input.value = 'https://www.example.com';
            ok(Tests.url(this.input).valid === true, this.input.value + ' is a valid url');            

            this.input.value = 'https://www';
            ok(Tests.url(this.input).valid === true, this.input.value + ' is a valid url');            
        });
    }

}(jQuery));
