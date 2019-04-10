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
var mylog_1 = require("../lib/mylog");
exports.ETH_EVENTS = {
    ProviderNewDeposit: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); }); }
    },
    ProviderWithdraw: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle ETH ProviderWithdraw--------------------");
                return [2];
            });
        }); }
    },
    UserNewDeposit: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle ETH UserNewDeposit--------------------");
                return [2];
            });
        }); }
    },
    UserWithdraw: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle ETH UserWithdraw--------------------");
                return [2];
            });
        }); }
    },
    ChannelOpened: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle ETH ChannelOpened--------------------");
                return [2];
            });
        }); }
    },
    ChannelClosed: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, balance, nonce, inAmount, inNonce, channel, data, current, _b, balance_1, nonce_1, additionalHash, partnerSignature, messageHash, consignorSignature, _c, balance_2, nonce_2, additionalHash, partnerSignature, consignorSignature, settle, current_1, settleData, hash;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        mylog_1.logger.debug("--------------------Handle ETH ChannelClosed--------------------");
                        _a = event.returnValues, channelID = _a.channelID, balance = _a.balance, nonce = _a.nonce, inAmount = _a.inAmount, inNonce = _a.inNonce;
                        mylog_1.logger.debug("channelID: [%s], balance: [%s], nonce: [%s], inAmount: [%s], inNonce: [%s]", channelID, balance, nonce, inAmount, inNonce);
                        return [4, server_1.ethPN.methods.channels(channelID).call()];
                    case 1:
                        channel = _d.sent();
                        if (Number(channel.status) !== contract_1.CHANNEL_STATUS.CHANNEL_STATUS_CLOSE) {
                            return [2];
                        }
                        return [4, server_1.web3.eth.getBlockNumber()];
                    case 2:
                        current = _d.sent();
                        if (!(current < channel.settleBlock)) return [3, 12];
                        if (!channel.isCloser) return [3, 7];
                        return [4, Promise.all([
                                server_1.appPN.methods.balanceProofMap(channelID, server_1.cpProvider.address).call()
                            ])];
                    case 3:
                        _b = (_d.sent())[0], balance_1 = _b.balance, nonce_1 = _b.nonce, additionalHash = _b.additionalHash, partnerSignature = _b.signature;
                        if (!(Number(nonce_1) === 0)) return [3, 4];
                        mylog_1.logger.debug("no transfer data, will not submit proof");
                        return [3, 6];
                    case 4:
                        messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: balance_1, t: "uint256" }, { v: nonce_1, t: "uint256" }, { v: additionalHash, t: "bytes32" }, { v: partnerSignature, t: "bytes" });
                        consignorSignature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
                        mylog_1.logger.debug("user close the channel, provider will submit proof");
                        mylog_1.logger.debug("proof data: channelID: [%s], balance: [%s], nonce: [%s], additionalHash: [%s], partnerSignature: [%s], consignorSignature: [%s]", channelID, balance_1, nonce_1, additionalHash, partnerSignature, consignorSignature);
                        data = server_1.ethPN.methods
                            .partnerUpdateProof(channelID, balance_1, nonce_1, additionalHash, partnerSignature, consignorSignature)
                            .encodeABI();
                        return [4, common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data, server_1.cpProvider.privateKey)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [3, 12];
                    case 7: return [4, Promise.all([
                            server_1.appPN.methods.balanceProofMap(channelID, channel.user).call()
                        ])];
                    case 8:
                        _c = (_d.sent())[0], balance_2 = _c.balance, nonce_2 = _c.nonce, additionalHash = _c.additionalHash, partnerSignature = _c.signature, consignorSignature = _c.consignorSignature;
                        if (!(Number(nonce_2) === 0)) return [3, 9];
                        mylog_1.logger.debug("no transfer data, will not submit proof");
                        return [3, 12];
                    case 9:
                        mylog_1.logger.debug("provider close the channel, will submit user's proof");
                        mylog_1.logger.debug("proof data: channelID: [%s], balance: [%s], nonce: [%s], additionalHash: [%s], partnerSignature: [%s], consignorSignature: [%s]", channelID, balance_2, nonce_2, additionalHash, partnerSignature, consignorSignature);
                        if (!(consignorSignature == null || consignorSignature == "")) return [3, 10];
                        mylog_1.logger.debug("no user proof signature, will not submit proof");
                        return [3, 12];
                    case 10:
                        data = server_1.ethPN.methods
                            .partnerUpdateProof(channelID, balance_2, nonce_2, additionalHash, partnerSignature, consignorSignature)
                            .encodeABI();
                        return [4, common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data, server_1.cpProvider.privateKey)];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12:
                        settle = channel.settleBlock;
                        _d.label = 13;
                    case 13:
                        if (!true) return [3, 18];
                        return [4, server_1.web3.eth.getBlockNumber()];
                    case 14:
                        current_1 = _d.sent();
                        if (!(current_1 >= settle)) return [3, 16];
                        mylog_1.logger.debug("settle time is up, channelID: ", channelID);
                        settleData = server_1.ethPN.methods.settleChannel(channelID).encodeABI();
                        return [4, common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, settleData, server_1.cpProvider.privateKey)];
                    case 15:
                        hash = _d.sent();
                        mylog_1.logger.debug("Settle Channel HASH:", hash);
                        return [3, 18];
                    case 16: return [4, common_1.Common.Sleep(15000)];
                    case 17:
                        _d.sent();
                        mylog_1.logger.debug("settle count down. current:", current_1, "target:", settle);
                        return [3, 13];
                    case 18: return [2];
                }
            });
        }); }
    },
    CooperativeSettled: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle ETH CooperativeSettled--------------------");
                return [2];
            });
        }); }
    },
    ChannelSettled: {
        filter: function () {
            return {};
        },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mylog_1.logger.debug("--------------------Handle ETH ChannelSettled--------------------");
                return [2];
            });
        }); }
    }
};
//# sourceMappingURL=eth_events.js.map