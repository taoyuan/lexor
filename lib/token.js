'use strict';

module.exports = Token;

function Token(type, value, text, pos, line, column) {
  this.type = type;
  this.value = value;
  this.text = text;
  this.pos = pos || 0;
  this.line = line || 0;
  this.column = column || 0;
}

Token.prototype.toString = function () {
  return '<type: ' + this.type + ', ' +
    'value: ' + JSON.stringify(this.value) + ', ' +
    'text: ' + JSON.stringify(this.text) + ', ' +
    'pos: ' + this.pos + ', ' +
    'line: ' + this.line + ', ' +
    'column: ' + this.column + '>';
};

Token.prototype.isA = function (type, value) {
  if (type !== this.type) {
    return false;
  }
  return arguments.length < 2 || value === this.value;
};
