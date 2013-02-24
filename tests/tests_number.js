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

    module('tests: number', {
        setup: function () {
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'number');
        }
    });

    if (InputTypes.number) {
        test('support', function () {
            ok(InputTypes.number === true, '\'number\' type validation is supported by your browser');
        });
    }

    if (!InputTypes.number) {
        test('no support', function () {
            ok(InputTypes.number === false, '\'number\' type vaildation is not supported by your browser');
        });
    
        test('required', function () {
            ok(Tests.required(this.input).valid === false, 'field invalid with no value');

            this.input.value = '1';
            ok(Tests.required(this.input).valid === true, 'field valid with value');            
        });

        test('format', function () {
            this.input.value = 'a';
            ok(Tests.number(this.input).valid === false, '\'' + this.input.value + '\' is not a valid number');

            this.input.value = '1a';
            ok(Tests.number(this.input).valid === false, '\'' + this.input.value + '\' is not a valid number');

            this.input.value = '1';
            ok(Tests.number(this.input).valid === true, '\'' + this.input.value + '\' is a valid number');

            this.input.value = '-1';
            ok(Tests.number(this.input).valid === true, '\'' + this.input.value + '\' is a valid number');

            this.input.value = '1,1';
            ok(Tests.number(this.input).valid === true, '\'' + this.input.value + '\' is a valid number');
        });

        test('min', function () {
            var min = '5';

            this.input.value = '5';
            this.input.setAttribute('min', min);
            
            ok(Tests.number(this.input).valid === true, this.input.value + ' is equal to ' + min);

            this.input.value = '6';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is greater than ' + min);

            
            this.input.value = '4';
            var t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is less than ' + min);
            equal(t.message, 'Please enter a number greater than or equal to ' + min + '.', this.input.value + ': correct error message sent'); 
        });

        test('max', function () {
            var max = '5';

            this.input.value = '5';
            this.input.setAttribute('max', max);
            
            ok(Tests.number(this.input).valid === true, this.input.value + ' is equal to ' + max);

            this.input.value = '4';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is less than ' + max);

            
            this.input.value = '6';
            var t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is greater than ' + max);
            equal(t.message, 'Please enter a number less than or equal to ' + max + '.', this.input.value + ': correct error message sent'); 
        });
        
        test('step', function () {
            ok(this.input.getAttribute('step') === null, 'step is not set');

            this.input.value = '1';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is valid when step is null');

            this.input.value = '1.5';
            ok(Tests.number(this.input).valid === false, this.input.value + ' is invalid when step is null');

            var step = '0';
            this.input.setAttribute('step', step);
            
            this.input.value = '1';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is valid when step is ' + this.input.getAttribute('step'));

            this.input.value = '1.5';
            ok(Tests.number(this.input).valid === false, this.input.value + ' is invalid when step is ' + this.input.getAttribute('step'));

            step = '-1';
            this.input.setAttribute('step', step);
            
            this.input.value = '1';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is valid when step is ' + this.input.getAttribute('step'));

            this.input.value = '1.5';
            ok(Tests.number(this.input).valid === false, this.input.value + ' is invalid when step is ' + this.input.getAttribute('step'));

            step = '2';
            this.input.setAttribute('step', step);
            
            this.input.value = '2';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is valid when step is ' + this.input.getAttribute('step'));

            this.input.value = '-2';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is valid when step is ' + this.input.getAttribute('step'));

            this.input.value = '1';
            var t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is invalid when step is ' + this.input.getAttribute('step'));
            equal(t.message, 'Invalid number', 'error message: ' + t.message); 
       });

        test('min/max/step', function () {
            var min = '1',
                max = '10',
                step = '2',
                t;

            this.input.setAttribute('min', min);
            this.input.setAttribute('max', max);
            this.input.setAttribute('step', step);
            
            this.input.value = '-1';
            t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is less than ' + min);
            equal(t.message, 'Please enter a number greater than or equal to ' + min + '<br> and less than or equal to ' + max + '.', this.input.value + ': correct error message sent'); 

            this.input.value = '0';
            t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is less than ' + min);
            equal(t.message, 'Invalid number', this.input.value + ': correct error message sent'); 

            this.input.value = '1';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is equal to ' + min + ' and valid step');

            this.input.value = '2';
            t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is greater than ' + min + ' and invalid step');
            equal(t.message, 'Invalid number', this.input.value + ': correct error message sent'); 

            this.input.value = '9';
            ok(Tests.number(this.input).valid === true, this.input.value + ' is greater than ' + min + ', less than ' + max + ', and valid step');

            this.input.value = '10';
            t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is equal to ' + max + ' and invalid step');
            equal(t.message, 'Invalid number', this.input.value + ': correct error message sent'); 

            this.input.value = '11';
            t = Tests.number(this.input);
            ok(t.valid === false, this.input.value + ' is greater than ' + max + ' and valid step');
            equal(t.message, 'Please enter a number greater than or equal to ' + min + '<br> and less than or equal to ' + max + '.', this.input.value + ': correct error message sent'); 
        });
    }
}(jQuery));
