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
var Web3 = require('web3');
var web3_eth_contract_1 = require("web3/node_modules/web3-eth-contract");
var cita_sdk_1 = require("@cryptape/cita-sdk");
var contract_1 = require("../conf/contract");
var config_dev_1 = require("../conf/config.dev");
var listener_1 = require("../listener/listener");
var eth_events_1 = require("../listener/eth_events");
var cita_events_1 = require("../listener/cita_events");
var common_1 = require("./common");
var sign_1 = require("./sign");
var session_1 = require("./session");
var SDK = (function () {
    function SDK() {
    }
    SDK.GetInstance = function () {
        if (this.instance === undefined) {
            this.instance = new SDK();
        }
        return this.instance;
    };
    SDK.prototype.Init = function (cpPrivateKey, ethProvider, ethPaymentNetwork, appRpcUrl, appPaymentNetwork) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exports.web3 = new Web3(Web3.givenProvider || ethProvider);
                        exports.CITA = cita_sdk_1.default(appRpcUrl);
                        exports.ethPN = new web3_eth_contract_1.Contract(ethProvider, common_1.Common.Abi2JsonInterface(ethPaymentNetwork.abi), ethPaymentNetwork.address);
                        exports.appPN = new exports.CITA.base.Contract(common_1.Common.Abi2JsonInterface(appPaymentNetwork.abi), appPaymentNetwork.address);
                        exports.ethPN.options.address = ethPaymentNetwork.address;
                        exports.appPN.options.address = appPaymentNetwork.address;
                        contract_1.TYPED_DATA.domain.verifyingContract = ethPaymentNetwork.address;
                        exports.ERC20 = new web3_eth_contract_1.Contract(ethProvider, common_1.Common.Abi2JsonInterface(contract_1.ERC20ABI));
                        exports.sessionPN = new exports.CITA.base.Contract(common_1.Common.Abi2JsonInterface(config_dev_1.sessionPayNetwork.abi), config_dev_1.sessionPayNetwork.address);
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
    SDK.prototype.Deposit = function (amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var amountBN, data, hash, erc20Data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountBN = exports.web3.utils.toBN(amount).toString();
                        data = exports.ethPN.methods.providerDeposit(token, amountBN).encodeABI();
                        hash = {};
                        if (!(token !== contract_1.ADDRESS_ZERO)) return [3, 3];
                        erc20Data = exports.ERC20.methods.approve(exports.ethPN.options.address, amountBN).encodeABI();
                        return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, erc20Data)];
                    case 1:
                        _a.sent();
                        return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, data)];
                    case 2:
                        hash = _a.sent();
                        return [3, 5];
                    case 3: return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, amountBN, data)];
                    case 4:
                        hash = _a.sent();
                        _a.label = 5;
                    case 5: return [2, hash];
                }
            });
        });
    };
    SDK.prototype.Withdraw = function (amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var amountBN, _a, providerOnchainBalance, providerBalance, onChainBalanceBN, balanceBN, balance, tx, lastCommitBlock, rs, receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        amountBN = exports.web3.utils.toBN(amount);
                        return [4, Promise.all([exports.appPN.methods.paymentNetworkMap(token).call()])];
                    case 1:
                        _a = (_b.sent())[0], providerOnchainBalance = _a.providerOnchainBalance, providerBalance = _a.providerBalance;
                        onChainBalanceBN = exports.web3.utils.toBN(providerOnchainBalance);
                        balanceBN = exports.web3.utils.toBN(providerBalance);
                        if (amountBN.gt(onChainBalanceBN)) {
                            return [2, false];
                        }
                        balance = exports.web3.utils.toBN(providerOnchainBalance).sub(exports.web3.utils.toBN(amount));
                        if (balance.gt(balanceBN)) {
                            return [2, false];
                        }
                        return [4, common_1.Common.BuildAppChainTX()];
                    case 2:
                        tx = _b.sent();
                        return [4, common_1.Common.GetLastCommitBlock()];
                    case 3:
                        lastCommitBlock = _b.sent();
                        return [4, exports.appPN.methods.providerProposeWithdraw(token, balance.toString(), lastCommitBlock).send(tx)];
                    case 4:
                        rs = _b.sent();
                        if (!rs.hash) return [3, 6];
                        return [4, exports.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 5:
                        receipt = _b.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, 'confirm success'];
                        }
                        else {
                            return [2, 'confirm fail'];
                        }
                        return [3, 7];
                    case 6: return [2, 'send CITA tx fail'];
                    case 7: return [2];
                }
            });
        });
    };
    SDK.prototype.Rebalance = function (userAddress, amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID, channel, amountBN, providerBalance, providerBalanceBN, _a, balance, nonce, balanceBN, reBalanceAmountBN, messageHash, signature, tx, rs, receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, exports.ethPN.methods.getChannelID(userAddress, token).call()];
                    case 1:
                        channelID = _b.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _b.sent();
                        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("channel status is not open");
                        }
                        amountBN = exports.web3.utils.toBN(amount);
                        return [4, Promise.all([exports.appPN.methods.paymentNetworkMap(token).call()])];
                    case 3:
                        providerBalance = (_b.sent())[0].providerBalance;
                        providerBalanceBN = exports.web3.utils.toBN(providerBalance);
                        return [4, Promise.all([exports.appPN.methods.rebalanceProofMap(channelID).call()])];
                    case 4:
                        _a = (_b.sent())[0], balance = _a.amount, nonce = _a.nonce;
                        balanceBN = exports.web3.utils.toBN(balance);
                        if (amountBN.sub(balanceBN).gt(providerBalanceBN)) {
                            return [2, false];
                        }
                        reBalanceAmountBN = balanceBN.add(amountBN).toString();
                        nonce = exports.web3.utils.toBN(nonce).add(exports.web3.utils.toBN(1)).toString();
                        messageHash = exports.web3.utils.soliditySha3({ v: exports.ethPN.options.address, t: 'address' }, { v: channelID, t: 'bytes32' }, { v: reBalanceAmountBN, t: 'uint256' }, { v: nonce, t: 'uint256' });
                        signature = common_1.Common.SignatureToHex(messageHash);
                        return [4, common_1.Common.BuildAppChainTX()];
                    case 5:
                        tx = _b.sent();
                        return [4, exports.appPN.methods.proposeRebalance(channelID, reBalanceAmountBN, nonce, signature).send(tx)];
                    case 6:
                        rs = _b.sent();
                        if (!rs.hash) return [3, 8];
                        return [4, exports.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 7:
                        receipt = _b.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, 'confirm success'];
                        }
                        else {
                            console.log('confirm fail', receipt.errorMessage);
                            return [2, 'confirm fail'];
                        }
                        return [3, 9];
                    case 8:
                        console.log('send CITA tx fail');
                        return [2, 'send CITA tx fail'];
                    case 9: return [2];
                }
            });
        });
    };
    SDK.prototype.KickUser = function (userAddress, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID, channel, _a, _b, balance, nonce, additionalHash, partnerSignature, _c, inAmount, inNonce, regulatorSignature, inProviderSignature, data, hash;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, exports.ethPN.methods.getChannelID(userAddress, token).call()];
                    case 1:
                        channelID = _d.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _d.sent();
                        console.log("channel", channel);
                        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("channel status is not open");
                        }
                        return [4, Promise.all([
                                exports.appPN.methods.balanceProofMap(channelID, exports.cpProvider.address).call(),
                                exports.appPN.methods.rebalanceProofMap(channelID).call()
                            ])];
                    case 3:
                        _a = _d.sent(), _b = _a[0], balance = _b.balance, nonce = _b.nonce, additionalHash = _b.additionalHash, partnerSignature = _b.partnerSignature, _c = _a[1], inAmount = _c.inAmount, inNonce = _c.inNonce, regulatorSignature = _c.regulatorSignature, inProviderSignature = _c.inProviderSignature;
                        return [4, exports.ethPN.methods.closeChannel(channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, inProviderSignature).encodeABI()];
                    case 4:
                        data = _d.sent();
                        return [4, common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, data)];
                    case 5:
                        hash = _d.sent();
                        console.log(hash);
                        return [2];
                }
            });
        });
    };
    SDK.prototype.Transfer = function (to, amount, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID, channel, tx, amountBN, _a, balance, nonce, additionalHash, balanceBN, assetAmountBN, messageHash, signature, rs, receipt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, exports.ethPN.methods.getChannelID(to, token).call()];
                    case 1:
                        channelID = _b.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2:
                        channel = _b.sent();
                        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("channel status is not open");
                        }
                        return [4, common_1.Common.BuildAppChainTX()];
                    case 3:
                        tx = _b.sent();
                        amountBN = exports.web3.utils.toBN(amount);
                        return [4, Promise.all([
                                exports.appPN.methods.balanceProofMap(channelID, to).call()
                            ])];
                    case 4:
                        _a = (_b.sent())[0], balance = _a.balance, nonce = _a.nonce, additionalHash = _a.additionalHash;
                        balanceBN = exports.web3.utils.toBN(balance);
                        assetAmountBN = amountBN.add(balanceBN).toString();
                        nonce = exports.web3.utils.toBN(nonce).add(exports.web3.utils.toBN(1)).toString();
                        additionalHash = '0x0';
                        messageHash = sign_1.signHash({
                            channelID: channelID,
                            balance: assetAmountBN,
                            nonce: nonce,
                            additionalHash: additionalHash
                        });
                        signature = common_1.Common.SignatureToHex(messageHash);
                        return [4, exports.appPN.methods.transfer(to, channelID, assetAmountBN, nonce, additionalHash, signature).send(tx)];
                    case 5:
                        rs = _b.sent();
                        if (!rs.hash) return [3, 7];
                        return [4, exports.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 6:
                        receipt = _b.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success", receipt);
                            return [2, 'confirm success'];
                        }
                        else {
                            console.log("confirm fail", receipt.errorMessage);
                            return [2, 'confirm fail'];
                        }
                        return [3, 8];
                    case 7: return [2, 'send CITA tx fail'];
                    case 8: return [2];
                }
            });
        });
    };
    SDK.prototype.StartSession = function (sessionID, game, customData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, session_1.Session.isExists(sessionID)];
                    case 1:
                        if (!_a.sent()) return [3, 2];
                        return [2, false];
                    case 2: return [4, session_1.Session.InitSession(sessionID, game, customData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    SDK.prototype.GetSession = function (sessionID) {
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
    SDK.prototype.SendMessage = function (sessionID, to, type, content, amount, token) {
        if (amount === void 0) { amount = "0"; }
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var from, messageHash, signature, channelID, balance, nonce, additionalHash, paymentSignature, channel, balanceProof, messageHash2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, session_1.Session.isExists(sessionID)];
                    case 1:
                        if (!_a.sent()) return [3, 6];
                        from = exports.cpProvider.address;
                        messageHash = exports.web3.utils.soliditySha3({ t: "address", v: from }, { t: "address", v: to }, { t: "bytes32", v: sessionID }, { t: "string", v: type }, { t: "bytes", v: content });
                        signature = common_1.Common.SignatureToHex(messageHash);
                        channelID = "0x0";
                        balance = "0";
                        nonce = "0";
                        additionalHash = "0x0";
                        paymentSignature = "0x0";
                        if (!(Number(amount) > 0)) return [3, 5];
                        return [4, exports.ethPN.methods.getChannelID(to, token).call()];
                    case 2:
                        channelID = _a.sent();
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 3:
                        channel = _a.sent();
                        if (Number(channel.status) !== contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                            throw new Error("app channel status is not open, can not transfer now");
                        }
                        if (exports.web3.utils.toBN(channel.providerBalance).lt(exports.web3.utils.toBN(amount))) {
                            throw new Error("provider's balance is less than transfer amount");
                        }
                        return [4, exports.appPN.methods
                                .balanceProofMap(channelID, to)
                                .call()];
                    case 4:
                        balanceProof = _a.sent();
                        balance = exports.web3.utils.toBN(amount).add(exports.web3.utils.toBN(balanceProof.balance)).toString();
                        nonce = exports.web3.utils.toBN(balanceProof.nonce).add(exports.web3.utils.toBN(1)).toString();
                        additionalHash = messageHash;
                        messageHash2 = sign_1.signHash({
                            channelID: channelID,
                            balance: balance,
                            nonce: nonce,
                            additionalHash: additionalHash
                        });
                        paymentSignature = common_1.Common.SignatureToHex(messageHash2);
                        _a.label = 5;
                    case 5: return [2, session_1.Session.SendSessionMessage(exports.cpProvider.address, to, {
                            sessionID: sessionID,
                            mType: type,
                            content: content,
                            signature: signature
                        }, {
                            channelID: channelID,
                            balance: balance,
                            nonce: nonce,
                            additionalHash: additionalHash,
                            paymentSignature: paymentSignature
                        })];
                    case 6: throw new Error('Session is not open');
                }
            });
        });
    };
    SDK.prototype.CloseSession = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, session_1.Session.isExists(sessionID)];
                    case 1:
                        if (!_a.sent()) return [3, 3];
                        return [4, session_1.Session.CloseSession(sessionID)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    SDK.prototype.on = function (event, callback) {
        exports.callbacks.set(event, callback);
    };
    SDK.prototype.GetPaymentNetwork = function (token) {
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
                                providerOnChainBalance: providerOnchainBalance,
                            }];
                }
            });
        });
    };
    SDK.prototype.GetChannelInfo = function (userAddress, token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var channelID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.ethPN.methods.getChannelID(userAddress, token).call()];
                    case 1:
                        channelID = _a.sent();
                        if (!channelID) {
                            return [2, {
                                    channel: {}
                                }];
                        }
                        return [4, exports.appPN.methods.channelMap(channelID).call()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.GetAllTXs = function (token) {
        if (token === void 0) { token = contract_1.ADDRESS_ZERO; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, inTXs, outTXs, cmpNonce, lastBalance, getTX;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, Promise.all([
                            exports.appPN.getPastEvents('Transfer', { filter: { to: exports.cpProvider.address } }),
                            exports.appPN.getPastEvents('Transfer', { filter: { from: exports.cpProvider.address } })
                        ])];
                    case 1:
                        _a = _b.sent(), inTXs = _a[0], outTXs = _a[1];
                        cmpNonce = function (key) {
                            return function (a, b) { return a[key] - b[key]; };
                        };
                        lastBalance = exports.web3.utils.toBN(0);
                        getTX = function (tx) {
                            var _a = tx.returnValues, balance = _a.balance, rest = __rest(_a, ["balance"]);
                            balance = exports.web3.utils.toBN(balance);
                            var amount = balance.sub(lastBalance).toString();
                            lastBalance = balance;
                            return __assign({ id: tx.transactionHash, amount: amount }, rest);
                        };
                        inTXs = inTXs.sort(cmpNonce('nonce')).map(function (tx) { return getTX(tx); });
                        outTXs = outTXs.sort(cmpNonce('nonce')).map(function (tx) { return getTX(tx); });
                        return [2, { in: inTXs, out: outTXs }];
                }
            });
        });
    };
    SDK.prototype.GetMessagesBySessionID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.sessionPN.methods.messages(sessionID).call()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.GetPlayersBySessionID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, exports.sessionPN.methods.exportPlayer(sessionID).call()];
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
                this.ethWatcher = new listener_1.default(exports.web3.eth, 5000, ethWatchList);
                this.ethWatcher.start();
                this.appWatcher && this.appWatcher.stop();
                appWatchList = [
                    { contract: exports.appPN, listener: cita_events_1.CITA_EVENTS },
                    { contract: exports.sessionPN, listener: session_events_1.SESSION_EVENTS }
                ];
                this.appWatcher = new listener_1.default(exports.CITA.base, 1000, appWatchList);
                this.appWatcher.start();
                return [2];
            });
        });
    };
    return SDK;
}());
exports.SDK = SDK;
//# sourceMappingURL=server.js.map