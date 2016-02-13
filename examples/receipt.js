'use strict';

var fs = require('fs');
var Lexor = require('../').Lexor;

var lexor = new Lexor();

lexor.rule(/(\d{4}|\d{2})[-./](\d{2})[-./](\d{4}|\d{2})/, function (ctx, match) {
  ctx.accept("date")
});

lexor.rule(/(\d{2}:\d{2}:\d{2})|(\d{2}:\d{2})/, function (ctx, match) {
  ctx.accept("time")
});

lexor.rule(/[\-=\*]+/, function (ctx, match) {
  ctx.accept("separator")
});

lexor.rule(/[^ \t\r\n:]+/, function (ctx, match) {
  ctx.accept('text');
});

// comment like // something comments \r\n
lexor.rule(/\/\/[^\r\n]+\r?\n/, function (ctx, match) {
  ctx.ignore();
});

lexor.rule(/[ \t]+/, function (ctx, match) {
  //ctx.accept("space", ' ');
  ctx.ignore();
});

lexor.rule(/./, function (ctx, match) {
  ctx.accept("char")
});

lexor.rule(/[\r\n]+/, function (ctx, match) {
  ctx.accept("EOL");
});

var data = fs.readFileSync("receipt_gf.txt", "utf8");

lexor.input(data);
lexor.debug(true);
lexor.tokens().forEach(function (token) {
  console.log(token.toString());
});
