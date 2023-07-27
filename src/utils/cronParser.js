/* eslint-disable no-eq-null */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable more/no-c-like-loops */
/* eslint-disable eqeqeq */
/* eslint-disable no-throw-literal */
/* eslint-disable more/no-numeric-endings-for-variables */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable import/no-commonjs */

function everyParser(s) {
    switch (s) {
        case '1': return '1st';
        case '2': return '2nd';
        case '3': return '3rd';
        case '11': return '11th';
        case '12': return '12th';
        case '13': return '13th';
        default: {
            if (/1$/.test(s)) return `${s}st`;
            if (/2$/.test(s)) return `${s}nd`;
            if (/3$/.test(s)) return `${s}rd`;

            return `${s}th`;
        }
    }
}

(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('cronstrue', [], factory);
    } else if (typeof exports === 'object') {
        exports.cronstrue = factory();
    } else {
        root.cronstrue = factory();
    }
}(typeof self !== 'undefined' ? self : this, () => {
    return /** ****/ (function (modules) { // webpackBootstrap
        /** ****/ 	// The module cache
        /** ****/ 	const installedModules = {};

        /** ****/
        /** ****/ 	// The require function
        /** ****/ 	function __webpack_require__(moduleId) {
            /** ****/
            /** ****/ 		// Check if module is in cache
            /** ****/ 		if (installedModules[moduleId]) {
                /** ****/ 			return installedModules[moduleId].exports;
                /** ****/ 		}
            /** ****/ 		// Create a new module (and put it into the cache)
            /** ****/ 		const module = installedModules[moduleId] = {
                /** ****/ 			i       : moduleId,
                /** ****/ 			l       : false,
                /** ****/ 			exports : {}
                /** ****/ 		};

            /** ****/
            /** ****/ 		// Execute the module function
            /** ****/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /** ****/
            /** ****/ 		// Flag the module as loaded
            /** ****/ 		module.l = true;

            /** ****/
            /** ****/ 		// Return the exports of the module
            /** ****/ 		return module.exports;
            /** ****/ 	}
        /** ****/
        /** ****/
        /** ****/ 	// expose the modules object (__webpack_modules__)
        /** ****/ 	__webpack_require__.m = modules;
        /** ****/
        /** ****/ 	// expose the module cache
        /** ****/ 	__webpack_require__.c = installedModules;
        /** ****/
        /** ****/ 	// define getter function for harmony exports
        /** ****/ 	__webpack_require__.d = function (exports, name, getter) {
            /** ****/ 		if (!__webpack_require__.o(exports, name)) {
                /** ****/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
                /** ****/ 		}
            /** ****/ 	};
        /** ****/
        /** ****/ 	// define __esModule on exports
        /** ****/ 	__webpack_require__.r = function (exports) {
            /** ****/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /** ****/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /** ****/ 		}
            /** ****/ 		Object.defineProperty(exports, '__esModule', { value: true });
            /** ****/ 	};
        /** ****/
        /** ****/ 	// create a fake namespace object
        /** ****/ 	// mode & 1: value is a module id, require it
        /** ****/ 	// mode & 2: merge all properties of value into the ns
        /** ****/ 	// mode & 4: return value when already ns object
        /** ****/ 	// mode & 8|1: behave like require
        /** ****/ 	__webpack_require__.t = function (value, mode) {
            /** ****/ 		if (mode & 1) value = __webpack_require__(value);
            /** ****/ 		if (mode & 8) return value;
            /** ****/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
            /** ****/ 		const ns = Object.create(null);

            /** ****/ 		__webpack_require__.r(ns);
            /** ****/ 		Object.defineProperty(ns, 'default', { enumerable: true, value });
            /** ****/ 		if (mode & 2 && typeof value !== 'string') {
                for (const key in value) {
                    __webpack_require__.d(ns, key, ((key) => {
                        return value[key];
                    }).bind(null, key));
                }
            }

            /** ****/ 		return ns;
            /** ****/ 	};
        /** ****/
        /** ****/ 	// getDefaultExport function for compatibility with non-harmony modules
        /** ****/ 	__webpack_require__.n = function (module) {
            /** ****/ 		const getter = module && module.__esModule ?
            /** ****/ 			function getDefault() {
                    return module.default;
                } :
            /** ****/ 			function getModuleExports() {
                    return module;
                };

            /** ****/ 		__webpack_require__.d(getter, 'a', getter);

            /** ****/ 		return getter;
            /** ****/ 	};
        /** ****/
        /** ****/ 	// Object.prototype.hasOwnProperty.call
        /** ****/ 	__webpack_require__.o = function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /** ****/
        /** ****/ 	// __webpack_public_path__
        /** ****/ 	__webpack_require__.p = '';

        /** ****/
        /** ****/
        /** ****/ 	// Load entry module and return exports
        /** ****/ 	return __webpack_require__(__webpack_require__.s = 4);
        /** ****/ }([
        /* 0 */
        /** */ function (module, exports, __webpack_require__) {
            Object.defineProperty(exports, '__esModule', { value: true });
            const stringUtilities_1 = __webpack_require__(1);
            const cronParser_1 = __webpack_require__(2);
            const ExpressionDescriptor = (function () {
                function ExpressionDescriptor(expression, options) {
                    this.expression = expression;
                    this.options = options;
                    this.expressionParts = new Array(5);
                    if (ExpressionDescriptor.locales[options.locale]) {
                        this.i18n = ExpressionDescriptor.locales[options.locale];
                    } else {
                        console.warn(`Locale '${  options.locale  }' could not be found; falling back to 'en'.`);
                        this.i18n = ExpressionDescriptor.locales.en;
                    }
                    if (options.use24HourTimeFormat === undefined) {
                        options.use24HourTimeFormat = this.i18n.use24HourTimeFormatByDefault();
                    }
                }
                ExpressionDescriptor.toString = function (expression, _a) {
                    const _b = _a === void 0 ? {} : _a; const _c = _b.throwExceptionOnParseError; const throwExceptionOnParseError = _c === void 0 ? true : _c; const _d = _b.verbose; const verbose = _d === void 0 ? false : _d; const _e = _b.dayOfWeekStartIndexZero; const dayOfWeekStartIndexZero = _e === void 0 ? true : _e; const use24HourTimeFormat = _b.use24HourTimeFormat; const _f = _b.locale; const locale = _f === void 0 ? 'en' : _f;
                    const options = {
                        throwExceptionOnParseError,
                        verbose,
                        dayOfWeekStartIndexZero,
                        use24HourTimeFormat,
                        locale
                    };
                    const descripter = new ExpressionDescriptor(expression, options);

                    return descripter.getFullDescription();
                };
                ExpressionDescriptor.initialize = function (localesLoader) {
                    ExpressionDescriptor.specialCharacters = [ '/', '-', ',', '*' ];
                    localesLoader.load(ExpressionDescriptor.locales);
                };
                ExpressionDescriptor.prototype.getFullDescription = function () {
                    let description = '';

                    try {
                        const parser = new cronParser_1.CronParser(this.expression, this.options.dayOfWeekStartIndexZero);

                        this.expressionParts = parser.parse();
                        const timeSegment = this.getTimeOfDayDescription();
                        const dayOfMonthDesc = this.getDayOfMonthDescription();
                        const monthDesc = this.getMonthDescription();
                        const dayOfWeekDesc = this.getDayOfWeekDescription();
                        const yearDesc = this.getYearDescription();

                        description += timeSegment + dayOfMonthDesc + dayOfWeekDesc + monthDesc + yearDesc;
                        description = this.transformVerbosity(description, this.options.verbose);
                        description = description.charAt(0).toLocaleUpperCase() + description.substr(1);
                    } catch (ex) {
                        if (!this.options.throwExceptionOnParseError) {
                            description = this.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
                        } else {
                            throw `${  ex}`;
                        }
                    }

                    return description;
                };
                ExpressionDescriptor.prototype.getTimeOfDayDescription = function () {
                    const secondsExpression = this.expressionParts[0];
                    const minuteExpression = this.expressionParts[1];
                    const hourExpression = this.expressionParts[2];
                    let description = '';

                    if (!stringUtilities_1.StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters) &&
            !stringUtilities_1.StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters) &&
            !stringUtilities_1.StringUtilities.containsAny(secondsExpression, ExpressionDescriptor.specialCharacters)) {
                        description += this.i18n.atSpace() + this.formatTime(hourExpression, minuteExpression, secondsExpression);
                    } else if (!secondsExpression &&
            minuteExpression.indexOf('-') > -1 &&
            !(minuteExpression.indexOf(',') > -1) &&
            !(minuteExpression.indexOf('/') > -1) &&
            !stringUtilities_1.StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters)) {
                        const minuteParts = minuteExpression.split('-');

                        description += stringUtilities_1.StringUtilities.format(this.i18n.everyMinuteBetweenX0AndX1(), this.formatTime(hourExpression, minuteParts[0], ''), this.formatTime(hourExpression, minuteParts[1], ''));
                    } else if (!secondsExpression &&
            hourExpression.indexOf(',') > -1 &&
            hourExpression.indexOf('-') == -1 &&
            hourExpression.indexOf('/') == -1 &&
            !stringUtilities_1.StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters)) {
                        const hourParts = hourExpression.split(',');

                        description += this.i18n.at();
                        for (let i = 0; i < hourParts.length; i++) {
                            description += ' ';
                            description += this.formatTime(hourParts[i], minuteExpression, '');
                            if (i < hourParts.length - 2) {
                                description += ',';
                            }
                            if (i == hourParts.length - 2) {
                                description += this.i18n.spaceAnd();
                            }
                        }
                    } else {
                        const secondsDescription = this.getSecondsDescription();
                        const minutesDescription = this.getMinutesDescription();
                        const hoursDescription = this.getHoursDescription();

                        description += secondsDescription;
                        if (description.length > 0 && minutesDescription.length > 0) {
                            description += ', ';
                        }
                        description += minutesDescription;
                        if (description.length > 0 && hoursDescription.length > 0) {
                            description += ', ';
                        }
                        description += hoursDescription;
                    }

                    return description;
                };
                ExpressionDescriptor.prototype.getSecondsDescription = function () {
                    const _this = this;
                    const description = this.getSegmentDescription(this.expressionParts[0], this.i18n.everySecond(), (s) => {
                        return s;
                    }, (s) => {
                        return stringUtilities_1.StringUtilities.format(_this.i18n.everyX0Seconds(), s);
                    }, (s) => {
                        return _this.i18n.secondsX0ThroughX1PastTheMinute();
                    }, (s) => {
                        return s == '0'
                            ? ''
                            : parseInt(s) < 20
                                ? _this.i18n.atX0SecondsPastTheMinute()
                                : _this.i18n.atX0SecondsPastTheMinuteGt20() || _this.i18n.atX0SecondsPastTheMinute();
                    });

                    return description;
                };
                ExpressionDescriptor.prototype.getMinutesDescription = function () {
                    const _this = this;
                    const secondsExpression = this.expressionParts[0];
                    const hourExpression = this.expressionParts[2];
                    const description = this.getSegmentDescription(this.expressionParts[1], this.i18n.everyMinute(), (s) => {
                        return s;
                    }, (s) => {
                        const valueToSet = everyParser(s);

                        return stringUtilities_1.StringUtilities.format(_this.i18n.everyX0Minutes(), valueToSet);
                    }, (s) => {
                        return _this.i18n.minutesX0ThroughX1PastTheHour();
                    }, (s) => {
                        try {
                            return s == '0' && hourExpression.indexOf('/') == -1 && secondsExpression == ''
                                ? _this.i18n.everyHour()
                                : parseInt(s) < 20
                                    ? _this.i18n.atX0MinutesPastTheHour()
                                    : _this.i18n.atX0MinutesPastTheHourGt20() || _this.i18n.atX0MinutesPastTheHour();
                        } catch (e) {
                            return _this.i18n.atX0MinutesPastTheHour();
                        }
                    });

                    return description;
                };
                ExpressionDescriptor.prototype.getHoursDescription = function () {
                    const _this = this;
                    const expression = this.expressionParts[2];
                    const description = this.getSegmentDescription(expression, this.i18n.everyHour(), (s) => {
                        return _this.formatTime(s, '0', '');
                    }, (s) => {
                        const valueToSet = everyParser(s);

                        return stringUtilities_1.StringUtilities.format(_this.i18n.everyX0Hours(), valueToSet);
                    }, (s) => {
                        return _this.i18n.betweenX0AndX1();
                    }, (s) => {
                        return _this.i18n.atX0();
                    });

                    return description;
                };
                ExpressionDescriptor.prototype.getDayOfWeekDescription = function () {
                    const _this = this;
                    const daysOfWeekNames = this.i18n.daysOfTheWeek();
                    let description = null;

                    if (this.expressionParts[5] == '*') {
                        description = '';
                    } else {
                        description = this.getSegmentDescription(this.expressionParts[5], this.i18n.commaEveryDay(), (s) => {
                            let exp = s;

                            if (s.indexOf('#') > -1) {
                                exp = s.substr(0, s.indexOf('#'));
                            } else if (s.indexOf('L') > -1) {
                                exp = exp.replace('L', '');
                            }

                            return daysOfWeekNames[parseInt(exp)];
                        }, (s) => {
                            if (parseInt(s) == 1) {
                                return '';
                            }

                            return stringUtilities_1.StringUtilities.format(_this.i18n.commaEveryX0DaysOfTheWeek(), s);
                        }, (s) => {
                            return _this.i18n.commaX0ThroughX1();
                        }, (s) => {
                            let format = null;

                            if (s.indexOf('#') > -1) {
                                const dayOfWeekOfMonthNumber = s.substring(s.indexOf('#') + 1);
                                let dayOfWeekOfMonthDescription = null;

                                switch (dayOfWeekOfMonthNumber) {
                                    case '1':
                                        dayOfWeekOfMonthDescription = _this.i18n.first();
                                        break;
                                    case '2':
                                        dayOfWeekOfMonthDescription = _this.i18n.second();
                                        break;
                                    case '3':
                                        dayOfWeekOfMonthDescription = _this.i18n.third();
                                        break;
                                    case '4':
                                        dayOfWeekOfMonthDescription = _this.i18n.fourth();
                                        break;
                                    case '5':
                                        dayOfWeekOfMonthDescription = _this.i18n.fifth();
                                        break;
                                }
                                format = _this.i18n.commaOnThe() + dayOfWeekOfMonthDescription + _this.i18n.spaceX0OfTheMonth();
                            } else if (s.indexOf('L') > -1) {
                                format = _this.i18n.commaOnTheLastX0OfTheMonth();
                            } else {
                                const domSpecified = _this.expressionParts[3] != '*';

                                format = domSpecified ? _this.i18n.commaAndOnX0() : _this.i18n.commaOnlyOnX0();
                            }

                            return format;
                        });
                    }

                    return description;
                };
                ExpressionDescriptor.prototype.getMonthDescription = function () {
                    const _this = this;
                    const monthNames = this.i18n.monthsOfTheYear();
                    const description = this.getSegmentDescription(this.expressionParts[4], '', (s) => {
                        return monthNames[parseInt(s)];
                    }, (s) => {
                        if (parseInt(s) == 1) {
                            return '';
                        }

                        return stringUtilities_1.StringUtilities.format(_this.i18n.commaEveryX0Months(), s);
                    }, (s) => {
                        return _this.i18n.commaMonthX0ThroughMonthX1() || _this.i18n.commaX0ThroughX1();
                    }, (s) => {
                        return _this.i18n.commaOnlyInMonthX0 ? _this.i18n.commaOnlyInMonthX0() : _this.i18n.commaOnlyInX0();
                    });

                    return description;
                };
                ExpressionDescriptor.prototype.getDayOfMonthDescription = function () {
                    const _this = this;
                    let description = null;
                    const expression = this.expressionParts[3];

                    switch (expression) {
                        case 'L':
                            description = this.i18n.commaOnTheLastDayOfTheMonth();
                            break;
                        case 'WL':
                        case 'LW':
                            description = this.i18n.commaOnTheLastWeekdayOfTheMonth();
                            break;
                        default:
                            var weekDayNumberMatches = expression.match(/(\d{1,2}W)|(W\d{1,2})/);

                            if (weekDayNumberMatches) {
                                const dayNumber = parseInt(weekDayNumberMatches[0].replace('W', ''));
                                const dayString = dayNumber == 1
                                    ? this.i18n.firstWeekday()
                                    : stringUtilities_1.StringUtilities.format(this.i18n.weekdayNearestDayX0(), dayNumber.toString());

                                description = stringUtilities_1.StringUtilities.format(this.i18n.commaOnTheX0OfTheMonth(), dayString);
                                break;
                            } else {
                                const lastDayOffSetMatches = expression.match(/L-(\d{1,2})/);

                                if (lastDayOffSetMatches) {
                                    const offSetDays = lastDayOffSetMatches[1];

                                    description = stringUtilities_1.StringUtilities.format(this.i18n.commaDaysBeforeTheLastDayOfTheMonth(), offSetDays);
                                    break;
                                } else if (expression == '*' && this.expressionParts[5] != '*') {
                                    return '';
                                } else {
                                    description = this.getSegmentDescription(expression, this.i18n.commaEveryDay(), (s) => {
                                        return s == 'L' ? _this.i18n.lastDay() : ((_this.i18n.dayX0) ? stringUtilities_1.StringUtilities.format(_this.i18n.dayX0(), s) : s);
                                    }, (s) => {
                                        return s == '1' ? _this.i18n.commaEveryDay() : _this.i18n.commaEveryX0Days();
                                    }, (s) => {
                                        return _this.i18n.commaBetweenDayX0AndX1OfTheMonth();
                                    }, (s) => {
                                        return _this.i18n.commaOnDayX0OfTheMonth();
                                    });
                                }
                                break;
                            }
                    }

                    return description;
                };
                ExpressionDescriptor.prototype.getYearDescription = function () {
                    const _this = this;
                    const description = this.getSegmentDescription(this.expressionParts[6], '', (s) => {
                        return /^\d+$/.test(s) ? new Date(parseInt(s), 1).getFullYear().toString() : s;
                    }, (s) => {
                        return stringUtilities_1.StringUtilities.format(_this.i18n.commaEveryX0Years(), s);
                    }, (s) => {
                        return _this.i18n.commaYearX0ThroughYearX1() || _this.i18n.commaX0ThroughX1();
                    }, (s) => {
                        return _this.i18n.commaOnlyInYearX0 ? _this.i18n.commaOnlyInYearX0() : _this.i18n.commaOnlyInX0();
                    });

                    return description;
                };
                ExpressionDescriptor.prototype.getSegmentDescription = function (expression, allDescription, getSingleItemDescription, getIntervalDescriptionFormat, getBetweenDescriptionFormat, getDescriptionFormat) {
                    const _this = this;
                    let description = null;

                    if (!expression) {
                        description = '';
                    } else if (expression === '*') {
                        description = allDescription;
                    } else if (!stringUtilities_1.StringUtilities.containsAny(expression, [ '/', '-', ',' ])) {
                        description = stringUtilities_1.StringUtilities.format(getDescriptionFormat(expression), getSingleItemDescription(expression));
                    } else if (expression.indexOf('/') > -1) {
                        var segments = expression.split('/');

                        description = stringUtilities_1.StringUtilities.format(getIntervalDescriptionFormat(segments[1]), segments[1]);
                        if (segments[0].indexOf('-') > -1) {
                            var betweenSegmentDescription = this.generateBetweenSegmentDescription(segments[0], getBetweenDescriptionFormat, getSingleItemDescription);

                            if (betweenSegmentDescription.indexOf(', ') != 0) {
                                description += ', ';
                            }
                            description += betweenSegmentDescription;
                        } else if (!stringUtilities_1.StringUtilities.containsAny(segments[0], [ '*', ',' ])) {
                            let rangeItemDescription = stringUtilities_1.StringUtilities.format(getDescriptionFormat(segments[0]), getSingleItemDescription(segments[0]));

                            rangeItemDescription = rangeItemDescription.replace(', ', '');
                            description += stringUtilities_1.StringUtilities.format(this.i18n.commaStartingX0(), rangeItemDescription);
                        }
                    } else if (expression.indexOf(',') > -1) {
                        var segments = expression.split(',');
                        let descriptionContent = '';

                        for (let i = 0; i < segments.length; i++) {
                            if (i > 0 && segments.length > 2) {
                                descriptionContent += ',';
                                if (i < segments.length - 1) {
                                    descriptionContent += ' ';
                                }
                            }
                            if (i > 0 && segments.length > 1 && (i == segments.length - 1 || segments.length == 2)) {
                                descriptionContent += `${this.i18n.spaceAnd()  } `;
                            }
                            if (segments[i].indexOf('-') > -1) {
                                var betweenSegmentDescription = this.generateBetweenSegmentDescription(segments[i], (s) => {
                                    return _this.i18n.commaX0ThroughX1();
                                }, getSingleItemDescription);

                                betweenSegmentDescription = betweenSegmentDescription.replace(', ', '');
                                descriptionContent += betweenSegmentDescription;
                            } else {
                                descriptionContent += getSingleItemDescription(segments[i]);
                            }
                        }
                        description = stringUtilities_1.StringUtilities.format(getDescriptionFormat(expression), descriptionContent);
                    } else if (expression.indexOf('-') > -1) {
                        description = this.generateBetweenSegmentDescription(expression, getBetweenDescriptionFormat, getSingleItemDescription);
                    }

                    return description;
                };
                ExpressionDescriptor.prototype.generateBetweenSegmentDescription = function (betweenExpression, getBetweenDescriptionFormat, getSingleItemDescription) {
                    let description = '';
                    const betweenSegments = betweenExpression.split('-');
                    const betweenSegment1Description = getSingleItemDescription(betweenSegments[0]);
                    let betweenSegment2Description = getSingleItemDescription(betweenSegments[1]);

                    betweenSegment2Description = betweenSegment2Description.replace(':00', ':59');
                    const betweenDescriptionFormat = getBetweenDescriptionFormat(betweenExpression);

                    description += stringUtilities_1.StringUtilities.format(betweenDescriptionFormat, betweenSegment1Description, betweenSegment2Description);

                    return description;
                };
                ExpressionDescriptor.prototype.formatTime = function (hourExpression, minuteExpression, secondExpression) {
                    let hour = parseInt(hourExpression);
                    let period = '';
                    let setPeriodBeforeTime = false;

                    if (!this.options.use24HourTimeFormat) {
                        setPeriodBeforeTime = this.i18n.setPeriodBeforeTime && this.i18n.setPeriodBeforeTime();
                        period = setPeriodBeforeTime ? `${this.getPeriod(hour)  } ` : ` ${  this.getPeriod(hour)}`;
                        if (hour > 12) {
                            hour -= 12;
                        }
                        if (hour === 0) {
                            hour = 12;
                        }
                    }
                    const minute = minuteExpression;
                    let second = '';

                    if (secondExpression) {
                        second = `:${  (`00${  secondExpression}`).substring(secondExpression.length)}`;
                    }

                    return `${  setPeriodBeforeTime ? period : ''  }${(`00${  hour.toString()}`).substring(hour.toString().length)  }:${  (`00${  minute.toString()}`).substring(minute.toString().length)  }${second  }${!setPeriodBeforeTime ? period : ''}`;
                };
                ExpressionDescriptor.prototype.transformVerbosity = function (description, useVerboseFormat) {
                    if (!useVerboseFormat) {
                        description = description.replace(new RegExp(`, ${  this.i18n.everyMinute()}`, 'g'), '');
                        description = description.replace(new RegExp(`, ${  this.i18n.everyHour()}`, 'g'), '');
                        description = description.replace(new RegExp(this.i18n.commaEveryDay(), 'g'), '');
                        description = description.replace(/\, ?$/, '');
                    }

                    return description;
                };
                ExpressionDescriptor.prototype.getPeriod = function (hour) {
                    return hour >= 12 ? this.i18n.pm && this.i18n.pm() || 'PM' : this.i18n.am && this.i18n.am() || 'AM';
                };
                ExpressionDescriptor.locales = {};

                return ExpressionDescriptor;
            }());

            exports.ExpressionDescriptor = ExpressionDescriptor;
            /** */ },
        /* 1 */
        /** */ function (module, exports, __webpack_require__) {
            Object.defineProperty(exports, '__esModule', { value: true });
            const StringUtilities = (function () {
                function StringUtilities() {
                }
                StringUtilities.format = function (template) {
                    const values = [];

                    for (let _i = 1; _i < arguments.length; _i++) {
                        values[_i - 1] = arguments[_i];
                    }

                    return template.replace(/%s/g, () => {
                        return values.shift();
                    });
                };
                StringUtilities.containsAny = function (text, searchStrings) {
                    return searchStrings.some((c) => {
                        return text.indexOf(c) > -1;
                    });
                };

                return StringUtilities;
            }());

            exports.StringUtilities = StringUtilities;
            /** */ },
        /* 2 */
        /** */ function (module, exports, __webpack_require__) {
            Object.defineProperty(exports, '__esModule', { value: true });
            const CronParser = (function () {
                function CronParser(expression, dayOfWeekStartIndexZero) {
                    if (dayOfWeekStartIndexZero === void 0) {
                        dayOfWeekStartIndexZero = true;
                    }
                    this.expression = expression;
                    this.dayOfWeekStartIndexZero = dayOfWeekStartIndexZero;
                }
                CronParser.prototype.parse = function () {
                    const parsed = this.extractParts(this.expression);

                    this.normalize(parsed);
                    this.validate(parsed);

                    return parsed;
                };
                CronParser.prototype.extractParts = function (expression) {
                    if (!this.expression) {
                        throw new Error('Expression is empty');
                    }
                    const parsed = expression.trim().split(/[ ]+/);

                    if (parsed.length < 5) {
                        throw new Error(`Expression has only ${  parsed.length  } part${  parsed.length == 1 ? '' : 's'  }. At least 5 parts are required.`);
                    } else if (parsed.length == 5) {
                        parsed.unshift('');
                        parsed.push('');
                    } else if (parsed.length == 6) {
                        if (/\d{4}$/.test(parsed[5])) {
                            parsed.unshift('');
                        } else {
                            parsed.push('');
                        }
                    } else if (parsed.length > 7) {
                        throw new Error(`Expression has ${  parsed.length  } parts; too many!`);
                    }

                    return parsed;
                };
                CronParser.prototype.normalize = function (expressionParts) {
                    const _this = this;

                    expressionParts[3] = expressionParts[3].replace('?', '*');
                    expressionParts[5] = expressionParts[5].replace('?', '*');
                    expressionParts[2] = expressionParts[2].replace('?', '*');
                    if (expressionParts[0].indexOf('0/') == 0) {
                        expressionParts[0] = expressionParts[0].replace('0/', '*/');
                    }
                    if (expressionParts[1].indexOf('0/') == 0) {
                        expressionParts[1] = expressionParts[1].replace('0/', '*/');
                    }
                    if (expressionParts[2].indexOf('0/') == 0) {
                        expressionParts[2] = expressionParts[2].replace('0/', '*/');
                    }
                    if (expressionParts[3].indexOf('1/') == 0) {
                        expressionParts[3] = expressionParts[3].replace('1/', '*/');
                    }
                    if (expressionParts[4].indexOf('1/') == 0) {
                        expressionParts[4] = expressionParts[4].replace('1/', '*/');
                    }
                    if (expressionParts[5].indexOf('1/') == 0) {
                        expressionParts[5] = expressionParts[5].replace('1/', '*/');
                    }
                    if (expressionParts[6].indexOf('1/') == 0) {
                        expressionParts[6] = expressionParts[6].replace('1/', '*/');
                    }
                    expressionParts[5] = expressionParts[5].replace(/(^\d)|([^#/\s]\d)/g, (t) => {
                        const dowDigits = t.replace(/\D/, '');
                        let dowDigitsAdjusted = dowDigits;

                        if (_this.dayOfWeekStartIndexZero) {
                            if (dowDigits == '7') {
                                dowDigitsAdjusted = '0';
                            }
                        } else {
                            dowDigitsAdjusted = (parseInt(dowDigits) - 1).toString();
                        }

                        return t.replace(dowDigits, dowDigitsAdjusted);
                    });
                    if (expressionParts[5] == 'L') {
                        expressionParts[5] = '6';
                    }
                    if (expressionParts[3] == '?') {
                        expressionParts[3] = '*';
                    }
                    if (expressionParts[3].indexOf('W') > -1 &&
            (expressionParts[3].indexOf(',') > -1 || expressionParts[3].indexOf('-') > -1)) {
                        throw new Error("The 'W' character can be specified only when the day-of-month is a single day, not a range or list of days.");
                    }
                    const days = {
                        SUN : 0,
                        MON : 1,
                        TUE : 2,
                        WED : 3,
                        THU : 4,
                        FRI : 5,
                        SAT : 6
                    };

                    for (const day in days) {
                        expressionParts[5] = expressionParts[5].replace(new RegExp(day, 'gi'), days[day].toString());
                    }
                    const months = {
                        JAN : 1,
                        FEB : 2,
                        MAR : 3,
                        APR : 4,
                        MAY : 5,
                        JUN : 6,
                        JUL : 7,
                        AUG : 8,
                        SEP : 9,
                        OCT : 10,
                        NOV : 11,
                        DEC : 12
                    };

                    for (const month in months) {
                        expressionParts[4] = expressionParts[4].replace(new RegExp(month, 'gi'), months[month].toString());
                    }
                    if (expressionParts[0] == '0') {
                        expressionParts[0] = '';
                    }
                    if (!/\*|\-|\,|\//.test(expressionParts[2]) &&
            (/\*|\//.test(expressionParts[1]) || /\*|\//.test(expressionParts[0]))) {
                        expressionParts[2] += `-${  expressionParts[2]}`;
                    }
                    for (let i = 0; i < expressionParts.length; i++) {
                        if (expressionParts[i] == '*/1') {
                            expressionParts[i] = '*';
                        }
                        if (expressionParts[i].indexOf('/') > -1 && !/^\*|\-|\,/.test(expressionParts[i])) {
                            let stepRangeThrough = null;

                            switch (i) {
                                case 4:
                                    stepRangeThrough = '12';
                                    break;
                                case 5:
                                    stepRangeThrough = '6';
                                    break;
                                case 6:
                                    stepRangeThrough = '9999';
                                    break;
                                default:
                                    stepRangeThrough = null;
                                    break;
                            }
                            if (stepRangeThrough != null) {
                                const parts = expressionParts[i].split('/');

                                expressionParts[i] = `${parts[0]  }-${  stepRangeThrough  }/${  parts[1]}`;
                            }
                        }
                    }
                };
                CronParser.prototype.validate = function (parsed) {
                    this.assertNoInvalidCharacters('DOW', parsed[5]);
                    this.assertNoInvalidCharacters('DOM', parsed[3]);
                };
                CronParser.prototype.assertNoInvalidCharacters = function (partDescription, expression) {
                    const invalidChars = expression.match(/[A-KM-VX-Z]+/gi);

                    if (invalidChars && invalidChars.length) {
                        throw new Error(`${partDescription  } part contains invalid values: '${  invalidChars.toString()  }'`);
                    }
                };

                return CronParser;
            }());

            exports.CronParser = CronParser;
            /** */ },
        /* 3 */
        /** */ function (module, exports, __webpack_require__) {
            Object.defineProperty(exports, '__esModule', { value: true });
            const en = (function () {
                function en() {
                }
                en.prototype.atX0SecondsPastTheMinuteGt20 = function () {
                    return null;
                };
                en.prototype.atX0MinutesPastTheHourGt20 = function () {
                    return null;
                };
                en.prototype.commaMonthX0ThroughMonthX1 = function () {
                    return null;
                };
                en.prototype.commaYearX0ThroughYearX1 = function () {
                    return null;
                };
                en.prototype.use24HourTimeFormatByDefault = function () {
                    return false;
                };
                en.prototype.anErrorOccuredWhenGeneratingTheExpressionD = function () {
                    return 'An error occured when generating the expression description.  Check the cron expression syntax.';
                };
                en.prototype.everyMinute = function () {
                    return 'at every minute';
                };
                en.prototype.everyHour = function () {
                    return 'every hour';
                };
                en.prototype.atSpace = function () {
                    return 'At ';
                };
                en.prototype.everyMinuteBetweenX0AndX1 = function () {
                    return 'Every minute between %s and %s';
                };
                en.prototype.at = function () {
                    return 'At';
                };
                en.prototype.spaceAnd = function () {
                    return ' and';
                };
                en.prototype.everySecond = function () {
                    return 'every second';
                };
                en.prototype.everyX0Seconds = function () {
                    return 'every %s seconds';
                };
                en.prototype.secondsX0ThroughX1PastTheMinute = function () {
                    return 'seconds %s through %s past the minute';
                };
                en.prototype.atX0SecondsPastTheMinute = function () {
                    return 'at %s seconds past the minute';
                };
                en.prototype.everyX0Minutes = function () {
                    return 'at every %s minute';
                };
                en.prototype.minutesX0ThroughX1PastTheHour = function () {
                    return 'minutes %s through %s past the hour';
                };
                en.prototype.atX0MinutesPastTheHour = function () {
                    return 'at minute %s';
                };
                en.prototype.everyX0Hours = function () {
                    return 'every %s hour';
                };
                en.prototype.betweenX0AndX1 = function () {
                    return 'between %s and %s';
                };
                en.prototype.atX0 = function () {
                    return 'at %s';
                };
                en.prototype.commaEveryDay = function () {
                    return ', every day';
                };
                en.prototype.commaEveryX0DaysOfTheWeek = function () {
                    return ', every %s days of the week';
                };
                en.prototype.commaX0ThroughX1 = function () {
                    return ', %s through %s';
                };
                en.prototype.first = function () {
                    return 'first';
                };
                en.prototype.second = function () {
                    return 'second';
                };
                en.prototype.third = function () {
                    return 'third';
                };
                en.prototype.fourth = function () {
                    return 'fourth';
                };
                en.prototype.fifth = function () {
                    return 'fifth';
                };
                en.prototype.commaOnThe = function () {
                    return ', on the ';
                };
                en.prototype.spaceX0OfTheMonth = function () {
                    return ' %s of the month';
                };
                en.prototype.lastDay = function () {
                    return 'the last day';
                };
                en.prototype.commaOnTheLastX0OfTheMonth = function () {
                    return ', on the last %s of the month';
                };
                en.prototype.commaOnlyOnX0 = function () {
                    return ', only on %s';
                };
                en.prototype.commaAndOnX0 = function () {
                    return ', and on %s';
                };
                en.prototype.commaEveryX0Months = function () {
                    return ', every %s months';
                };
                en.prototype.commaOnlyInX0 = function () {
                    return ', only in %s';
                };
                en.prototype.commaOnTheLastDayOfTheMonth = function () {
                    return ', on the last day of the month';
                };
                en.prototype.commaOnTheLastWeekdayOfTheMonth = function () {
                    return ', on the last weekday of the month';
                };
                en.prototype.commaDaysBeforeTheLastDayOfTheMonth = function () {
                    return ', %s days before the last day of the month';
                };
                en.prototype.firstWeekday = function () {
                    return 'first weekday';
                };
                en.prototype.weekdayNearestDayX0 = function () {
                    return 'weekday nearest day %s';
                };
                en.prototype.commaOnTheX0OfTheMonth = function () {
                    return ', on the %s of the month';
                };
                en.prototype.commaEveryX0Days = function () {
                    return ', every %s days';
                };
                en.prototype.commaBetweenDayX0AndX1OfTheMonth = function () {
                    return ', between day %s and %s of the month';
                };
                en.prototype.commaOnDayX0OfTheMonth = function () {
                    return ', on day %s of the month';
                };
                en.prototype.commaEveryHour = function () {
                    return ', every hour';
                };
                en.prototype.commaEveryX0Years = function () {
                    return ', every %s years';
                };
                en.prototype.commaStartingX0 = function () {
                    return ', starting %s';
                };
                en.prototype.daysOfTheWeek = function () {
                    return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
                };
                en.prototype.monthsOfTheYear = function () {
                    return [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                    ];
                };

                return en;
            }());

            exports.en = en;
            /** */ },
        /* 4 */
        /** */ function (module, exports, __webpack_require__) {
            Object.defineProperty(exports, '__esModule', { value: true });
            const expressionDescriptor_1 = __webpack_require__(0);
            const enLocaleLoader_1 = __webpack_require__(5);

            expressionDescriptor_1.ExpressionDescriptor.initialize(new enLocaleLoader_1.enLocaleLoader());
            exports.default = expressionDescriptor_1.ExpressionDescriptor;
            const toString = expressionDescriptor_1.ExpressionDescriptor.toString;

            exports.toString = toString;
            /** */ },
        /* 5 */
        /** */ function (module, exports, __webpack_require__) {
            Object.defineProperty(exports, '__esModule', { value: true });
            const en_1 = __webpack_require__(3);
            const enLocaleLoader = (function () {
                function enLocaleLoader() {
                }
                enLocaleLoader.prototype.load = function (availableLocales) {
                    availableLocales.en = new en_1.en();
                };

                return enLocaleLoader;
            }());

            exports.enLocaleLoader = enLocaleLoader;
            /** */ }
        /** ****/ ]));
}));
