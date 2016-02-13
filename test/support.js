'use strict';

/*  provide exception swallowing  */
exports.swallow = function (thrower) { try { thrower(); } catch (e) {} };

/*  provide assertion functionality (base features)  */
exports.chai    = require("chai");
exports.should  = require("chai").should();
exports.expect  = require("chai").expect;
exports.assert  = require("chai").assert;

/*  print stack traces on assertion failures  */
exports.chai.config.includeStack = true;

