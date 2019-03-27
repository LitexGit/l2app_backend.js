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
var server_1 = require("../lib/server");
var contract_1 = require("../conf/contract");
var common_1 = require("../lib/common");
exports.ETH_EVENTS = {
    'ProviderNewDeposit': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("ProviderNewDeposit event", event);
                return [2];
            });
        }); }
    },
    'ProviderWithdraw': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, token, amount, balance, txhash, providerWithdrawEvent;
            return __generator(this, function (_b) {
                console.log("ProviderWithdraw event", event);
                _a = event.returnValues, token = _a.token, amount = _a.amount, balance = _a.balance, txhash = event.transactionHash;
                providerWithdrawEvent = { token: token, amount: amount, totalWithdraw: balance, txhash: txhash };
                if (server_1.callbacks.get('ProviderWithdraw')) {
                    server_1.callbacks.get('ProviderWithdraw')(null, providerWithdrawEvent);
                }
                return [2];
            });
        }); }
    },
    'UserNewDeposit': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, newDeposit, totalDeposit, txhash, token, userNewDepositEvent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("UserNewDeposit event", event);
                        _a = event.returnValues, channelID = _a.channelID, user = _a.user, newDeposit = _a.newDeposit, totalDeposit = _a.totalDeposit, txhash = event.transactionHash;
                        return [4, server_1.appPN.methods.channelMap(channelID).call()];
                    case 1:
                        token = (_b.sent()).token;
                        userNewDepositEvent = {
                            sender: user,
                            user: user,
                            type: 2,
                            token: token,
                            amount: newDeposit,
                            totalDeposit: totalDeposit,
                            txhash: txhash
                        };
                        if (server_1.callbacks.get('UserDeposit')) {
                            server_1.callbacks.get('UserDeposit')(null, userNewDepositEvent);
                        }
                        return [2];
                }
            });
        }); }
    },
    'UserWithdraw': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, amount, totalWithdraw, txhash, token, userWithdrawEvent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("UserWithdraw event", event);
                        _a = event.returnValues, channelID = _a.channelID, user = _a.user, amount = _a.amount, totalWithdraw = _a.totalWithdraw, txhash = event.transactionHash;
                        return [4, server_1.appPN.methods.channelMap(channelID).call()];
                    case 1:
                        token = (_b.sent()).token;
                        userWithdrawEvent = {
                            user: user,
                            type: 1,
                            token: token,
                            amount: amount,
                            totalWithdraw: totalWithdraw,
                            txhash: txhash
                        };
                        if (server_1.callbacks.get('UserWithdraw')) {
                            server_1.callbacks.get('UserWithdraw')(null, userWithdrawEvent);
                        }
                        return [2];
                }
            });
        }); }
    },
    'ChannelOpened': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, sender, user, token, amount, channelID, txhash, userJoinEvent;
            return __generator(this, function (_b) {
                console.log("ChannelOpened event", event);
                _a = event.returnValues, sender = _a.sender, user = _a.user, token = _a.token, amount = _a.amount, channelID = _a.channelID, txhash = event.transactionHash;
                userJoinEvent = {
                    sender: sender,
                    user: user,
                    type: 1,
                    token: token,
                    amount: amount,
                    totalDeposit: amount,
                    txhash: txhash
                };
                if (server_1.callbacks.get('UserDeposit')) {
                    server_1.callbacks.get('UserDeposit')(null, userJoinEvent);
                }
                return [2];
            });
        }); }
    },
    'ChannelClosed': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var channelID, channel, data, current, _a, balance, nonce, additionalHash, partnerSignature, messageHash, consignorSignature, _b, balance, nonce, additionalHash, partnerSignature, consignorSignature, settle, current_1, settleData, hash;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("ChannelClosed event", event);
                        channelID = event.returnValues.channelID;
                        return [4, server_1.ethPN.methods.channels(channelID).call()];
                    case 1:
                        channel = _c.sent();
                        if (Number(channel.status) !== contract_1.CHANNEL_STATUS.CHANNEL_STATUS_CLOSE) {
                            return [2];
                        }
                        return [4, server_1.web3.eth.getBlockNumber()];
                    case 2:
                        current = _c.sent();
                        if (!(current < channel.settleBlock)) return [3, 11];
                        if (!channel.isCloser) return [3, 7];
                        return [4, Promise.all([
                                server_1.appPN.methods.balanceProofMap(channelID, server_1.cpProvider.address).call()
                            ])];
                    case 3:
                        _a = (_c.sent())[0], balance = _a.balance, nonce = _a.nonce, additionalHash = _a.additionalHash, partnerSignature = _a.signature;
                        if (!(Number(nonce) === 0)) return [3, 4];
                        return [3, 6];
                    case 4:
                        messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: 'address' }, { v: channelID, t: 'bytes32' }, { v: balance, t: 'uint256' }, { v: nonce, t: 'uint256' }, { v: additionalHash, t: 'bytes32' }, { v: partnerSignature, t: 'bytes' });
                        consignorSignature = common_1.Common.SignatureToHex(messageHash);
                        data = server_1.ethPN.methods.partnerUpdateProof(channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature).encodeABI();
                        return [4, common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [3, 11];
                    case 7: return [4, Promise.all([
                            server_1.appPN.methods.balanceProofMap(channelID, channel.user).call()
                        ])];
                    case 8:
                        _b = (_c.sent())[0], balance = _b.balance, nonce = _b.nonce, additionalHash = _b.additionalHash, partnerSignature = _b.signature, consignorSignature = _b.consignorSignature;
                        if (!(Number(nonce) === 0)) return [3, 9];
                        return [3, 11];
                    case 9:
                        data = server_1.ethPN.methods.partnerUpdateProof(channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature).encodeABI();
                        return [4, common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data)];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11:
                        settle = channel.settleBlock;
                        _c.label = 12;
                    case 12:
                        if (!true) return [3, 17];
                        return [4, server_1.web3.eth.getBlockNumber()];
                    case 13:
                        current_1 = _c.sent();
                        if (!(current_1 >= settle)) return [3, 15];
                        settleData = server_1.ethPN.methods.settleChannel(channelID).encodeABI();
                        return [4, common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, settleData)];
                    case 14:
                        hash = _c.sent();
                        console.log('Settle Channel HASH:', hash);
                        return [3, 17];
                    case 15: return [4, common_1.Common.Sleep(15000)];
                    case 16:
                        _c.sent();
                        console.log('settle count down. current:', current_1, 'target:', settle);
                        return [3, 12];
                    case 17: return [2];
                }
            });
        }); }
    },
    'CooperativeSettled': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, token, balance, txhash, userLeaveEvent;
            return __generator(this, function (_b) {
                console.log("ChannelClosed event", event);
                _a = event.returnValues, channelID = _a.channelID, user = _a.user, token = _a.token, balance = _a.balance, txhash = event.transactionHash;
                userLeaveEvent = {
                    user: user,
                    type: 2,
                    token: token,
                    amount: balance,
                    totalWithdraw: '',
                    txhash: txhash
                };
                if (server_1.callbacks.get('UserWithdraw')) {
                    server_1.callbacks.get('UserWithdraw')(null, userLeaveEvent);
                }
                return [2];
            });
        }); }
    },
    'ChannelSettled': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, token, transferTouserAmount, transferToProviderAmount, txhash, channel, closer, userLeaveEvent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("ChannelClosed event", event);
                        _a = event.returnValues, channelID = _a.channelID, user = _a.user, token = _a.token, transferTouserAmount = _a.transferTouserAmount, transferToProviderAmount = _a.transferToProviderAmount, txhash = event.transactionHash;
                        return [4, server_1.ethPN.methods.channels(channelID).call()];
                    case 1:
                        channel = _b.sent();
                        return [4, server_1.appPN.methods.closingChannelMap(channelID).call()];
                    case 2:
                        closer = (_b.sent()).closer;
                        userLeaveEvent = {
                            closer: closer,
                            user: user,
                            token: token,
                            userSettleAmount: transferTouserAmount,
                            providerSettleAmount: transferToProviderAmount,
                            txhash: txhash
                        };
                        if (server_1.callbacks.get('UserForceWithdraw')) {
                            server_1.callbacks.get('UserForceWithdraw')(null, userLeaveEvent);
                        }
                        return [2];
                }
            });
        }); }
    },
};
//# sourceMappingURL=eth_events.js.map