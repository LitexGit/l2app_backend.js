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
                                console.log("process event: ", eventName, err);
                            }
                        }
                        return [2];
                }
            });
        });
    };
    HttpWatcher.prototype.start = function (lastBlockNumber) {
        if (lastBlockNumber === void 0) { lastBlockNumber = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var currentBlockNumber, _i, _a, watchItem, _b, _c, _d, eventName, _e, _f, watchItem, _g, _h, _j, eventName, err_1;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4, this.base.getBlockNumber()];
                    case 1:
                        currentBlockNumber = _k.sent();
                        lastBlockNumber = lastBlockNumber || currentBlockNumber - 10;
                        console.log("start syncing process", lastBlockNumber, currentBlockNumber);
                        _k.label = 2;
                    case 2:
                        if (!(lastBlockNumber <= currentBlockNumber)) return [3, 11];
                        _i = 0, _a = this.watchList;
                        _k.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3, 9];
                        watchItem = _a[_i];
                        _b = [];
                        for (_c in watchItem.listener)
                            _b.push(_c);
                        _d = 0;
                        _k.label = 4;
                    case 4:
                        if (!(_d < _b.length)) return [3, 7];
                        eventName = _b[_d];
                        return [4, this.processEvent(lastBlockNumber, currentBlockNumber, watchItem.contract, eventName, watchItem.listener[eventName])];
                    case 5:
                        _k.sent();
                        _k.label = 6;
                    case 6:
                        _d++;
                        return [3, 4];
                    case 7:
                        if (this.enabled == false) {
                            return [2];
                        }
                        _k.label = 8;
                    case 8:
                        _i++;
                        return [3, 3];
                    case 9:
                        lastBlockNumber = currentBlockNumber + 1;
                        return [4, this.base.getBlockNumber()];
                    case 10:
                        currentBlockNumber = _k.sent();
                        return [3, 2];
                    case 11:
                        console.log("finish syncing process", currentBlockNumber);
                        _k.label = 12;
                    case 12:
                        if (!true) return [3, 25];
                        return [4, common_1.Common.Sleep(this.blockInterval)];
                    case 13:
                        _k.sent();
                        _k.label = 14;
                    case 14:
                        _k.trys.push([14, 23, , 24]);
                        lastBlockNumber = currentBlockNumber + 1;
                        return [4, this.base.getBlockNumber()];
                    case 15:
                        currentBlockNumber = _k.sent();
                        if (lastBlockNumber > currentBlockNumber) {
                            return [3, 12];
                        }
                        _e = 0, _f = this.watchList;
                        _k.label = 16;
                    case 16:
                        if (!(_e < _f.length)) return [3, 22];
                        watchItem = _f[_e];
                        _g = [];
                        for (_h in watchItem.listener)
                            _g.push(_h);
                        _j = 0;
                        _k.label = 17;
                    case 17:
                        if (!(_j < _g.length)) return [3, 20];
                        eventName = _g[_j];
                        return [4, this.processEvent(lastBlockNumber, currentBlockNumber, watchItem.contract, eventName, watchItem.listener[eventName])];
                    case 18:
                        _k.sent();
                        _k.label = 19;
                    case 19:
                        _j++;
                        return [3, 17];
                    case 20:
                        if (this.enabled == false) {
                            return [2];
                        }
                        _k.label = 21;
                    case 21:
                        _e++;
                        return [3, 16];
                    case 22: return [3, 24];
                    case 23:
                        err_1 = _k.sent();
                        console.error("watching error: ", err_1);
                        return [3, 24];
                    case 24: return [3, 12];
                    case 25: return [2];
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