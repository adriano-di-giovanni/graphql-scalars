'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var toString = Object.prototype.toString;

var isDate = function isDate(value) {
  return toString.call(value) === '[object Date]' && !isNaN(value.valueOf());
};

exports.default = isDate;