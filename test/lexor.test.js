'use strict';

var s = require('./support');
var expect = s.expect;
var lexor = require("../");
var Lexor = lexor.Lexor;

describe("Lexor Library", function () {
  it("should expose its official API", function () {
    var tokenizer = new Lexor();
    expect(tokenizer).to.be.a("object");
    expect(tokenizer).to.respondTo("input");
    expect(tokenizer).to.respondTo("rule");
    expect(tokenizer).to.respondTo("token");
  });

  it("should have the expected functionality", function () {
    var lexor = new Lexor();
    lexor.rule("default", /[a-zA-Z]+/, function (ctx /*, m */) {
      ctx.accept("symbol")
    });

    lexor.rule("default", /[0-9]+/, function (ctx, m) {
      ctx.accept("number", parseInt(m[0]))
    });

    lexor.rule("default", /"((?:\\"|[^\r\n]+)+)"/, function (ctx, m) {
      ctx.accept("string", m[1].replace(/\\"/g, "\""))
    });

    lexor.rule("default", /\/\*/, function (ctx /*, m */) {
      ctx.push("comment");
      ctx.tag("bar");
      ctx.ignore();
    });

    lexor.rule("comment #foo #bar", /\*\//, function (/* ctx, m */) {
      throw new Error("should never enter")
    });

    lexor.rule("comment #bar", /\*\//, function (ctx /*, m */) {
      ctx.untag("bar");
      ctx.pop();
      ctx.ignore();
    });

    lexor.rule("comment #bar", /./, function (ctx /*, m */) {
      ctx.ignore();
    });

    lexor.rule("default", /\s*,\s*/, function (ctx /*, m */) {
      ctx.ignore();
    });

    lexor.input("foo42,\n \"bar baz\",\n quux/* */");

    lexor.debug(true);
    var tokens;
    try {
      tokens = lexor.tokens();
    } catch (ex) {
      console.log(ex.toString());
      throw ex;
    }

    expect(tokens).to.be.a("array");
    expect(tokens).to.have.length(4);
    expect(tokens[0]).to.be.a("object");
    deepEqual(tokens[0], {type: "symbol", value: "foo", text: "foo", pos: 0, line: 1, column: 1});
    expect(tokens[1]).to.be.a("object");
    deepEqual(tokens[1], {type: "number", value: 42, text: "42", pos: 3, line: 1, column: 4});
    expect(tokens[2]).to.be.a("object");
    deepEqual(tokens[2], {type: "string", value: "bar baz", text: "\"bar baz\"", pos: 8, line: 2, column: 2});
    expect(tokens[3]).to.be.a("object");
    deepEqual(tokens[3], {type: "symbol", value: "quux", text: "quux", pos: 20, line: 3, column: 2});
  });

  it("should throw error if not matched", function () {
    var tokenizer = new Lexor();
    tokenizer.input('hello');
    expect(function () {
      tokenizer.tokens();
    }).to.throw(lexor.ParsingError);
  });
});

function deepEqual(object, expected) {
  expect(Object.keys(object)).deep.equal(Object.keys(expected));
  Object.keys(expected).forEach(function (key) {
    expect(object[key]).deep.equal(expected[key]);
  });
}
