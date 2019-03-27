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
exports.CITA_EVENTS = {
    'Transfer': {
        filter: function () { return { to: server_1.cpProvider.address }; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, from, to, channelID, balance, transferAmount, additionalHash, channel, token, assetEvent, _b, feeProofAmount, road, feeRate, amount, bn, feeAmount, feeNonce, messageHash, signature, tx, rs, receipt;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("Transfer event", event);
                        _a = event.returnValues, from = _a.from, to = _a.to, channelID = _a.channelID, balance = _a.balance, transferAmount = _a.transferAmount, additionalHash = _a.additionalHash;
                        return [4, server_1.appPN.methods.channelMap(channelID).call()];
                    case 1:
                        channel = _c.sent();
                        token = channel.token;
                        console.log("channel", channel);
                        assetEvent = {
                            from: from,
                            to: to,
                            token: token,
                            amount: transferAmount,
                            additionalHash: additionalHash,
                            totalTransferredAmount: balance,
                        };
                        if (server_1.callbacks.get("Transfer") &&
                            additionalHash ===
                                "0x0000000000000000000000000000000000000000000000000000000000000000") {
                            server_1.callbacks.get("Transfer")(null, assetEvent);
                        }
                        return [4, server_1.appPN.methods.feeProofMap(token).call()];
                    case 2:
                        _b = _c.sent(), feeProofAmount = _b.amount, road = _b.nonce;
                        console.log("feeProofAmount", feeProofAmount);
                        return [4, server_1.appPN.methods.feeRateMap(token).call()];
                    case 3:
                        feeRate = _c.sent();
                        console.log("feeRate", feeRate);
                        if (Number(feeRate) === 0) {
                            return [2];
                        }
                        return [4, Promise.all([
                                server_1.appPN.methods.balanceProofMap(channelID, server_1.cpProvider.address).call()
                            ])];
                    case 4:
                        amount = (_c.sent())[0].balance;
                        console.log("provider balance", amount);
                        console.log("provider nonce", road);
                        console.log("event Balance", balance);
                        bn = server_1.web3.utils.toBN;
                        feeAmount = bn(feeProofAmount).add(bn(feeRate).mul((bn(balance).sub(bn(amount)))).div(bn(10000))).toString();
                        console.log("feeAmount = ", feeAmount);
                        feeNonce = Number(road) + 1;
                        messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: 'address' }, { v: token, t: 'address' }, { v: feeAmount, t: 'uint256' }, { v: feeNonce, t: 'uint256' });
                        signature = common_1.Common.SignatureToHex(messageHash);
                        return [4, common_1.Common.BuildAppChainTX()];
                    case 5:
                        tx = _c.sent();
                        console.log("infos", { channelID: channelID, token: token, feeAmount: feeAmount, feeNonce: feeNonce, signature: signature });
                        return [4, server_1.appPN.methods.submitFee(channelID, token, feeAmount, feeNonce, signature).send(tx)];
                    case 6:
                        rs = _c.sent();
                        if (!rs.hash) return [3, 8];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 7:
                        receipt = _c.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                        }
                        else {
                            console.log("send CITA tx fail", receipt.errorMessage);
                        }
                        return [3, 9];
                    case 8:
                        console.log("submit fail");
                        _c.label = 9;
                    case 9: return [2];
                }
            });
        }); }
    },
    'UserProposeWithdraw': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, lastCommitBlock, amount, messageHash, signature, tx, rs, receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("UserProposeWithdraw event", event);
                        _a = event.returnValues, channelID = _a.channelID, lastCommitBlock = _a.lastCommitBlock;
                        return [4, Promise.all([
                                server_1.appPN.methods.userWithdrawProofMap(channelID).call()
                            ])];
                    case 1:
                        amount = (_b.sent())[0].amount;
                        console.log("UserProposeWithdraw DEBUG INFO", { v: server_1.ethPN.options.address, t: 'address' }, { v: channelID, t: 'bytes32' }, { v: amount, t: 'uint256' }, { v: lastCommitBlock, t: 'uint256' });
                        messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: 'address' }, { v: channelID, t: 'bytes32' }, { v: amount, t: 'uint256' }, { v: lastCommitBlock, t: 'uint256' });
                        signature = common_1.Common.SignatureToHex(messageHash);
                        return [4, common_1.Common.BuildAppChainTX()];
                    case 2:
                        tx = _b.sent();
                        return [4, server_1.appPN.methods.confirmUserWithdraw(channelID, signature).send(tx)];
                    case 3:
                        rs = _b.sent();
                        if (!rs.hash) return [3, 5];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 4:
                        receipt = _b.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                        }
                        else {
                            console.log("send CITA tx fail", receipt.errorMessage);
                        }
                        return [3, 6];
                    case 5:
                        console.log("submit fail");
                        _b.label = 6;
                    case 6: return [2];
                }
            });
        }); }
    },
    'ProposeCooperativeSettle': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, channelID, balance, lastCommitBlock, messageHash, signature, tx, rs, receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("ProposeCooperativeSettle event", event);
                        _a = event.returnValues, channelID = _a.channelID, balance = _a.balance, lastCommitBlock = _a.lastCommitBlock;
                        messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: 'address' }, { v: channelID, t: 'bytes32' }, { v: balance, t: 'uint256' }, { v: lastCommitBlock, t: 'uint256' });
                        signature = common_1.Common.SignatureToHex(messageHash);
                        return [4, common_1.Common.BuildAppChainTX()];
                    case 1:
                        tx = _b.sent();
                        return [4, server_1.appPN.methods.confirmCooperativeSettle(channelID, signature).send(tx)];
                    case 2:
                        rs = _b.sent();
                        if (!rs.hash) return [3, 4];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 3:
                        receipt = _b.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                        }
                        else {
                            console.log("confirm fail, error message:", receipt.errorMessage);
                        }
                        return [3, 5];
                    case 4:
                        console.log("send CITA tx fail");
                        _b.label = 5;
                    case 5: return [2];
                }
            });
        }); }
    },
    'ConfirmProviderWithdraw': {
        filter: function () { return {}; },
        handler: function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, token, balance, lastCommitBlock, signature, data, hash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("confirmProviderWithdraw event", event);
                        _a = event.returnValues, token = _a.token, balance = _a.balance, lastCommitBlock = _a.lastCommitBlock;
                        return [4, Promise.all([
                                server_1.appPN.methods.providerWithdrawProofMap(event.returnValues.token).call()
                            ])];
                    case 1:
                        signature = (_b.sent())[0].signature;
                        return [4, server_1.ethPN.methods.providerWithdraw(token, balance, lastCommitBlock, signature).encodeABI()];
                    case 2:
                        data = _b.sent();
                        hash = common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data);
                        console.log(hash);
                        return [2];
                }
            });
        }); }
    },
};
//# sourceMappingURL=cita_events.js.map