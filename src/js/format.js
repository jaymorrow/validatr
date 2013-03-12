
/*
 * Really simple date/time logic
 * Mostly taken from moment.js version : 2.0.0
 * author : Tim Wood
 * license : MIT
 * momentjs.com
 */
var Format = (function () {
    var tokens = /(d|dd|m|mm|yy|yyyy|M|MM)/g,
        tokenOneTwo = /\d{1,2}/,
        tokenTwo = /\d{2}/,
        tokenFour = /\d{4}/,
        monthFullNames = /January|February|March|April|May|June|July|August|September|October|November|December/i,
        monthShortNames = /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i,
        fullMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    function indexOf(array, value) {
        var index = -1,
            length = array ? array.length : 0;

        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }

        return -1;
    }

    function getMonthIndex(arr, string) {
        return indexOf(arr, string.toLowerCase());
    }
    
    function getParts(token) {
        switch(token) {
        case 'd' :
        case 'dd':
        case 'm' :
        case 'mm':
            return tokenOneTwo;
        case 'M':
            return monthShortNames;
        case 'MM':
            return monthFullNames;
        case 'yy':
            return tokenTwo;
        case 'yyyy':
            return tokenFour;
        }
    }

    function createDateArray(token, input, dateArray) {
        switch(token) {
        case 'd' :
        case 'dd':
            dateArray[2] = ~~input;
            break;
        case 'm' :
        case 'mm':
            dateArray[1] = ~~input - 1;
            break;
        case 'M':
            dateArray[1] = getMonthIndex(shortMonths, input);
            break;
        case 'MM':
            dateArray[1] = getMonthIndex(fullMonths, input);
            break;
        case 'yy'  :
            dateArray[0] = ~~('20' + input);
            break;
        case 'yyyy':
            dateArray[0] = ~~input;
            break;
        }
    }

    function createDate(dateArray) {
        var i = 0,
            date = [];

        for (i; i < 7; i += 1) {
            date[i] = (dateArray[i] == null) ? (i === 2 ? 1 : 0) : dateArray[i];
        }

        return new Date(date[0], date[1], date[2], date[3], date[4], date[5], date[6]);
    }

    function formatDate(string, format) {
        var parts = format.match(tokens),
            dateArray = [],
            input;

        for (var i = 0, length = parts.length; i < length; i += 1) {
            input = (getParts(parts[i]).exec(string) || [])[0];
            
            if (input) {
                string = string.slice(string.indexOf(input) + input.length);
            }
            createDateArray(parts[i], input, dateArray);
        }

        if (dateArray.length) {
            return createDate(dateArray);
        }    
    }

    return {
        date: formatDate
    };
}());

//console.log(Format.date('Feb 12', 'M yy'));
