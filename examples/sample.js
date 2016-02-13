'use strict';

var fs = require('fs');
var Lexor = require('../').Lexor;

var lexor = new Lexor();

lexor.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, function (ctx, match) {
  ctx.accept("id")
});

lexor.rule(/[+-]?[0-9]+/, function (ctx, match) {
  ctx.accept("number", parseInt(match[0]))
});

lexor.rule(/"((?:\\"|[^\r\n]+)+)"/, function (ctx, match) {
  ctx.accept("string", match[1].replace(/\\"/g, "\""))
});

lexor.rule(/\/\/[^\r\n]+\r?\n/, function (ctx, match) {
  ctx.ignore()
});

lexor.rule(/[ \t\r\n]+/, function (ctx, match) {
  ctx.ignore()
});

lexor.rule(/./, function (ctx, match) {
  ctx.accept("char")
});

var data = fs.readFileSync("sample.txt", "utf8");

lexor.input(data);
lexor.debug(true);
lexor.tokens().forEach(function (token) {
  console.log(token.toString());
});
