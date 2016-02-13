'use strict';

/*  utility function: create a source excerpt  */
module.exports = function excerpt(txt, o) {
  var l = txt.length;
  var b = o - 20;
  if (b < 0) b = 0;
  var e = o + 20;
  if (e > l) e = l;
  var hex = function (ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  };
  var extract = function (txt, pos, len) {
    return txt.substr(pos, len)
      .replace(/\\/g, "\\\\")
      .replace(/\x08/g, "\\b")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\f/g, "\\f")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
        return "\\x0" + hex(ch);
      })
      .replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
        return "\\x" + hex(ch);
      })
      .replace(/[\u0100-\u0FFF]/g, function (ch) {
        return "\\u0" + hex(ch);
      })
      .replace(/[\u1000-\uFFFF]/g, function (ch) {
        return "\\u" + hex(ch);
      });
  };
  return {
    prologTrunc: b > 0,
    prologText: extract(txt, b, o - b),
    tokenText: extract(txt, o, 1),
    epilogText: extract(txt, o + 1, e - (o + 1)),
    epilogTrunc: e < l
  }
};
