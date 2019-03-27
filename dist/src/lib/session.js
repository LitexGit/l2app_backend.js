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
var common_1 = require("./common");
var server_1 = require("./server");
var contract_1 = require("../conf/contract");
var Session = (function () {
    function Session(sessionID) {
        this.id = sessionID;
    }
    Session.InitSession = function (sessionID, game, customData) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, rs, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, common_1.Common.BuildAppChainTX()];
                    case 1:
                        tx = _a.sent();
                        return [4, server_1.sessionPN.methods.initSession(sessionID, server_1.cpProvider.address, game, [server_1.cpProvider.address], server_1.appPN.options.address, server_1.web3.utils.toHex(customData)).send(tx)];
                    case 2:
                        rs = _a.sent();
                        if (!rs.hash) return [3, 4];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 3:
                        receipt = _a.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, 'confirm success'];
                        }
                        else {
                            return [2, 'confirm fail'];
                        }
                        return [3, 5];
                    case 4: return [2, 'send CITA tx fail'];
                    case 5: return [2];
                }
            });
        });
    };
    Session.JoinSession = function (sessionID, user) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, rs, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, common_1.Common.BuildAppChainTX()];
                    case 1:
                        tx = _a.sent();
                        return [4, server_1.sessionPN.methods.joinSession(sessionID, user).send(tx)];
                    case 2:
                        rs = _a.sent();
                        if (!rs.hash) return [3, 4];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 3:
                        receipt = _a.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, 'confirm success'];
                        }
                        else {
                            return [2, 'confirm fail'];
                        }
                        return [3, 5];
                    case 4: return [2, 'send CITA tx fail'];
                    case 5: return [2];
                }
            });
        });
    };
    Session.SendSessionMessage = function (from, to, sessionData, paymentData) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, rs, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, common_1.Common.BuildAppChainTX()];
                    case 1:
                        tx = _a.sent();
                        return [4, server_1.sessionPN.methods.sendMessage(from, to, sessionData.sessionID, sessionData.mType, sessionData.content, sessionData.signature, paymentData.channelID, paymentData.balance, paymentData.nonce, paymentData.additionalHash, paymentData.paymentSignature).send(tx)];
                    case 2:
                        rs = _a.sent();
                        console.log('sendMessage params', [
                            from, to,
                            sessionData.sessionID, sessionData.mType, sessionData.content, sessionData.signature,
                            paymentData.channelID, paymentData.balance, paymentData.nonce, paymentData.additionalHash, paymentData.paymentSignature
                        ]);
                        if (!rs.hash) return [3, 4];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 3:
                        receipt = _a.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, rs.hash];
                        }
                        else {
                            throw new Error('CITA tx confirm fail' + receipt.errorMessage);
                        }
                        return [3, 5];
                    case 4: throw new Error('send CITA tx fail');
                    case 5: return [2];
                }
            });
        });
    };
    Session.CloseSession = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, rs, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, common_1.Common.BuildAppChainTX()];
                    case 1:
                        tx = _a.sent();
                        return [4, server_1.sessionPN.methods.closeSession(sessionID).send(tx)];
                    case 2:
                        rs = _a.sent();
                        if (!rs.hash) return [3, 4];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 3:
                        receipt = _a.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, 'confirm success'];
                        }
                        else {
                            return [2, 'confirm fail'];
                        }
                        return [3, 5];
                    case 4: return [2, 'send CITA tx fail'];
                    case 5: return [2];
                }
            });
        });
    };
    Session.GetSession = function (sessionID, fromLine) {
        if (fromLine === void 0) { fromLine = false; }
        return __awaiter(this, void 0, void 0, function () {
            var session, sessionExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fromLine) return [3, 2];
                        return [4, server_1.sessionPN.methods.sessions(sessionID).call()];
                    case 1: return [2, _a.sent()];
                    case 2:
                        session = Session.sessionList.get(sessionID);
                        if (!!session) return [3, 5];
                        return [4, Session.isExists(sessionID)];
                    case 3:
                        sessionExist = _a.sent();
                        if (!sessionExist) {
                            return [2, null];
                        }
                        session = new Session(sessionID);
                        return [4, session.initialize()];
                    case 4:
                        _a.sent();
                        Session.sessionList.set(sessionID, session);
                        _a.label = 5;
                    case 5: return [2, session];
                }
            });
        });
    };
    Session.isExists = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, server_1.sessionPN.methods.sessions(sessionID).call()];
                    case 1:
                        session = _a.sent();
                        if (Number(session.status) === contract_1.SESSION_STATUS.SESSION_STATUS_INIT) {
                            return [2, false];
                        }
                        return [2, true];
                }
            });
        });
    };
    Session.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status, game, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, server_1.sessionPN.methods.sessions(this.id).call()];
                    case 1:
                        _a = _b.sent(), status = _a.status, game = _a.game, data = _a.data;
                        this.status = Number(status);
                        this.game = game;
                        this.customData = data;
                        return [2];
                }
            });
        });
    };
    Session.sessionList = new Map();
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=session.js.map