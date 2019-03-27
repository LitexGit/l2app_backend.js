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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("./sdk/sdk");
var config_dev_1 = require("./conf/config.dev");
var common_1 = require("./lib/common");
process.on('unhandledRejection', function (reason, p) {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
var l2 = sdk_1.L2.GetInstance();
l2.Init(config_dev_1.cpPrivateKey, config_dev_1.ethProvider, config_dev_1.ethPaymentNetwork, config_dev_1.appRpcUrl, config_dev_1.appPaymentNetwork);
l2.on('Transfer', function (err, res) {
    console.log("SDK Receive Asset", res);
    var sender = res.sender, receiver = res.receiver, token = res.token, amount = res.amount, totalTransferredAmount = res.totalTransferredAmount;
    l2.Transfer(sender, amount, token);
});
l2.on('UserDeposit', function (err, res) {
    console.log("SDK Receive UserDeposit", res);
});
l2.on('UserWithdraw', function (err, res) {
    console.log("SDK Receive UserWithdraw", res);
});
l2.on('ProviderWithdraw', function (err, res) {
    console.log("SDK Receive ProviderWithdraw", res);
});
l2.on('UserForceWithdraw', function (err, res) {
    console.log("SDK Receive UserForceWithdraw", res);
});
l2.on('Message', function (err, res) { return __awaiter(_this, void 0, void 0, function () {
    var sessionID, user, type, content, token, amount, players;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("SDK Receive Message", res);
                sessionID = res.sessionID, user = res.from, type = res.type, content = res.content, token = res.token, amount = res.amount;
                return [4, l2.GetPlayersBySessionId(sessionID)];
            case 1:
                players = _a.sent();
                console.log('session players', players);
                return [4, l2.SendMessage(sessionID, user, type + 'res', content, amount, token)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); });
var port = 9527;
var express = require('express');
var app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.get('/getSessionId', function (req, res) {
    var game = "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928";
    var customData = "hello world";
    var sessionId = common_1.Common.GenerateSessionID(game);
    l2.StartSession(sessionId, game, customData);
    res.json({
        status: 1,
        data: { sessionId: sessionId }
    });
});
app.get('/closeSession', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.query.sessionId;
                    return [4, l2.CloseSession(sessionId)];
                case 1:
                    _a.sent();
                    res.json({
                        status: 1,
                        data: { msg: 'ok' }
                    });
                    return [2];
            }
        });
    });
});
app.get('/getTransactions', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId;
        return __generator(this, function (_a) {
            sessionId = req.query.sessionId;
            res.json({
                status: 1,
                data: { msg: 'ok' }
            });
            return [2];
        });
    });
});
app.get('/providerWithdraw', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId;
        return __generator(this, function (_a) {
            sessionId = req.query.sessionId;
            res.json({
                status: 1,
                data: { msg: 'ok' }
            });
            return [2];
        });
    });
});
app.get('/rebalance', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId;
        return __generator(this, function (_a) {
            sessionId = req.query.sessionId;
            res.json({
                status: 1,
                data: { msg: 'ok' }
            });
            return [2];
        });
    });
});
app.get('/forceClose', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId;
        return __generator(this, function (_a) {
            sessionId = req.query.sessionId;
            res.json({
                status: 1,
                data: { msg: 'ok' }
            });
            return [2];
        });
    });
});
app.listen(port, function () {
    console.log("Server running at :" + port);
});
//# sourceMappingURL=index_test.js.map