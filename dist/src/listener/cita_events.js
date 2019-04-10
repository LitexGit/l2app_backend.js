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
var common_1 = require("../lib/common");
var mylog_1 = require("../lib/mylog");
exports.CITA_EVENTS = {
    Transfer: {
        filter: function () { return ({ to: server_1.cpProvider.address }); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, from, to, channelID, balance, transferAmount, additionalHash, channel, token, assetEvent, _b, feeProofAmount, road, feeRate, amount, bn, feeAmount, feeNonce, messageHash, signature;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = event.returnValues, from = _a.from, to = _a.to, channelID = _a.channelID, balance = _a.balance, transferAmount = _a.transferAmount, additionalHash = _a.additionalHash;
                        mylog_1.logger.debug("--------------------Handle CITA Transfer--------------------");
                        mylog_1.logger.debug("from :[%s], to :[%s], channelID :[%s], balance :[%s], transferAmount :[%s], additionalHash :[%s]", from, to, channelID, balance, transferAmount, additionalHash);
                        return [4, server_1.appPN.methods.channelMap(channelID).call()];
                    case 1:
                        channel = _c.sent();
                        token = channel.token;
                        mylog_1.logger.debug("channel", channel);
                        assetEvent = {
                            from: from,
                            to: to,
                            token: token,
                            amount: transferAmount,
                            additionalHash: additionalHash,
                            totalTransferredAmount: balance
                        };
                        if (server_1.callbacks.get("Transfer") &&
                            additionalHash ===
                                "0x0000000000000000000000000000000000000000000000000000000000000000") {
                            server_1.callbacks.get("Transfer")(null, assetEvent);
                        }
                        return [4, server_1.appPN.methods.feeProofMap(token).call()];
                    case 2:
                        _b = _c.sent(), feeProofAmount = _b.amount, road = _b.nonce;
                        return [4, server_1.appPN.methods.feeRateMap(token).call()];
                    case 3:
                        feeRate = _c.sent();
                        if (Number(feeRate) === 0) {
                            mylog_1.logger.debug("feeRate is 0, will do nothing");
                            return [2];
                        }
                        mylog_1.logger.debug("start to submit feeProof, old feeProofAmount :[%s], feeRate :[%s]", feeProofAmount, feeRate);
                        return [4, Promise.all([
                                server_1.appPN.methods.balanceProofMap(channelID, server_1.cpProvider.address).call()
                            ])];
                    case 4:
                        amount = (_c.sent())[0].balance;
                        bn = server_1.web3.utils.toBN;
                        feeAmount = bn(feeProofAmount)
                            .add(bn(feeRate)
                            .mul(bn(balance).sub(bn(amount)))
                            .div(bn(10000)))
                            .toString();
                        mylog_1.logger.debug("provider balance :[%s], provider nonce :[%s], event Balance :[%s], feeAmount :[%s]", amount, road, balance, feeAmount);
                        feeNonce = Number(road) + 1;
                        messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: token, t: "address" }, { v: feeAmount, t: "uint256" }, { v: feeNonce, t: "uint256" });
                        signature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
                        mylog_1.logger.debug("infos:  channelID :[%s], token :[%s], feeAmount :[%s], feeNonce :[%s], signature :[%s]", channelID, token, feeAmount, feeNonce, signature);
                        common_1.Common.SendAppChainTX(server_1.appPN.methods.submitFee(channelID, token, feeAmount, feeNonce, signature), server_1.cpProvider.address, server_1.cpProvider.privateKey);
                        return [2];
                }
            });
        }); }
    },
    SubmitFee: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, token, amount, nonce;
            return __generator(this, function (_b) {
                mylog_1.logger.debug("--------------------Handle CITA SubmitFee--------------------");
                _a = event.returnValues, token = _a.token, amount = _a.amount, nonce = _a.nonce;
                mylog_1.logger.debug("token:[%s], amount:[%s], nonce:[%s]", token, amount, nonce);
                return [2];
            });
        }); }
    },
    UserProposeWithdraw: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, user, channelID, amount, balance, receiver, lastCommitBlock, messageHash, signature;
            return __generator(this, function (_b) {
                _a = event.returnValues, user = _a.user, channelID = _a.channelID, amount = _a.amount, balance = _a.balance, receiver = _a.receiver, lastCommitBlock = _a.lastCommitBlock;
                mylog_1.logger.debug("--------------------Handle CITA UserProposeWithdraw--------------------");
                mylog_1.logger.debug("user :[%s], channelID :[%s], amount :[%s], balance :[%s], receiver :[%s], lastCommitBlock :[%s] ", user, channelID, amount, balance, receiver, lastCommitBlock);
                messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: balance, t: "uint256" }, { v: lastCommitBlock, t: "uint256" });
                signature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
                common_1.Common.SendAppChainTX(server_1.appPN.methods.confirmUserWithdraw(channelID, signature), server_1.cpProvider.address, server_1.cpProvider.privateKey);
                return [2];
            });
        }); }
    },
    ProposeCooperativeSettle: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, balance, lastCommitBlock, messageHash, signature;
            return __generator(this, function (_b) {
                _a = event.returnValues, channelID = _a.channelID, balance = _a.balance, lastCommitBlock = _a.lastCommitBlock;
                mylog_1.logger.debug("--------------------Handle CITA ProposeCooperativeSettle--------------------");
                mylog_1.logger.debug(" channelID: [%s], balance:[%s], lastCommitBlock:[%s] ", channelID, balance, lastCommitBlock);
                messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: balance, t: "uint256" }, { v: lastCommitBlock, t: "uint256" });
                signature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
                common_1.Common.SendAppChainTX(server_1.appPN.methods.confirmCooperativeSettle(channelID, signature), server_1.cpProvider.address, server_1.cpProvider.privateKey);
                return [2];
            });
        }); }
    },
    ConfirmProviderWithdraw: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, token, balance, lastCommitBlock, signature, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = event.returnValues, token = _a.token, balance = _a.amount, lastCommitBlock = _a.lastCommitBlock, signature = _a.signature;
                        mylog_1.logger.debug("--------------------Handle CITA ConfirmProviderWithdraw--------------------");
                        mylog_1.logger.debug(" token: [%s], balance: [%s], lastCommitBlock: [%s], signature: [%s]", token, balance, lastCommitBlock, signature);
                        return [4, server_1.ethPN.methods
                                .providerWithdraw(token, balance, lastCommitBlock, signature)
                                .encodeABI()];
                    case 1:
                        data = _b.sent();
                        common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data, server_1.cpProvider.privateKey);
                        return [2];
                }
            });
        }); }
    },
    OnchainProviderWithdraw: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var returnValues, txhash, token, amount, balance, providerWithdrawEvent;
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle CITA OnchainProviderWithdraw--------------------");
                returnValues = event.returnValues, txhash = event.transactionHash;
                token = returnValues.token, amount = returnValues.amount, balance = returnValues.balance;
                mylog_1.logger.debug("token:[%s], amount:[%s], balance:[%s]", token, amount, balance);
                providerWithdrawEvent = {
                    token: token,
                    amount: amount,
                    totalWithdraw: amount,
                    txhash: txhash
                };
                if (server_1.callbacks.get("ProviderWithdraw")) {
                    server_1.callbacks.get("ProviderWithdraw")(null, providerWithdrawEvent);
                }
                return [2];
            });
        }); }
    },
    OnchainProviderDeposit: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var returnValues, txhash, token, amount, providerDepositEvent;
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle CITA OnchainProviderDeposit--------------------");
                returnValues = event.returnValues, txhash = event.transactionHash;
                token = returnValues.token, amount = returnValues.amount;
                mylog_1.logger.debug("token:[%s], amount:[%s]", token, amount);
                providerDepositEvent = {
                    token: token,
                    amount: amount,
                    totalDeposit: amount,
                    txhash: txhash
                };
                if (server_1.callbacks.get("ProviderDeposit")) {
                    server_1.callbacks.get("ProviderDeposit")(null, providerDepositEvent);
                }
                return [2];
            });
        }); }
    },
    OnchainUserDeposit: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, newDeposit, totalDeposit, txhash, token, userNewDepositEvent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mylog_1.logger.debug("--------------------Handle CITA OnchainUserDeposit--------------------");
                        _a = event.returnValues, channelID = _a.channelID, user = _a.user, newDeposit = _a.deposit, totalDeposit = _a.totalDeposit, txhash = event.transactionHash;
                        mylog_1.logger.debug(" channelID: [%s], user: [%s], newDeposit: [%s], totalDeposit: [%s] ", channelID, user, newDeposit, totalDeposit);
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
                        if (server_1.callbacks.get("UserDeposit")) {
                            server_1.callbacks.get("UserDeposit")(null, userNewDepositEvent);
                        }
                        return [2];
                }
            });
        }); }
    },
    OnchainUserWithdraw: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, amount, totalWithdraw, txhash, token, userWithdrawEvent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mylog_1.logger.debug("--------------------Handle CITA OnchainUserWithdraw--------------------");
                        _a = event.returnValues, channelID = _a.channelID, user = _a.user, amount = _a.amount, totalWithdraw = _a.withdraw, txhash = event.transactionHash;
                        mylog_1.logger.debug(" channelID: [%s], user: [%s], amount: [%s], totalWithdraw: [%s] ", channelID, user, amount, totalWithdraw);
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
                        if (server_1.callbacks.get("UserWithdraw")) {
                            server_1.callbacks.get("UserWithdraw")(null, userWithdrawEvent);
                        }
                        return [2];
                }
            });
        }); }
    },
    OnchainOpenChannel: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, user, token, amount, channelID, txhash, userJoinEvent;
            return __generator(this, function (_b) {
                mylog_1.logger.debug("--------------------Handle CITA OnchainOpenChannel--------------------");
                _a = event.returnValues, user = _a.user, token = _a.token, amount = _a.amount, channelID = _a.channelID, txhash = event.transactionHash;
                mylog_1.logger.debug(" sender: [%s], user: [%s], token: [%s], amount: [%s], channelID: [%s] ", user, user, token, amount, channelID);
                userJoinEvent = {
                    sender: user,
                    user: user,
                    type: 1,
                    token: token,
                    amount: amount,
                    totalDeposit: amount,
                    txhash: txhash
                };
                if (server_1.callbacks.get("UserDeposit")) {
                    server_1.callbacks.get("UserDeposit")(null, userJoinEvent);
                }
                return [2];
            });
        }); }
    },
    OnchainCooperativeSettleChannel: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, token, balance, txhash, userLeaveEvent;
            return __generator(this, function (_b) {
                mylog_1.logger.debug("--------------------Handle CITA OnchainCooperativeSettleChannel--------------------");
                _a = event.returnValues, channelID = _a.channelID, user = _a.user, token = _a.token, balance = _a.balance, txhash = event.transactionHash;
                mylog_1.logger.debug(" channelID: [%s], user: [%s], token: [%s], balance: [%s] ", channelID, user, token, balance);
                userLeaveEvent = {
                    user: user,
                    type: 2,
                    token: token,
                    amount: balance,
                    totalWithdraw: "",
                    txhash: txhash
                };
                if (server_1.callbacks.get("UserWithdraw")) {
                    server_1.callbacks.get("UserWithdraw")(null, userLeaveEvent);
                }
                return [2];
            });
        }); }
    },
    OnchainSettleChannel: {
        filter: function () { return ({}); },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, user, token, transferTouserAmount, transferToProviderAmount, txhash, closer, userLeaveEvent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mylog_1.logger.debug("--------------------Handle CITA OnchainSettleChannel--------------------");
                        _a = event.returnValues, channelID = _a.channelID, user = _a.user, token = _a.token, transferTouserAmount = _a.userSettleAmount, transferToProviderAmount = _a.providerSettleAmount, txhash = event.transactionHash;
                        mylog_1.logger.debug(" channelID: [%s], user: [%s], token: [%s], transferTouserAmount: [%s], transferToProviderAmount: [%s] ", channelID, user, token, transferTouserAmount, transferToProviderAmount);
                        return [4, server_1.appPN.methods.closingChannelMap(channelID).call()];
                    case 1:
                        closer = (_b.sent()).closer;
                        userLeaveEvent = {
                            closer: closer,
                            user: user,
                            token: token,
                            userSettleAmount: transferTouserAmount,
                            providerSettleAmount: transferToProviderAmount,
                            txhash: txhash
                        };
                        if (server_1.callbacks.get("UserForceWithdraw")) {
                            server_1.callbacks.get("UserForceWithdraw")(null, userLeaveEvent);
                        }
                        return [2];
                }
            });
        }); }
    }
};
//# sourceMappingURL=cita_events.js.map