/*
 * Validatr
 * https://github.com/morrowj/validatr
 *
 * Copyright (c) 2013 Jay Morrow
 * Licensed under the MIT license.
 */

(function(window, $, undefined) {
    "use strict";

    /*! Modernizr 2.6.2 (Custom Build) | MIT & BSD
     * Build: http://modernizr.com/download/#-input-inputtypes
     */
    var Support = (function( window, document, undefined ) {

        var Modernizr = {},

        docElement = document.documentElement,

        smile = ':)',

        inputElem  = document.createElement('input'),

        tests = {},

        inputs = {},

        attrs = {};

        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));

        Modernizr['inputtypes'] = (function(props) {

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

        inputElem = null;

        return Modernizr;
    })(window, window.document),

    /*! Underscore.js 1.4.4
     * http://underscorejs.org
     * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
     * Underscore may be freely distributed under the MIT license.
     */
    debounce = function(func, wait, immediate) {
        var timeout, result;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
            }
            return result;
        };
    },

    uiExists = $.ui !== undefined,

    widgetName = 'validatr',

    theme = {
        base: widgetName + '-message ',
        bootstrap: 'alert alert-error',
        jqueryui: 'ui-state-error ui-corner-all',
        none: widgetName + '-error'
    },

    submit = 'button, input[type=submit], input[type=button], input[type=reset]',

    supressError = false,

    regex = {
        boxes: /checkbox|radio/i,
        color: /^#[0-9A-F]{6}$/i,
        date: /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
        email: /^[a-zA-Z0-9.!#$%&’*+\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/,
        leftright: /left|right/i,
        time: /^([01][0-9]|2[0-3])(:([0-5][0-9])){2}$/,
        topbottom: /top|bottom/i,
        url: /https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },

    checkValidity = {
        checkbox: function (element) {
            return {
                valid: element.checked,
                message: 'Please check this box if you want to proceed.'
            }
        },

        color: function (element) {
            return {
                valid: regex.color.test(element.value),
                message: 'Please enter a color in the format #xxxxxx'
            };
        },

        date: function (element) {
            return {
                valid: regex.date.test(element.value),
                message: 'Please enter a date in the format mm/dd/yyyy'
            };
        },

        email: function (element) {           
            return {
                valid: regex.email.test(element.value),
                message: 'Please enter an email address.'
            };
        },

        match: function (element, match) {
            var source = document.getElementById(match) || document.getElementsByName(match)[0];

            if (!source) {
                return {
                    valid: false,
                    message: "'" + match + "' can not be found"
                };
            }

            return {
                valid: element.value === source.value,
                message: "'" + element.name + "' does not equal '" + source.name +"'"
            };
        },

        number: function (element) {
            var $element = $(element),
                value = isNaN(parseFloat(element.value)) ? false : parseFloat(element.value),
                min = value !== false ? isNaN($element.attr('min')) ? false : parseFloat($element.attr('min')) : value,
                max = value !== false ? isNaN($element.attr('max')) ? false : parseFloat($element.attr('max')) : value,
                result = true,
                msg = 'Please enter a number';


            if (min !== false && max !== false) {
                result = value >= min && value <= max;
                msg = 'Please enter a number greater than or equal to ' + min + ' and less than or equal to ' + max + '.';
            } else if (min !== false) {
                result = value >= min;
                msg = 'Please enter a number greater than or equal to ' + min + '.';
            } else if (max !== false) {
                result = value <= max;
                msg = 'Please enter a number less than or equal to ' + max + '.';
            }

            return {
                valid: value !== false && result,
                message: msg
            };
        },

        pattern: function (element) {
            return {
                valid: new RegExp(element.pattern).test(element.value),
                message: 'Please match the requested format.'
            };
        },

        radio: function (element) {
            return {
                valid: $('input[type="radio"][name="' + element.name + '"]:checked').length,
                message: 'Please select one of these options.'
            };
        },

        range: function (element) {
            return this.number(element);
        },

        required: function (element) {
            if (regex.boxes.test(element.type)) {
                return this[element.type](element);
            }

            return {
                valid: element.value.length,
                message: element.nodeName.toLowerCase() === 'select' ? 'Please select an item in the list.' : 'Please fill out this field.'
            };
        },

        text: function () {
            return {
                valid: true
            };
        },

        time: function (element) {
            return {
                valid: regex.time.test(element.value),
                message: 'Please enter a time in the format hh:mm:ss'
            };
        },

        url: function (element) {
            return {
                valid: regex.url.test(element.value),
                message: 'Please enter a url.'
            };
        }
    },

    getNode = function (element) {
        if (element instanceof jQuery) {
            element = element[0];
        }
        return element;
    },

    Widget = function () {};

    Widget.prototype = {

        getElements: function (form) {
            if (this.elements) {
                return this.elements;
            }

            return $(form)
                .map(function () {
                    return this.elements ? $.makeArray(this.elements) : $.makeArray($(this).find('input, textarea, select'));
                })
                .not(submit);
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
            valid = submitForm(this.elements || this.getElements(element));
            supressError = false;

            return valid;
        }
    };

    function init (el, options) {
        /*jshint validthis:true */

        this.el = el;
        this.$el = $(el);

        if (!this.$el.length || !this.$el.is('form')) {
            throw new Error(widgetName + ' needs a form to work.');
        }

        this.isSubmit = false;
        this.firstError = null;

        this.options = $.extend({}, $.fn[widgetName].defualtOptions, options);
        this.options.template = $(this.options.template).addClass(theme.base + theme[this.options.theme])[0].outerHTML;

        this.elements = this.getElements(this.el)
            .on('valid.' + widgetName, $.proxy(clearError, this))
            .on('invalid.' + widgetName, $.proxy(invalid, this));

        if (this.options.event) {
            this.elements.on('blur.' + widgetName, $.proxy(blur, this));
        }

        if (/key/i.test(this.options.event)) {
            this.elements.on('focus.' + widgetName, $.proxy(focus, this));
        }

        this.el.noValidate = true;
        this.$el.on('submit.' + widgetName, $.proxy(submitEvent, this, this.elements));
        this.$el.on('reset.' + widgetName, $.proxy(resetForm, this));
    }

    function validateElement(element) {
        var type = element.getAttribute('type'),
            required = Support.input.required ? element.required : isRequired(element),
            match = $(element).data('match'),
            check = {},
            valid = true;

        if (element.willValidate) {
            valid = element.checkValidity();
            
            if (!valid) {
                return false;
            } 
        } else {
            if (required) {
                check = checkValidity.required(element);
                valid = check.valid;
            }   

            if (valid && element.value.length && !regex.boxes.test(type)) {
                if (element.pattern) {
                    type = 'pattern';
                }

                if (checkValidity[type]) {
                    check = checkValidity[type](element);
                    valid = check.valid;
                } else {
                    valid = true;
                }
            }
        }

        if (valid && match) {
            check = checkValidity['match'](element, match);
            valid = check.valid;
        }

        if (valid) {
            $(element).trigger('valid');
            return true;
        } 

        $.data(element, 'validationMessage', check.message);
        $(element).trigger('invalid');
        
        return false;
    }

    function submitEvent(elements) {
        /*jshint validthis:true */

        this.isSubmit = true;
        this.firstError = null;

        resetForm.call(this);
        var valid = submitForm(elements);
        

        if (valid) {
            return this.options.valid.call(this.el, this.el);
        } else {
            this.firstError.focus();
        }

        this.isSubmit = false;
        this.firstError = null;

        return valid;
    }

    function submitForm (elements) {
        var valid = true;        

        elements.each(function (i, element) {
            if (!validateElement(element)) {
                valid = false;
            }
        });

        return valid;
    }

    function resetForm() {
        /*jshint validthis:true */
        this.$el.find('.validatr-message').remove();
    }

    function isRequired(element) {
        if (element.required) {
            return element.required === 'true';
        }

        var attrs = element.attributes,
            length = attrs.length,
            x = 0;

        for (x; x < length; x += 1) {
            if (attrs[x].name === 'required') {
                element.required = "true";
                return true;
            }
        }

        element.required = "false";
        return false;
    }

    function focus(e) {
        /*jshint validthis:true */

        var target = e.target,
            $target = $(target),
            that = this;

        $target.on(this.options.event + '.' + widgetName, debounce(function () {
            if (target.value.length) {
                validateElement(target);
            }
        }, this.options.delay));
    }

    function blur(e) {
        /*jshint validthis:true */
        var target = e.target,
            $target = $(target);

        $target.off(this.options.event + '.' + widgetName);
        validateElement(target);
    }

    function invalid(e) {
        /*jshint validthis:true */

        if (supressError) {
            return;
        }

        e.preventDefault();

        var target = e.target,
            $target = $(target),
            msg = target.validationMessage || $.data(target, 'validationMessage'),
            error;

        if (!this.isSubmit || (this.isSubmit && !this.firstError)) {
            error = $(this.options.template.replace('{{message}}', msg));
            this.firstError = $target[this.options.insert](error);
            this.options.position.call(this, error, $target);
        }
    }

    function clearError(e) {
        $(e.target)
            .next('.validatr-message').remove()
            .end().prev('.validatr-message').remove();
    }

    function position(error, $target) {
        /*jshint validthis:true */

        error.css('position', 'absolute');

        var offset = $target.offset();

        if (regex.topbottom.test(this.options.location)) {
            error.offset({left: offset.left});

            if (this.options.location === 'top') {
                error.offset({top: offset.top - error.outerHeight() - 2});
            }

            if (this.options.location === 'bottom') {
                error.offset({top: offset.top + error.outerHeight()});
            }            
        } else if (regex.leftright.test(this.options.location)) {
            error.offset({top: offset.top});

            if (this.options.location === 'left') {
                error.offset({left: offset.left - error.outerWidth() - 2});
            }

            if (this.options.location === 'right') {
                error.offset({left: offset.left + $target.outerWidth() + 2});
            }            
        }        
    }

    /*! Inspired by jQuery UI - v1.9.2 - 2012-12-04
    * http://jqueryui.com
    * Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT 
    */
    $.fn[widgetName] = function(options) {
        var isMethod = typeof options === 'string',
            args = Array.prototype.slice.call(arguments, 1),
            returnValue = this,
            instance;

        if (isMethod) {
            this.each(function() {
                var methodValue;
                
                instance = $.data(this, widgetName);
                if (!instance) {
                    throw new Error("cannot call methods on " + widgetName + " prior to initialization; attempted to call method '" + options + "'" );
                }
                if (!$.isFunction(instance[options])) {
                    throw new Error( "no such method '" + options + "' for " + widgetName + " widget instance" );
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
                instance = $.data(this, widgetName);
                if (!instance) {
                    widget = new Widget();
                    init.call(widget, this, options || {});
                    $.data(this, widgetName, widget);
                }
            });
        }

        return returnValue;
    };

    $.fn[widgetName].defualtOptions = {
        event: 'keydown',
        delay: 750,
        insert: 'before',
        location: 'bottom',
        position: position,
        template: '<div>{{message}}</div>',
        theme: 'none',
        valid: function () {
            return true;
        }
    };

    $[widgetName] = new Widget();

    // Custom selector.
    $.expr[':'][widgetName] = function(elem) {
        return elem.textContent.indexOf(widgetName) >= 0;
    };

}(this, jQuery));
