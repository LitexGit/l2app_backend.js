"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var session_events_1 = require("../listener/session_events");
var Web3 = require("web3");
var web3_eth_contract_1 = require("web3/node_modules/web3-eth-contract");
var cita_sdk_1 = require("@cryptape/cita-sdk");
var contract_1 = require("../conf/contract");
var listener_1 = require("../listener/listener");
var eth_events_1 = require("../listener/eth_events");
var cita_events_1 = require("../listener/cita_events");
var common_1 = require("./common");
var sign_1 = require("./sign");
var session_1 = require("./session");
var protobuf = require("protobufjs");
protobuf.common("google/protobuf/descriptor.proto", {});
var SDK = (function () {
    function SDK() {
    }
    SDK.GetInstance = function () {
        if (this.instance === undefined) {
            this.instance = new SDK();
        }
        return this.instance;
    };
    SDK.prototype.init = function (cpPrivateKey, ethRpcUrl, ethPaymentNetwork, appRpcUrl, appPaymentNetwork, sessionPayNetwork) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("L2 server sdk init start with params: ethRpcUrl: [%s], ethPaymentNetwork: [%o], appRpcUrl: [%s], appPaymentNetwork: [%o]", ethRpcUrl, ethPaymentNetwork.address, appRpcUrl, appPaymentNetwork.address);
                        exports.web3 = new Web3(Web3.givenProvider || ethRpcUrl);
                        this.appRpcUrl = appRpcUrl;
                        this.ethRpcUrl = ethRpcUrl;
                        exports.CITA = cita_sdk_1.default(appRpcUrl);
                        exports.ethPN = new web3_eth_contract_1.Contract(exports.web3.currentProvider, common_1.Common.Abi2JsonInterface(ethPaymentNetwork.abi), ethPaymentNetwork.address);
                        exports.appPN = new exports.CITA.base.Contract(common_1.Common.Abi2JsonInterface(appPaymentNetwork.abi), appPaymentNetwork.address);
                        exports.ethPN.options.address = ethPaymentNetwork.address;
                        exports.appPN.options.address = appPaymentNetwork.address;
                        contract_1.TYPED_DATA.domain.verifyingContract = ethPaymentNetwork.address;
                        exports.ERC20 = new web3_eth_contract_1.Contract(exports.web3.currentProvider, common_1.Common.Abi2JsonInterface(contract_1.ERC20ABI));
                        exports.sessionPN = new exports.CITA.base.Contract(common_1.Common.Abi2JsonInterface(sessionPayNetwork.abi), sessionPayNetwork.address);
                        exports.cpProvider = exports.CITA.base.accounts.privateKeyToAccount(cpPrivateKey);
                        exports.callbacks = new Map();
                        if (!exports.cpProvider.address) return [3, 2];
                        return [4, this.initListeners()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    SDK.prototype.deposit = function (amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var amountBN, data, erc20Data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!exports.web3.utils.isAddress(token)) {
                            throw new Error("token [" + token + "] is not a valid address");
                        }
                        console.log("start deposit with params: amount: [%s], token: [%s]", amount, token);
                        amountBN = exports.web3.utils.toBN(amount).toString();
                        data = exports.ethPN.methods.providerDeposit(token, amountBN).encodeABI();
                        if (!(token !== contract_1.ADDRESS_ZERO)) return [3, 3];
                        erc20Data = exports.ERC20.methods
                            .approve(exports.ethPN.options.address, amountBN)
                            .encodeABI();
                        return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, token, 0, erc20Data, exports.cpProvider.privateKey)];
                    case 1:
                        _a.sent();
                        return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, data, exports.cpProvider.privateKey)];
                    case 2: return [2, _a.sent()];
                    case 3: return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, amountBN, data, exports.cpProvider.privateKey)];
                    case 4: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.withdraw = function (amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var amountBN, _a, _b, providerOnchainBalance, providerBalance, ethProviderBalance, onChainBalanceBN, balanceBN, balance, lastCommitBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!exports.web3.utils.isAddress(token)) {
                            throw new Error("token [" + token + "] is not a valid address");
                        }
                        console.log("start withdraw with params: amount: [%s], token: [%s]", amount, token);
                        amountBN = exports.web3.utils.toBN(amount);
                        return [4, Promise.all([
                                exports.appPN.methods.paymentNetworkMap(token).call(),
                                exports.ethPN.methods.providerBalance(token).call()
                            ])];
                    case 1:
                        _a = _c.sent(), _b = _a[0], providerOnchainBalance = _b.providerOnchainBalance, providerBalance = _b.providerBalance, ethProviderBalance = _a[1];
                        console.log("providerOnchainBalance:[%s], providerBalance:[%s], ethProviderBalance:[%s]", providerOnchainBalance, providerBalance, ethProviderBalance);
                        onChainBalanceBN = exports.web3.utils.toBN(providerOnchainBalance);
                        balanceBN = exports.web3.utils.toBN(providerBalance);
                        if (amountBN.gt(onChainBalanceBN)) {
                            throw new Error("withdraw amount[" + amountBN.toString() + "] great than onchain balance[" + onChainBalanceBN.toString() + "]");
                        }
                        balance = exports.web3.utils
                            .toBN(providerOnchainBalance)
                            .sub(exports.web3.utils.toBN(amount));
                        return [4, common_1.Common.GetLastCommitBlock()];
                    case 2:
                        lastCommitBlock = _c.sent();
                        return [4, common_1.Common.SendAppChainTX(exports.appPN.methods.providerProposeWithdraw(token, balance.toString(), lastCommitBlock), exports.cpProvider.address, exports.cpProvider.privateKey)];
                    case 3: return [2, _c.sent()];
                }
            });
        });
    };
    SDK.prototype.rebalance = function (userAddress, amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID, channel, amountBN, providerBalance, providerBalanceBN, _a, balance, nonce, balanceBN, reBalanceAmountBN, messageHash, signature;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!exports.web3.utils.isAddress(userAddress)) {
                            throw new Error("userAddress [" + userAddress + "] is not a valid address");
                        }
                        if (!exports.web3.utils.isAddress(token)) {
                            throw new Error("token [" + token + "] is not a valid address");
                        }
                        console.log("start reblance with params: userAddress: [%s], amount: [%s], token: [%s]", userAddress, amount, token);
                        return [4, exports.ethPN.methods.getChannelID(userAddress, token).call()];
                    case 1:
                        channelID = _b.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _b.sent();
                        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("channel status is not open");
                        }
                        amountBN = exports.web3.utils.toBN(amount);
                        return [4, Promise.all([
                                exports.appPN.methods.paymentNetworkMap(token).call()
                            ])];
                    case 3:
                        providerBalance = (_b.sent())[0].providerBalance;
                        providerBalanceBN = exports.web3.utils.toBN(providerBalance);
                        return [4, Promise.all([
                                exports.appPN.methods.rebalanceProofMap(channelID).call()
                            ])];
                    case 4:
                        _a = (_b.sent())[0], balance = _a.amount, nonce = _a.nonce;
                        balanceBN = exports.web3.utils.toBN(balance);
                        if (amountBN.sub(balanceBN).gt(providerBalanceBN)) {
                            return [2, false];
                        }
                        reBalanceAmountBN = balanceBN.add(amountBN).toString();
                        nonce = exports.web3.utils
                            .toBN(nonce)
                            .add(exports.web3.utils.toBN(1))
                            .toString();
                        messageHash = exports.web3.utils.soliditySha3({ v: exports.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: reBalanceAmountBN, t: "uint256" }, { v: nonce, t: "uint256" });
                        signature = common_1.Common.SignatureToHex(messageHash, exports.cpProvider.privateKey);
                        return [4, common_1.Common.SendAppChainTX(exports.appPN.methods.proposeRebalance(channelID, reBalanceAmountBN, nonce, signature), exports.cpProvider.address, exports.cpProvider.privateKey)];
                    case 5: return [2, _b.sent()];
                }
            });
        });
    };
    SDK.prototype.kickUser = function (userAddress, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID, channel, _a, _b, balance, nonce, additionalHash, partnerSignature, _c, inAmount, inNonce, regulatorSignature, providerSignature, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!exports.web3.utils.isAddress(userAddress)) {
                            throw new Error("userAddress [" + userAddress + "] is not a valid address");
                        }
                        if (!exports.web3.utils.isAddress(token)) {
                            throw new Error("token [" + token + "] is not a valid address");
                        }
                        console.log("start kickuser with params: userAddress: [%s], token: [%s]", userAddress, token);
                        return [4, exports.ethPN.methods.getChannelID(userAddress, token).call()];
                    case 1:
                        channelID = _d.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _d.sent();
                        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("channel status is not open");
                        }
                        return [4, Promise.all([
                                exports.appPN.methods.balanceProofMap(channelID, exports.cpProvider.address).call(),
                                exports.appPN.methods.rebalanceProofMap(channelID).call()
                            ])];
                    case 3:
                        _a = _d.sent(), _b = _a[0], balance = _b.balance, nonce = _b.nonce, additionalHash = _b.additionalHash, partnerSignature = _b.partnerSignature, _c = _a[1], inAmount = _c.amount, inNonce = _c.nonce, regulatorSignature = _c.regulatorSignature, providerSignature = _c.providerSignature;
                        partnerSignature = partnerSignature || "0x0";
                        regulatorSignature = regulatorSignature || "0x0";
                        providerSignature = providerSignature || "0x0";
                        console.log("closeChannel params:  channelID:[%s], balance:[%s], nonce:[%s], additionalHash:[%s], partnerSignature:[%s], inAmount:[%s], inNonce:[%s], regulatorSignature:[%s], inProviderSignature:[%s]", channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, providerSignature);
                        return [4, exports.ethPN.methods
                                .closeChannel(channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, providerSignature)
                                .encodeABI()];
                    case 4:
                        data = _d.sent();
                        return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, data, exports.cpProvider.privateKey)];
                    case 5: return [2, _d.sent()];
                }
            });
        });
    };
    SDK.prototype.transfer = function (to, amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var toBN, channelID, channel, amountBN, _a, balance, nonce, additionalHash, balanceBN, assetAmountBN, messageHash, signature;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!exports.web3.utils.isAddress(to)) {
                            throw new Error("to [" + to + "] is not a valid address");
                        }
                        if (!exports.web3.utils.isAddress(token)) {
                            throw new Error("token [" + token + "] is not a valid address");
                        }
                        console.log("Transfer start execute with params: to: [%s], amount: [%s], token: [%s]", to, amount, token);
                        toBN = exports.web3.utils.toBN;
                        return [4, exports.ethPN.methods.getChannelID(to, token).call()];
                    case 1:
                        channelID = _b.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _b.sent();
                        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("channel status is not open");
                        }
                        amountBN = toBN(amount);
                        return [4, Promise.all([
                                exports.appPN.methods.balanceProofMap(channelID, to).call()
                            ])];
                    case 3:
                        _a = (_b.sent())[0], balance = _a.balance, nonce = _a.nonce, additionalHash = _a.additionalHash;
                        balanceBN = toBN(balance);
                        assetAmountBN = amountBN.add(balanceBN).toString();
                        nonce = toBN(nonce)
                            .add(toBN(1))
                            .toString();
                        additionalHash = "0x0";
                        messageHash = sign_1.signHash({
                            channelID: channelID,
                            balance: assetAmountBN,
                            nonce: nonce,
                            additionalHash: additionalHash
                        });
                        signature = common_1.Common.SignatureToHex(messageHash, exports.cpProvider.privateKey);
                        return [4, common_1.Common.SendAppChainTX(exports.appPN.methods.transfer(to, channelID, assetAmountBN, nonce, additionalHash, signature), exports.cpProvider.address, exports.cpProvider.privateKey)];
                    case 4: return [2, _b.sent()];
                }
            });
        });
    };
    SDK.prototype.startSession = function (sessionID, game, userList, customData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("start session with params: sessionID: [%s], game: [%s], userList: [%o], customData: [%s]", sessionID, game, userList, customData);
                        return [4, session_1.Session.isExists(sessionID)];
                    case 1:
                        if (!_a.sent()) return [3, 2];
                        throw new Error("session is already exist, can not start again");
                    case 2: return [4, session_1.Session.InitSession(sessionID, game, userList, customData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    SDK.prototype.joinSession = function (sessionID, user) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!exports.web3.utils.isAddress(user)) {
                            throw new Error("user[" + user + "] is not valid address");
                        }
                        return [4, session_1.Session.GetSession(sessionID)];
                    case 1:
                        session = _a.sent();
                        if (Number(session.status) !== contract_1.SESSION_STATUS.SESSION_STATUS_OPEN) {
                            throw new Error("session is not open now. status = [" + session.status + "]");
                        }
                        return [4, session_1.Session.JoinSession(sessionID, user)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getSession = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var count_down, session, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count_down = 10;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < count_down)) return [3, 5];
                        return [4, session_1.Session.GetSession(sessionID)];
                    case 2:
                        session = _a.sent();
                        if (session) {
                            return [3, 5];
                        }
                        return [4, common_1.Common.Sleep(1000)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 1];
                    case 5:
                        if (!session) {
                            throw new Error("session not found");
                        }
                        return [2, session];
                }
            });
        });
    };
    SDK.prototype.sendMessage = function (sessionID, to, type, content, amount, token) {
        if (amount === void 0) { amount = "0"; }
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var from, messageHash, signature, transferData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("start sendmessage with params: sessionID: [%s], to: [%s], type: [%s], content: [%s], amount: [%s], token: [%s]", sessionID, to, type, content, amount, token);
                        return [4, session_1.Session.isExists(sessionID)];
                    case 1:
                        if (!_a.sent()) return [3, 3];
                        from = exports.cpProvider.address;
                        messageHash = exports.web3.utils.soliditySha3({ t: "address", v: from }, { t: "address", v: to }, { t: "bytes32", v: sessionID }, { t: "uint8", v: type }, { t: "bytes", v: content });
                        signature = common_1.Common.SignatureToHex(messageHash, exports.cpProvider.privateKey);
                        return [4, this.buildTransferData(to, amount, token, messageHash)];
                    case 2:
                        transferData = _a.sent();
                        return [2, session_1.Session.SendSessionMessage(exports.cpProvider.address, to, {
                                sessionID: sessionID,
                                mType: type,
                                content: content,
                                signature: signature
                            }, transferData)];
                    case 3: throw new Error("Session is not open");
                }
            });
        });
    };
    SDK.prototype.closeSession = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("start CloseSession, params: sessionID: [%s]", sessionID);
                        return [4, session_1.Session.isExists(sessionID)];
                    case 1:
                        if (!_a.sent()) return [3, 3];
                        return [4, session_1.Session.CloseSession(sessionID)];
                    case 2: return [2, _a.sent()];
                    case 3: throw new Error("session is not exist now");
                }
            });
        });
    };
    SDK.prototype.on = function (event, callback) {
        exports.callbacks.set(event, callback);
    };
    SDK.prototype.getPaymentNetwork = function (token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, userCount, userTotalDeposit, userTotalWithdraw, providerDeposit, providerWithdraw, providerBalance, providerOnchainBalance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, Promise.all([exports.appPN.methods.paymentNetworkMap(token).call()])];
                    case 1:
                        _a = (_b.sent())[0], userCount = _a.userCount, userTotalDeposit = _a.userTotalDeposit, userTotalWithdraw = _a.userTotalWithdraw, providerDeposit = _a.providerDeposit, providerWithdraw = _a.providerWithdraw, providerBalance = _a.providerBalance, providerOnchainBalance = _a.providerOnchainBalance;
                        return [2, {
                                userCount: userCount,
                                userTotalDeposit: userTotalDeposit,
                                userTotalWithdraw: userTotalWithdraw,
                                providerDeposit: providerDeposit,
                                providerWithdraw: providerWithdraw,
                                providerBalance: providerBalance,
                                providerOnChainBalance: providerOnchainBalance
                            }];
                }
            });
        });
    };
    SDK.prototype.getTokeFeeRate = function (token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var feeRate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.appPN.methods.feeRateMap(token).call()];
                    case 1:
                        feeRate = _a.sent();
                        return [2, Number(feeRate) / 10000];
                }
            });
        });
    };
    SDK.prototype.getChannelInfo = function (userAddress, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.ethPN.methods.getChannelID(userAddress, token).call()];
                    case 1:
                        channelID = _a.sent();
                        if (!channelID) {
                            return [2, {
                                    channel: { channelID: channelID }
                                }];
                        }
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _a.sent();
                        channel.channelID = channelID;
                        return [2, channel];
                }
            });
        });
    };
    SDK.prototype.getAllTXs = function (token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, inTXs, outTXs, cmpNonce, lastBalance, getTX;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, Promise.all([
                            exports.appPN.getPastEvents("Transfer", { filter: { to: exports.cpProvider.address } }),
                            exports.appPN.getPastEvents("Transfer", { filter: { from: exports.cpProvider.address } })
                        ])];
                    case 1:
                        _a = _b.sent(), inTXs = _a[0], outTXs = _a[1];
                        cmpNonce = function (key) {
                            return function (a, b) {
                                return a[key] - b[key];
                            };
                        };
                        lastBalance = exports.web3.utils.toBN(0);
                        getTX = function (tx) {
                            var _a = tx.returnValues, balance = _a.balance, rest = __rest(_a, ["balance"]);
                            balance = exports.web3.utils.toBN(balance);
                            var amount = balance.sub(lastBalance).toString();
                            lastBalance = balance;
                            return __assign({ id: tx.transactionHash, amount: amount }, rest);
                        };
                        inTXs = inTXs.sort(cmpNonce("nonce")).map(function (tx) { return getTX(tx); });
                        outTXs = outTXs.sort(cmpNonce("nonce")).map(function (tx) { return getTX(tx); });
                        return [2, { in: inTXs, out: outTXs }];
                }
            });
        });
    };
    SDK.prototype.getMessagesBySessionID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.sessionPN.methods.exportSession(sessionID).call()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getPlayersBySessionID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.sessionPN.methods.exportPlayer(sessionID).call()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.exportSessionBytes = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.sessionPN.methods.exportSessionBytes(sessionID).call()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.initListeners = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ethWatchList, appWatchList;
            return __generator(this, function (_a) {
                this.ethWatcher && this.ethWatcher.stop();
                ethWatchList = [{ contract: exports.ethPN, listener: eth_events_1.ETH_EVENTS }];
                this.ethWatcher = new listener_1.default(exports.web3.eth, this.ethRpcUrl, 5000, ethWatchList);
                this.ethWatcher.start();
                this.appWatcher && this.appWatcher.stop();
                appWatchList = [
                    { contract: exports.appPN, listener: cita_events_1.CITA_EVENTS },
                    { contract: exports.sessionPN, listener: session_events_1.SESSION_EVENTS }
                ];
                this.appWatcher = new listener_1.default(exports.CITA.base, this.appRpcUrl, 1000, appWatchList);
                this.appWatcher.start();
                return [2];
            });
        });
    };
    SDK.prototype.buildTransferData = function (user, amount, token, messageHash) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, hexToBytes, numberToHex, soliditySha3, toBN, channelID, balance, nonce, additionalHash, paymentSignature, channel, balanceProof, messageHash2, transferPB, Transfer, payload, errMsg, message, buffer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = exports.web3.utils, hexToBytes = _a.hexToBytes, numberToHex = _a.numberToHex, soliditySha3 = _a.soliditySha3, toBN = _a.toBN;
                        channelID = "0x0000000000000000000000000000000000000000000000000000000000000000";
                        balance = "0";
                        nonce = "0";
                        additionalHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
                        paymentSignature = "0x0";
                        if (!(Number(amount) > 0)) return [3, 4];
                        return [4, exports.ethPN.methods.getChannelID(user, token).call()];
                    case 1:
                        channelID = _b.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _b.sent();
                        if (Number(channel.status) !== contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("app channel status is not open, can not transfer now");
                        }
                        if (toBN(channel.providerBalance).lt(toBN(amount))) {
                            throw new Error("provider's balance is less than transfer amount");
                        }
                        return [4, exports.appPN.methods
                                .balanceProofMap(channelID, user)
                                .call()];
                    case 3:
                        balanceProof = _b.sent();
                        balance = toBN(amount)
                            .add(toBN(balanceProof.balance))
                            .toString();
                        nonce = toBN(balanceProof.nonce)
                            .add(toBN(1))
                            .toString();
                        additionalHash = soliditySha3({ t: "uint256", v: amount }, { t: "bytes32", v: messageHash });
                        messageHash2 = sign_1.signHash({
                            channelID: channelID,
                            balance: balance,
                            nonce: nonce,
                            additionalHash: additionalHash
                        });
                        paymentSignature = common_1.Common.SignatureToHex(messageHash2, exports.cpProvider.privateKey);
                        _b.label = 4;
                    case 4:
                        transferPB = protobuf.Root.fromJSON(require("../conf/transfer.json"));
                        Transfer = transferPB.lookupType("TransferData.Transfer");
                        payload = {
                            channelID: hexToBytes(channelID),
                            balance: hexToBytes(numberToHex(balance)),
                            nonce: hexToBytes(numberToHex(nonce)),
                            amount: hexToBytes(numberToHex(amount)),
                            additionalHash: hexToBytes(additionalHash)
                        };
                        errMsg = Transfer.verify(payload);
                        if (errMsg)
                            throw Error(errMsg);
                        message = Transfer.create(payload);
                        buffer = Transfer.encode(message).finish();
                        return [2, { transferData: buffer, paymentSignature: paymentSignature }];
                }
            });
        });
    };
    return SDK;
}());
exports.SDK = SDK;
//# sourceMappingURL=server.js.map