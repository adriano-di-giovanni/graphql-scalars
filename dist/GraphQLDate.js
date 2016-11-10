'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _error = require('graphql/error');

var _isDate = require('./isDate');

var _isDate2 = _interopRequireDefault(_isDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var coerceDate = function coerceDate(value) {
  var date = new Date(value);
  if (!(0, _isDate2.default)(date)) {
    var message = undefined.name + ' can\'t represent non-date value: ' + value;
    throw new TypeError(message);
  }
  return date;
};

var GraphQLDate = new _graphql.GraphQLScalarType({
  name: 'Date',
  serialize: function serialize(value) {
    return coerceDate(value).toISOString();
  },
  parseValue: coerceDate,
  parseLiteral: function parseLiteral(valueNode) {
    var value = valueNode.value;

    var date = new Date(value);
    if (!(0, _isDate2.default)(date)) {
      throw new _error.GraphQLError('Expected date value but got: ' + value, [valueNode]);
    }
    return date;
  }
});

exports.default = GraphQLDate;