/*
 * Validatr
 * https://github.com/morrowj/validatr
 *
 * Copyright (c) 2013 Jay Morrow
 * Licensed under the MIT license.
 */

(function(window, document, $, undefined) {
    "use strict";

    /*! Modernizr 2.6.2| MIT & BSD
     * Build: http://modernizr.com/download/#-input-inputtypes
     */
    var Support = (function() {

        var Modernizr = {},

            docElement = document.documentElement,

            inputElem  = document.createElement('input'),

            selectElem = document.createElement('select'),

            textareaElem = document.createElement('textarea'),

            smile = ':)',

            tests = {},

            inputs = {},

            attrs = {},

            testElem;

        Modernizr.attributes = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            return attrs;
        })('max min multiple pattern required step'.split(' '));


        Modernizr.inputtypes = (function(props) {
            
            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {
                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;

                        bool =  defaultView.getComputedStyle &&
                        defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                        (inputElem.offsetHeight !== 0);

                        docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;
                    } else {
                        bool = inputElem.value !== smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }

            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));

        (function(props) {        
            for ( var i = 0, len = props.length; i < len; i++ ) {
                testElem = inputElem;
                
                try {
                    testElem.setAttribute('type', props[i]);
                } catch (e) {
                    testElem = document.createElement('<input type="' + props[i] + '">');
                }

                testElem.style.cssText = 'position:absolute;visibility:hidden;';
                Modernizr.inputtypes[ props[i] ] = !!testElem.checkValidity;
            }
        })('text password radio checkbox'.split(' '));

        Modernizr.inputtypes.select = !!selectElem.checkValidity;
        Modernizr.inputtypes.textarea = !!textareaElem.checkValidity;

        inputElem = null;
        testElem = null;
        selectElem = null;
        textareaElem = null;

        return Modernizr;
    }()),

    Rules = {
        boxes: /checkbox|radio/i,
        color: /^#[0-9A-F]{6}$/i,
        date: {
            dd: '(0[1-9]|[12][0-9]|3[01])',
            mm: '(0[1-9]|1[012])',
            yyyy: '(\\d{4})'
        },
        email: /^[a-zA-Z0-9.!#$%&’*+\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/,
        isoDate: /^(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        isoMonth: /^(\d{4})-(0[1-9]|1[012])$/,
        leftright: /left|right/i,
        notInput: /select|textarea/i,
        number: /^-?\d*\.?\d*$/,
        separators: /(\/|\-|\.)/g,
        separatorsNoGroup: /\/|\-|\./g,
        spaces: /,\s*/,
        time: /^([01][0-9]|2[0-3])(:([0-5][0-9])){2}$/,
        topbottom: /top|bottom/i,
        url: /^\s*https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?\s*$/
    },

    Tests = {
        checkbox: function (element) {
            return {
                valid: element.checked,
                message: $.validatr.messages.checkbox
            };
        },

        color: function (element) {
            return {
                valid: Rules.color.test(element.value),
                message: $.validatr.messages.color
            };
        },

        date: function (element) {
            var $element = $(element),
                value = Support.inputtypes.date ? parseISODate(element.value) : parseDate(element),
                min = $element.attr('min') ? parseISODate($element.attr('min')) : false,
                max = $element.attr('max') ? parseISODate($element.attr('max')) : false,
                step = false;
            
            return minMax.call(element, value, min, max, step, 'date');
        },

        email: function (element) {
            var valid = true,
                msg = $.validatr.messages.email.single,
                multiple = Support.attributes.multiple ? element.multiple : $(element).is('[multiple]');

            if (multiple) {
                var values = element.value.split(Rules.spaces);

                $.each(values, function (i, value) {
                    if (!Rules.email.test(value)) {
                        valid = false;
                        msg = $.validatr.messages.email.multiple;
                        return;
                    }
                });
            } else {
                valid = Rules.email.test(element.value);
            }

            return {
                valid: valid,
                message: msg
            };
        },

        number: function (element) {
            var value = element.value.replace(',', ''),
                num = Rules.number.test(value) ? parseFloat(value) : false,
                min = Rules.number.test( element.getAttribute('min') ) ? parseFloat( element.getAttribute('min') ) : false,
                max = Rules.number.test( element.getAttribute('max') ) ? parseFloat( element.getAttribute('max') ) : false,
                step = Rules.number.test( element.getAttribute('step') ) ? parseFloat( element.getAttribute('step') ) : element.getAttribute('step') === 'any' ? 'any' : false;
            
            if (step === false || step <= 0) {
                step = 1;
            }

            return minMax.call(element, value, min, max, step, 'number');
        },

        pattern: function (element) {
            return {
                valid: new RegExp(element.getAttribute('pattern')).test(element.value),
                message: $.validatr.messages.pattern
            };
        },

        radio: function (element) {
            return {
                valid: $(document.getElementsByName(element.name)).is(':checked'),
                message: $.validatr.messages.radio
            };
        },

        range: function (element) {
            return this.number(element);
        },

        required: function (element) {
            if (Rules.boxes.test(element.type)) {
                return this[element.type](element);
            }

            return {
                valid: !!element.value.length,
                message: element.nodeName.toLowerCase() === 'select' ? $.validatr.messages.select : $.validatr.messages.required
            };
        },

        time: function (element) {
            return {
                valid: Rules.time.test(element.value),
                message: $.validatr.messages.time
            };
        },

        url: function (element) {
            return {
                valid: Rules.url.test(element.value),
                message: $.validatr.messages.url
            };
        }
    },

    CustomTests = {
        as: function (element) {
            if (element.type !== 'text') {
                throw new Error('element must have a type of text');
            }

            var type = element.getAttribute('data-as');

            if (Tests[type]) {
                return Tests[type](element);
            }
        },

        match: function (element) {
            var match = element.getAttribute('data-match'),
                source = document.getElementById(match) || document.getElementsByName(match)[0];

            if (!source) {
                return {
                    valid: false,
                    message: "'" + match + "' can not be found"
                };
            }

            $(source)
                .off('valid.validatrinput')
                .on('valid.validatrinput', function () {
                    if (element.value === source.value) {
                        validateElement(element);
                    }
                });

            return {
                valid: element.value === source.value,
                message: "'" + element.name + "' does not equal '" + source.name +"'"
            };
        }
    },

    KeyCodes = [
        16, // shift
        17, // control
        18, // alt
        19, // pause/break
        20, // caps lock
        33, // page up
        34, // page down
        35, // end
        36, // home
        37, // left arrow
        39  //right arrow
    ],

    indexOf = function (array, value) {
        var index = -1,
            length = array ? array.length : 0;


        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }

        return -1;
    },

    parseDate = function (element) {
        var format = element.getAttribute('data-format') || $.fn.validatr.defualtOptions.dateFormat,
            split = format.split(Rules.separatorsNoGroup),
            dateSplit = element.value.split(Rules.separatorsNoGroup),
            isoSplit = 'yyyy-mm-dd'.split('-'),
            rule = format.replace(Rules.separators, '\\$1')
                        .replace('yyyy', Rules.date.yyyy)
                        .replace('mm', Rules.date.mm)
                        .replace('dd', Rules.date.dd),
            index = -1,
            length = isoSplit.length,
            iso = [];
   
        rule = new RegExp(rule);
        if (!rule.test(element.value)) {
            return false;
        }

        while (++index < length) {
            iso[index] = dateSplit[ indexOf(split, isoSplit[index]) ];
        }
        
        return parseISODate(iso.join('-'));
    },

    parseISODate = function (dateString) {
        if (!Rules.isoDate.test(dateString)) {
            return false;
        }

        var date = Rules.isoDate.exec(dateString);
        return new Date(parseInt(date[1], 10), parseInt(date[2], 10) - 1, parseInt(date[3], 10));
    },

    formatISODate = function (dateObj, element) {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        var date = pad(dateObj.getDate()),
            month = pad(dateObj.getMonth() + 1),
            year = dateObj.getFullYear(),
            dateString = (element.getAttribute('data-format') || $.fn.validatr.defualtOptions.dateFormat).replace('mm', month).replace('yyyy', year).replace('dd', date);

        return dateString;
    },

    minMax = function (value, min, max, step, type) {
        var result = true,
            msg = $.validatr.messages.range.base,
            minString = min,
            maxString = max;

        if (type === 'date') {
            minString = min && formatISODate(min, this);
            maxString = max && formatISODate(max, this);
        }

        if (value !== false) {
            if (step !== false) {
                result = step === 'any' ? true : (value - min) % step === 0;
                msg = $.validatr.messages.range.invalid;
            }

            if (result) {
                if (min !== false && max !== false) {
                    result = value >= min && value <= max;
                    msg = $.validatr.messages.range.overUnder;
                } else if (min !== false) {
                    result = value >= min;
                    msg = $.validatr.messages.range.overflow;
                } else if (max !== false) {
                    result = value <= max;
                    msg = $.validatr.messages.range.underflow;
                }  
            }
        }

        return {
            valid: value !== false && result,
            message: msg.replace('{{type}}', type).replace('{{min}}', minString).replace('{{max}}', maxString)
        };    
    },

    getNode = function (element) {
        if (element instanceof jQuery) {
            element = element[0];
        }
        return element;
    },

    theme = {
        bootstrap: 'alert alert-error',
        jqueryui: 'ui-state-error ui-corner-all'
    },

    inlineStyles = {
        color: '#f0444d',
        backgroundColor: '#ffcbcb',
        border: '1px solid #e4a6af',
        padding: '2px 6px',
        borderRadius: '2px'

    },

    supressError = false,

    // Validatr
    Validatr = function () {};

    Validatr.prototype = {
        addTest: function (name) {
            var isObject = typeof name !== 'string',
                args = Array.prototype.slice.call(arguments, 1)[0];

            if (isObject) {
                $.extend(CustomTests, name);
            } else {
                if (!args) {
                    throw new Error("You must include a callback function");
                }
                CustomTests[name] = args;
            }
        },

        getElements: function (form) {
            if (this.elements) {
                return this.elements;
            }

            var elements = $(form).map(function () {
                    return $.makeArray(this.elements);
                })
                .not('fieldset, button, input[type=submit], input[type=button], input[type=reset]');

            if (form.id) {
                elements = elements.add($('[form="' + form.id + '"]'));
            }

            return elements;
        },

        validateElement: function (element) {
            if (!element) {
                throw new Error('method requires an element');
            }

            supressError = true;
            var valid = validateElement(getNode(element));
            supressError = false;

            return valid;
        },

        validateForm: function (form) {
            var element = this.el || getNode(form),
                valid;

            if (element.nodeName.toLowerCase() !== 'form') {
                throw new Error('you must pass a form to this method');
            }

            supressError = true;
            valid = validateForm(this.elements || this.getElements(element));
            supressError = false;

            return valid;
        }
    };

    function init (el, options) {
        /*jshint validthis:true */

        this.el = el;
        this.$el = $(el);

        if (!this.$el.length || !this.$el.is('form')) {
            throw new Error('validatr' + ' needs a form to work.');
        }

        this.isSubmit = false;
        this.firstError = false;

        this.options = $.extend({}, $.fn.validatr.defualtOptions, options);

        this.template = (function (options) {
            var template = $(options.template).addClass('validatr-message');
            
            if (options.theme.length) {
                template.addClass(theme[options.theme] || options.theme);
            } else {
                template.css(inlineStyles);
            }

            return template[0].outerHTML;
        }(this.options));

        this.elements = this.getElements(this.el)
            .on('valid.' + 'validatr', $.proxy(validElement, this))
            .on('invalid.' + 'validatr', $.proxy(invalidElement, this));

        this.el.noValidate = true;
        this.$el.on('submit.' + 'validatr', $.proxy(submitForm, this));
        this.$el.on('reset.' + 'validatr', $.proxy(resetForm, this));
    }

    function bindElements() {
        /*jshint validthis:true */

        this.elements.on({
            'focus.validatrelement': bindEvents,
            'blur.validatrelement': unbindEvents 
        });

        $('input[type=radio], input[type=checkbox]').on('click.validatrelement', function (e) {
            validateElement(e.target);
        });
    }

    function unbindElements() {
        /*jshint validthis:true */

        this.elements.off('.validatrelement');
    }

    function bindEvents (e) {
        var target = e.target,
            $target = target;

        if (target.nodeName.toLowerCase() === 'select') {
            $target.on('change.validatrinput', function () {
                setTimeout(function () {
                    validateElement(target);                
                }, 1);
            });
        }

        $(target).on({
            'blur.validatrinput': function () {
                validateElement(target);                
            },
            'keyup.validatrinput': function (event) {
                if (target.value.length && indexOf(KeyCodes, event.keyCode) === -1) {
                    validateElement(target);
                }                
            }
        });
    }

    function unbindEvents(e) {
        $(e.target).off('.validatrinput');
    }

    function validateElement(element) {
        if (element.type === 'radio') {
            var radio = $(document.getElementsByName(element.name)).filter('[required]');
            if (radio.length) {
                element = radio[0];
            }
        }

        var $element = $(element),
            type = Rules.notInput.test(element.nodeName) ? element.nodeName.toLowerCase() : element.getAttribute('type'),
            required = Support.attributes.required ? element.required : $(element).is('[required]'),
            check = {
                valid: true,
                message: ''
            };

        if (Support.inputtypes[type]) {
            check.valid = element.validity.valid;
            check.message = element.validationMessage;
        } else {
            if (required) {
                check = Tests.required(element);
            }   

            if (check.valid && element.value.length && !Rules.boxes.test(type)) {
                if (element.pattern) {
                    type = 'pattern';
                }

                if (Tests[type]) {
                    check = Tests[type](element);
                }
            }
        }

        if (check.valid) {
            for (var test in CustomTests) {
                if (CustomTests.hasOwnProperty(test) && $element.is('[data-' + test + ']')) {
                    check = CustomTests[test](element);
                    if (!check.valid) {
                        break;
                    }
                }
            }
        }

        if (check.valid) {
            $element.trigger('valid');
            return true;
        } 
        
        $.data(element, 'validationMessage', check.message);
        $element.trigger('invalid');
        
        return false;
    }

    function validateForm (elements) {
        var valid = true;        

        elements.each(function (i, element) {
            if (!validateElement(element)) {
                valid = false;
            }
        });

        return valid;
    }

    function submitForm() {
        /*jshint validthis:true */

        this.isSubmit = true;
        resetForm.call(this);
        var valid = validateForm(this.elements);

        if (valid) {
            return this.options.valid.call(this.el, this.el);
        } else {
            bindElements.call(this);
        }

        this.isSubmit = false;
        return valid;
    }

    function resetForm() {
        /*jshint validthis:true */

        unbindElements.call(this);
        this.firstError = false;
        this.elements.next('.validatr-message').remove();
    }

    function invalidElement(e) {
        /*jshint validthis:true */

        if (supressError) {
            return;
        }

        e.preventDefault();

        var target = e.target,
            $target = $(target),
            options = this.options,
            msg = target.getAttribute('data-message') || $.data(target, 'validationMessage'),
            error = $(this.template.replace('{{message}}', msg));


        if (this.isSubmit && !this.firstError) {
            this.firstError = $target.after(error);
            options.position.call(this, error, $target);
            return;
        }

        if (!this.isSubmit || options.showall) {
            validElement(e);
            $target.after(error);
            options.position.call(this, error, $target);
        }
    }

    function validElement(e) {
        if (supressError) {
            return;
        }

        $(e.target).next('.validatr-message').remove();
    }

    function position(error, $target) {
        /*jshint validthis:true */
        error.css('position', 'absolute');

        var offset = $target.offset(),
            location = $target[0].getAttribute('data-location') || this.options.location;

        if (Rules.topbottom.test(location)) {
            error.offset({left: offset.left});

            if (location === 'top') {
                error.offset({top: offset.top - error.outerHeight() - 2});
            }

            if (location === 'bottom') {
                error.offset({top: offset.top + error.outerHeight()});
            }            
        } else if (Rules.leftright.test(location)) {
            error.offset({top: (offset.top + $target.outerHeight() / 2) - (error.outerHeight() / 2)});

            if (location === 'left') {
                error.offset({left: offset.left - error.outerWidth() - 2});
            }

            if (location === 'right') {
                error.offset({left: offset.left + $target.outerWidth() + 2});
            }            
        }        
    }

    /*! Inspired by jQuery UI - v1.9.2 - 2012-12-04
     * http://jqueryui.com
     * Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT 
     */
    $.fn.validatr = function(options) {
        var isMethod = typeof options === 'string',
            args = Array.prototype.slice.call(arguments, 1),
            returnValue = this,
            instance;

        if (isMethod) {
            this.each(function() {
                var methodValue;
                
                instance = $.data(this, 'validatr');
                if (!instance) {
                    throw new Error("cannot call methods on validatr prior to initialization; attempted to call method '" + options + "'" );
                }
                if (!$.isFunction(instance[options])) {
                    throw new Error( "no such method '" + options + "' for validatr instance" );
                }

                methodValue = instance[options].apply(instance, args);
                if (methodValue !== instance && methodValue !== undefined) {
                    returnValue = methodValue && methodValue.jquery ? returnValue.pushStack( methodValue.get() ) : methodValue;
                    return false;
                }
            });
        } else {
            var widget;
            this.each(function() {
                instance = $.data(this, 'validatr');
                if (!instance) {
                    widget = new Validatr();
                    init.call(widget, this, options || {});
                    $.data(this, 'validatr', widget);
                }
            });
        }

        return returnValue;
    };

    $.fn.validatr.defualtOptions = {
        dateFormat: 'yyyy-mm-dd',
        location: 'right',
        position: position,
        showall: false,
        template: '<div>{{message}}</div>',
        theme: '',
        valid: $.noop
    };

    $.validatr = new Validatr();
    
    $.validatr.messages = {
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
    };
    
    $.validatr.debug = function () {
        /*global QUnit */
        
        if (!QUnit) {
            throw new Error('QUnit is required for debugging');
        }

        this.Support = Support;
        this.Tests = Tests;
        this.CustomTests = CustomTests;
        this.parseDate = parseDate;
        this.parseISODate = parseISODate;
        this.formatISODate = formatISODate;
    };

    // Custom selector.
    $.expr[':'].validatr = function(elem) {
        return elem.textContent.indexOf('validatr') >= 0;
    };

}(this, this.document, jQuery));
