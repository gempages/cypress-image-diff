"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _pixelmatch = _interopRequireDefault(require("pixelmatch"));
var _pngjs = require("pngjs");
var _path = _interopRequireDefault(require("path"));
var _utils = require("./utils");
var _config = _interopRequireWildcard(require("./config"));
var _testStatus = _interopRequireDefault(require("./reporter/test-status"));
var _reporter = require("./reporter");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var testStatuses = [];
var setupFolders = function setupFolders() {
  (0, _utils.createDir)([_config["default"].dir.baseline, _config["default"].dir.comparison, _config["default"].dir.diff, _config["default"].reportDir]);
};
var tearDownDirs = function tearDownDirs() {
  (0, _utils.cleanDir)([_config["default"].dir.comparison, _config["default"].dir.diff]);
};
var generateReport = function generateReport() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (testStatuses.length > 0) {
    (0, _reporter.createReport)({
      tests: JSON.stringify(testStatuses),
      instance: instance
    });
  }
  return true;
};
var deleteReport = function deleteReport(args) {
  testStatuses = testStatuses.filter(function (testStatus) {
    return testStatus.name !== args.testName;
  });
  return true;
};
var copyScreenshot = function copyScreenshot(args) {
  // If baseline does not exist, copy comparison image to baseline folder
  if (!_fsExtra["default"].existsSync(_config["default"].image.baseline(args.testName)) || args.force) {
    _fsExtra["default"].copySync(_config["default"].image.comparison(args.testName), _config["default"].image.baseline(args.testName));
  }
  return true;
};

