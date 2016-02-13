'use strict';

var Token = require('./token');

/*  internal helper class for action context  */
function ActionContext(lexor) {
  this._lexor = lexor;
  this._data = {};
  this._repeat = false;
  this._reject = false;
  this._ignore = false;
  this._match = null;
}

/*  store and retrieve user data attached to context  */
ActionContext.prototype.data = function (key, value) {
  var valueOld = this._data[key];
  if (arguments.length === 2)
    this._data[key] = value;
  return valueOld;
};

/*  retrieve information of current matching  */
ActionContext.prototype.info = function () {
  return {
    line: this._lexor._line,
    column: this._lexor._column,
    pos: this._lexor._pos,
    len: this._match[0].length
  }
};

/*  pass-through functions to attached tokenizer  */
ActionContext.prototype.push = function () {
  this._lexor.push.apply(this._lexor, arguments);
  return this;
};

ActionContext.prototype.pop = function () {
  return this._lexor.pop.apply(this._lexor, arguments);
};

ActionContext.prototype.state = function () {
  if (arguments.length > 0) {
    this._lexor.state.apply(this._lexor, arguments);
    return this;
  }
  else
    return this._lexor.state.apply(this._lexor, arguments);
};

ActionContext.prototype.tag = function () {
  this._lexor.tag.apply(this._lexor, arguments);
  return this;
};

ActionContext.prototype.tagged = function () {
  return this._lexor.tagged.apply(this._lexor, arguments);
};

ActionContext.prototype.untag = function () {
  this._lexor.untag.apply(this._lexor, arguments);
  return this;
};

/*  mark current matching to be repeated from scratch  */
ActionContext.prototype.repeat = function () {
  this._lexor._log('    REPEAT');
  this._repeat = true;
  return this;
};

/*  mark current matching to be rejected  */
ActionContext.prototype.reject = function () {
  this._lexor._log('    REJECT');
  this._reject = true;
  return this;
};

/*  mark current matching to be ignored  */
ActionContext.prototype.ignore = function () {
  this._lexor._log('    IGNORE');
  this._ignore = true;
  return this;
};

/*  accept current matching is a new token  */
ActionContext.prototype.accept = function (type, value) {
  if (arguments.length < 2)
    value = this._match[0];
  this._lexor._log('    ACCEPT: type: ' + type + ', value: ' + JSON.stringify(value) + ' (' + typeof value + '), text: "' + this._match[0] + '"');
  this._lexor._pending.push(new Token(
    type, value, this._match[0],
    this._lexor._pos, this._lexor._line, this._lexor._column
  ));
  return this;
};

module.exports = ActionContext;
