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

    module('tests: radio', {
        setup: function () {
             try {
                 this.input = document.createElement('<input type="radio" name="radio">');
             } catch (err) {
                this.input = document.createElement('input');
                this.input.setAttribute('type','radio');
                this.input.setAttribute('name','radio');
             }
        }
    });

    if (InputTypes.radio) {
        test('support', function () {
            ok(InputTypes.radio === true, '\'radio\' type validation is supported by your browser');
        });
    }

    if (!InputTypes.radio) {
        test('no support', function () {
            ok(InputTypes.radio === false, '\'radio\' type validation is not supported by your browser');
        });

        test('required', function () {
            document.getElementById('qunit-fixture').appendChild(this.input);
            ok(Tests.required(this.input).valid === false, 'field invalid when not checked');

            this.input.checked = true;
            ok(Tests.required(this.input).valid === true, 'field valid when checked');            
        });

        test('checked', function () {
            document.getElementById('qunit-fixture').appendChild(this.input);
            ok(Tests.radio(this.input).valid === false, 'field invalid when not checked');

            this.input.checked = true;
            ok(Tests.radio(this.input).valid === true, 'field valid when checked');            
        });
    }

}(jQuery));