// Delete screenshot from comparison and diff directories
var deleteScreenshot = function deleteScreenshot(args) {
  if (_fsExtra["default"].existsSync(_config["default"].image.comparison(args.testName))) {
    _fsExtra["default"].unlinkSync(_config["default"].image.comparison(args.testName));
  }
  if (_fsExtra["default"].existsSync(_config["default"].image.diff(args.testName))) {
    _fsExtra["default"].unlinkSync(_config["default"].image.diff(args.testName));
  }
  return true;
};
var getStatsComparisonAndPopulateDiffIfAny = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(args) {
    var baselineImg, comparisonImg, diff, baselineFullCanvas, comparisonFullCanvas, pixelMismatchResult, percentage, testFailed;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _utils.parseImage)(_config["default"].image.baseline(args.testName));
        case 3:
          baselineImg = _context.sent;
          _context.next = 9;
          break;
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", args.failOnMissingBaseline ? {
            percentage: 1,
            testFailed: true
          } : {
            percentage: 0,
            testFailed: false
          });
        case 9:
          _context.next = 11;
          return (0, _utils.parseImage)(_config["default"].image.comparison(args.testName));
        case 11:
          comparisonImg = _context.sent;
          diff = new _pngjs.PNG({
            width: Math.max(comparisonImg.width, baselineImg.width),
            height: Math.max(comparisonImg.height, baselineImg.height)
          });
          _context.next = 15;
          return (0, _utils.adjustCanvas)(baselineImg, diff.width, diff.height);
        case 15:
          baselineFullCanvas = _context.sent;
          _context.next = 18;
          return (0, _utils.adjustCanvas)(comparisonImg, diff.width, diff.height);
        case 18:
          comparisonFullCanvas = _context.sent;
          pixelMismatchResult = (0, _pixelmatch["default"])(baselineFullCanvas.data, comparisonFullCanvas.data, diff.data, diff.width, diff.height, _config.userConfig.COMPARISON_OPTIONS);
          percentage = Math.pow(pixelMismatchResult / diff.width / diff.height, 0.5);
          testFailed = percentage > args.testThreshold;
          if (testFailed) {
            _fsExtra["default"].ensureFileSync(_config["default"].image.diff(args.testName));
            diff.pack().pipe(_fsExtra["default"].createWriteStream(_config["default"].image.diff(args.testName)));
          }
          return _context.abrupt("return", {
            percentage: percentage,
            testFailed: testFailed
          });
        case 24:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return function getStatsComparisonAndPopulateDiffIfAny(_x) {
    return _ref.apply(this, arguments);
  };
}();
function compareSnapshotsPlugin(_x2) {
  return _compareSnapshotsPlugin.apply(this, arguments);
}
function _compareSnapshotsPlugin() {
  _compareSnapshotsPlugin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(args) {
    var _yield$getStatsCompar, percentage, testFailed;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return getStatsComparisonAndPopulateDiffIfAny(args);
        case 2:
          _yield$getStatsCompar = _context4.sent;
          percentage = _yield$getStatsCompar.percentage;
          testFailed = _yield$getStatsCompar.testFailed;
          // Saving test status object to build report if task is triggered
          testStatuses.push(new _testStatus["default"]({
            status: !testFailed,
            name: args.testName,
            percentage: percentage,
            failureThreshold: args.testThreshold,
            specFilename: args.specFilename,
            specPath: args.specPath,
            baselinePath: (0, _utils.getRelativePathFromCwd)(_config["default"].image.baseline(args.testName)),
            diffPath: (0, _utils.getRelativePathFromCwd)(_config["default"].image.diff(args.testName)),
            comparisonPath: (0, _utils.getRelativePathFromCwd)(_config["default"].image.comparison(args.testName))
          }));
          return _context4.abrupt("return", percentage);
        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _compareSnapshotsPlugin.apply(this, arguments);
}
var generateJsonReport = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(results) {
    var testsMappedBySpecPath, suites, totalPassed, stats, jsonFilename, jsonPath;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          testsMappedBySpecPath = testStatuses.reduce(function (map, item) {
            if (map[item.specPath] === undefined) {
              // eslint-disable-next-line no-param-reassign
              map[item.specPath] = {
                name: item.specFilename,
                path: item.specPath,
                tests: []
              };
            }
            map[item.specPath].tests.push(item);
            return map;
          }, {});
          suites = Object.values(testsMappedBySpecPath);
          totalPassed = testStatuses.filter(function (t) {
            return t.status === 'pass';
          }).length;
          stats = {
            total: testStatuses.length,
            totalPassed: totalPassed,
            totalFailed: testStatuses.length - totalPassed,
            totalSuites: suites.length,
            suites: suites,
            startedAt: results.startedTestsAt,
            endedAt: results.endedTestsAt,
            duration: results.totalDuration,
            browserName: results.browserName,
            browserVersion: results.browserVersion,
            cypressVersion: results.cypressVersion
          };
          jsonFilename = _config.userConfig.JSON_REPORT.FILENAME ? "".concat(_config.userConfig.JSON_REPORT.FILENAME, ".json") : "report_".concat((0, _utils.getCleanDate)(stats.startedAt), ".json");
          jsonPath = _path["default"].join(_config["default"].reportDir, jsonFilename);
          if (!_config.userConfig.JSON_REPORT.OVERWRITE) {
            _context2.next = 11;
            break;
          }
          _context2.next = 9;
          return _fsExtra["default"].writeFile(jsonPath, JSON.stringify(stats, null, 2));
        case 9:
          _context2.next = 13;
          break;
        case 11:
          _context2.next = 13;
          return (0, _utils.writeFileIncrement)(jsonPath, JSON.stringify(stats, null, 2));
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function generateJsonReport(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var getCompareSnapshotsPlugin = function getCompareSnapshotsPlugin(on, config) {
  // Create folder structure
  setupFolders();

  // Delete comparison and diff images to ensure a clean run
  tearDownDirs();

  // Force screenshot resolution to keep consistency of test runs across machines
  on('before:browser:launch', function (browser, launchOptions) {
    var width = config.viewportWidth || '1280';
    var height = config.viewportHeight || '720';
    if (browser.name === 'chrome') {
      launchOptions.args.push("--window-size=".concat(width, ",").concat(height));
      launchOptions.args.push('--force-device-scale-factor=1');
    }
    if (browser.name === 'electron') {
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.width = Number.parseInt(width, 10);
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.height = Number.parseInt(height, 10);
    }
    if (browser.name === 'firefox') {
      launchOptions.args.push("--width=".concat(width));
      launchOptions.args.push("--height=".concat(height));
    }
    return launchOptions;
  });

  // Intercept cypress screenshot and create a new image with our own
  // name convention and file structure for simplicity and consistency
  on('after:screenshot', function (details) {
    // A screenshot could be taken automatically due to a test failure
    // and not a call to cy.compareSnapshot / cy.screenshot. These files
    // should be left alone
    if (details.testFailure) {
      return;
    }

    // Change screenshots file permission so it can be moved from drive to drive
    (0, _utils.setFilePermission)(details.path, 511);
    (0, _utils.setFilePermission)(_config["default"].image.comparison(details.name), 511);
    if (config.env.preserveOriginalScreenshot === true) {
      (0, _utils.renameAndCopyFile)(details.path, _config["default"].image.comparison(details.name));
    } else {
      (0, _utils.renameAndMoveFile)(details.path, _config["default"].image.comparison(details.name));
    }
  });
  on('after:run', /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(results) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!_config.userConfig.JSON_REPORT) {
              _context3.next = 3;
              break;
            }
            _context3.next = 3;
            return generateJsonReport(results);
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
  on('task', {
    compareSnapshotsPlugin: compareSnapshotsPlugin,
    copyScreenshot: copyScreenshot,
    deleteScreenshot: deleteScreenshot,
    generateReport: generateReport,
    deleteReport: deleteReport
  });

  // eslint-disable-next-line no-param-reassign
  config.env.cypressImageDiff = _config.userConfig;
  return config;
};
module.exports = getCompareSnapshotsPlugin;