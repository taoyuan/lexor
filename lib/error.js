'use strict';

var inherits = require('inherits');
var excerpt = require('./excerpt');

function ParsingError(message, pos, line, column, input) {
  Error.call(this, message);
  this.name = 'ParsingError';
  this.message = message;
  this.pos = pos;
  this.line = line;
  this.column = column;
  this.input = input;
}

inherits(ParsingError, Error);

ParsingError.prototype.toString = function () {
  var l = excerpt(this.input, this.pos);
  var prefix1 = 'line ' + this.line + ' (column ' + this.column + '): ';
  var prefix2 = '';
  for (var i = 0; i < prefix1.length + l.prologText.length; i++) {
    prefix2 += ' ';
  }
  return 'Parsing Error: ' + this.message + '\n' +
    prefix1 + l.prologText + l.tokenText + l.epilogText + '\n' +
    prefix2 + '^';
};

module.exports = ParsingError;
