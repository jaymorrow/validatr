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

    module('tests: checkbox', {
        setup: function () {
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'checkbox');
        }
    });

    if (InputTypes.checkbox) {
        test('support', function () {
            ok(InputTypes.checkbox === true, '\'checkbox\' type validation is supported by your browser');
        });
    }

    if (!InputTypes.checkbox) {
        test('no support', function () {
            ok(InputTypes.checkbox === false, '\'checkbox\' type validation is not supported by your browser');
        });

        test('required', function () {
            ok(Tests.required(this.input).valid === false, 'field invalid when not checked');

            this.input.checked = true;
            ok(Tests.required(this.input).valid === true, 'field valid when checked');            
        });

        test('checked', function () {
            ok(Tests.checkbox(this.input).valid === false, 'field invalid when not checked');

            this.input.checked = true;
            ok(Tests.checkbox(this.input).valid === true, 'field valid when checked');            
        });
    }

}(jQuery));
