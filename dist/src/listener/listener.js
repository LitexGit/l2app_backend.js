"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../lib/common");
var mylog_1 = require("../lib/mylog");
var HttpWatcher = (function () {
    function HttpWatcher(base, provider, blockInterval, watchList) {
        this.base = base;
        this.provider = provider;
        this.blockInterval = blockInterval;
        this.watchList = watchList;
        this.enabled = true;
    }
    HttpWatcher.prototype.processEvent = function (fromBlockNumber, toBlockNumber, contract, eventName, eventSetting) {
        return __awaiter(this, void 0, void 0, function () {
            var events, _i, events_1, event_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.getPastEvents(eventName, {
                            filter: eventSetting.filter(),
                            fromBlock: fromBlockNumber,
                            toBlock: toBlockNumber
                        })];
                    case 1:
                        events = _a.sent();
                        for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                            event_1 = events_1[_i];
                            try {
                                eventSetting.handler(event_1);
                            }
                            catch (err) {
                            }
                        }
                        return [2];
                }
            });
        });
    };
    HttpWatcher.prototype.processAllEvent = function (fromBlockNumber, toBlockNumber, watchItem) {
        return __awaiter(this, void 0, void 0, function () {
            var events, _i, events_2, event_2, eventName, returnValues, filter, filterResult, k;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, watchItem.contract.getPastEvents("allEvents", {
                            fromBlock: fromBlockNumber,
                            toBlock: toBlockNumber
                        })];
                    case 1:
                        events = _a.sent();
                        _i = 0, events_2 = events;
                        _a.label = 2;
                    case 2:
                        if (!(_i < events_2.length)) return [3, 5];
                        event_2 = events_2[_i];
                        eventName = event_2.event, returnValues = event_2.returnValues;
                        if (!watchItem.listener[eventName]) return [3, 4];
                        filter = watchItem.listener[eventName].filter();
                        filterResult = true;
                        for (k in filter) {
                            if (!returnValues[k] ||
                                returnValues[k].toLowerCase() !== filter[k].toLowerCase()) {
                                filterResult = false;
                                break;
                            }
                        }
                        if (!filterResult) return [3, 4];
                        return [4, watchItem.listener[eventName].handler(event_2)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5: return [2];
                }
            });
        });
    };
    HttpWatcher.prototype.start = function (lastBlockNumber) {
        if (lastBlockNumber === void 0) { lastBlockNumber = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var currentBlockNumber, _i, _a, watchItem, _b, _c, watchItem, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this.base.getBlockNumber()];
                    case 1:
                        currentBlockNumber = _d.sent();
                        lastBlockNumber = lastBlockNumber || currentBlockNumber - 10;
                        mylog_1.logger.debug("start syncing process", lastBlockNumber, currentBlockNumber);
                        _d.label = 2;
                    case 2:
                        if (!(lastBlockNumber <= currentBlockNumber)) return [3, 4];
                        for (_i = 0, _a = this.watchList; _i < _a.length; _i++) {
                            watchItem = _a[_i];
                            this.processAllEvent(lastBlockNumber, currentBlockNumber, watchItem);
                            if (this.enabled == false) {
                                return [2];
                            }
                        }
                        lastBlockNumber = currentBlockNumber + 1;
                        return [4, this.base.getBlockNumber()];
                    case 3:
                        currentBlockNumber = _d.sent();
                        return [3, 2];
                    case 4:
                        mylog_1.logger.debug("finish syncing process", currentBlockNumber);
                        _d.label = 5;
                    case 5:
                        if (!true) return [3, 11];
                        return [4, common_1.Common.Sleep(this.blockInterval)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 9, , 10]);
                        lastBlockNumber = currentBlockNumber + 1;
                        return [4, this.base.getBlockNumber()];
                    case 8:
                        currentBlockNumber = _d.sent();
                        if (lastBlockNumber > currentBlockNumber) {
                            return [3, 5];
                        }
                        for (_b = 0, _c = this.watchList; _b < _c.length; _b++) {
                            watchItem = _c[_b];
                            this.processAllEvent(lastBlockNumber, currentBlockNumber, watchItem);
                            if (this.enabled == false) {
                                return [2];
                            }
                        }
                        return [3, 10];
                    case 9:
                        err_1 = _d.sent();
                        mylog_1.logger.error("watching error: ", err_1);
                        return [3, 10];
                    case 10: return [3, 5];
                    case 11: return [2];
                }
            });
        });
    };
    HttpWatcher.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.enabled = false;
                return [2];
            });
        });
    };
    return HttpWatcher;
}());
exports.default = HttpWatcher;
//# sourceMappingURL=listener.js.map