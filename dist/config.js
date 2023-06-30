"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Paths = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _path = _interopRequireDefault(require("path"));
var Paths = /*#__PURE__*/function () {
  function Paths() {
    (0, _classCallCheck2["default"])(this, Paths);
    this.rootDir = '';
    this.screenshotFolderName = 'cypress-visual-screenshots';
    this.reportFolderName = 'cypress-visual-report';
  }
  (0, _createClass2["default"])(Paths, [{
    key: "screenshotDir",
    get: function get() {
      return _path["default"].join(this.rootDir, this.screenshotFolderName);
    }
  }, {
    key: "baseline",
    get: function get() {
      return _path["default"].join(process.cwd(), this.screenshotDir, 'baseline');
    }
  }, {
    key: "comparison",
    get: function get() {
      return _path["default"].join(process.cwd(), this.screenshotDir, 'comparison');
    }
  }, {
    key: "diff",
    get: function get() {
      return _path["default"].join(process.cwd(), this.screenshotDir, 'diff');
    }
  }, {
    key: "image",
    get: function get() {
      var _this = this;
      return {
        baseline: function baseline(testName) {
          return _path["default"].join(_this.baseline, "".concat(testName, ".png"));
        },
        comparison: function comparison(testName) {
          return _path["default"].join(_this.comparison, "".concat(testName, ".png"));
        },
        diff: function diff(testName) {
          return _path["default"].join(_this.diff, "".concat(testName, ".png"));
        }
      };
    }
  }, {
    key: "dir",
    get: function get() {
      return {
        baseline: this.baseline,
        comparison: this.comparison,
        diff: this.diff
      };
    }
  }, {
    key: "reportDir",
    get: function get() {
      return _path["default"].join(process.cwd(), this.rootDir, this.reportFolderName);
    }
  }, {
    key: "report",
    value: function report(instance) {
      return _path["default"].join(this.reportDir, "cypress-visual-report".concat(instance, ".html"));
    }
  }]);
  return Paths;
}();
exports.Paths = Paths;
var _default = new Paths();
exports["default"] = _default;