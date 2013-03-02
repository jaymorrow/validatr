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

    var Tests = $.validatr.Tests;

    module('tests: pattern', {
        setup: function () {
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'text');
        }
    });

    test('number', function () {
        var pattern = '\\d';

        this.input.setAttribute('pattern', pattern);
        this.input.value = '1';
        ok(Tests.pattern(this.input).valid === true, this.input.value + ' matches the pattern ' + pattern);
    });

    test('color', function () {
        var pattern = '#[A-Fa-f0-9]{6}';

        this.input.setAttribute('pattern', pattern);
        this.input.value = '#000000';
        ok(Tests.pattern(this.input).valid === true, this.input.value + ' matches the pattern ' + pattern);
    });

}(jQuery));
