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
Object.defineProperty(exports, "__esModule", { value: true });
var TX = require("ethereumjs-tx");
var ethUtil = require("ethereumjs-util");
var ethNonce = new Map();
function getEthNonce(address) {
    if (ethNonce.get(address) > 0) {
        return ethNonce.get(address);
    }
    else {
        return 0;
    }
}
var contract_1 = require("../conf/contract");
var server_1 = require("./server");
var Common = (function () {
    function Common() {
    }
    Common.Abi2JsonInterface = function (abi) {
        var abiItem = JSON.parse("{}");
        try {
            var abiArray = JSON.parse(abi);
            if (!Array.isArray(abiArray))
                return abiItem;
            return abiArray;
        }
        catch (e) {
            return abiItem;
        }
    };
    Common.GetLastCommitBlock = function (chain) {
        if (chain === void 0) { chain = "eth"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(chain === "eth")) return [3, 2];
                        return [4, server_1.web3.eth.getBlockNumber()];
                    case 1:
                        _a = (_b.sent()) + contract_1.COMMIT_BLOCK_CONDITION;
                        return [3, 4];
                    case 2: return [4, server_1.CITA.base.getBlockNumber()];
                    case 3:
                        _a = (_b.sent()) + 88;
                        _b.label = 4;
                    case 4: return [2, _a];
                }
            });
        });
    };
    Common.SendEthTransaction = function (from, to, value, data, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, rawTx, _a, _b, _c, tx, priKey, serializedTx, txData;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, server_1.web3.eth.getTransactionCount(from)];
                    case 1:
                        nonce = _d.sent();
                        if (nonce > getEthNonce(from)) {
                            ethNonce.set(from, nonce);
                        }
                        else {
                            nonce = getEthNonce(from) + 1;
                            ethNonce.set(from, nonce);
                        }
                        _a = {
                            from: from,
                            nonce: "0x" + nonce.toString(16)
                        };
                        return [4, server_1.web3.eth.net.getId()];
                    case 2:
                        _a.chainId = _d.sent(),
                            _a.to = to,
                            _a.data = data,
                            _a.value = server_1.web3.utils.toHex(value);
                        _c = (_b = server_1.web3.utils).toHex;
                        return [4, server_1.web3.eth.getGasPrice()];
                    case 3:
                        rawTx = (_a.gasPrice = _c.apply(_b, [_d.sent()]),
                            _a.gasLimit = server_1.web3.utils.toHex(300000),
                            _a);
                        tx = new TX(rawTx);
                        priKey = privateKey;
                        if (priKey.substr(0, 2) === "0x") {
                            tx.sign(Buffer.from(priKey.substr(2), "hex"));
                        }
                        else {
                            tx.sign(Buffer.from(priKey, "hex"));
                        }
                        serializedTx = tx.serialize();
                        txData = "0x" + serializedTx.toString("hex");
                        console.log("SEND TX", rawTx);
                        return [2, new Promise(function (resolve, reject) {
                                try {
                                    server_1.web3.eth
                                        .sendSignedTransaction(txData)
                                        .on("transactionHash", function (value) {
                                        console.log("transactionHash: ", value);
                                        resolve(value);
                                    })
                                        .on("error", function (error) {
                                        reject(error);
                                    });
                                }
                                catch (e) {
                                    reject(e);
                                }
                            })];
                }
            });
        });
    };
    Common.BuildAppChainTX = function (from, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tx = __assign({}, contract_1.TX_BASE, { privateKey: privateKey,
                            from: from });
                        _a = tx;
                        return [4, Common.GetLastCommitBlock("cita")];
                    case 1:
                        _a.validUntilBlock = _b.sent();
                        return [2, tx];
                }
            });
        });
    };
    Common.SendAppChainTX = function (action, from, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, rs, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.BuildAppChainTX(from, privateKey)];
                    case 1:
                        tx = _a.sent();
                        return [4, action.send(tx)];
                    case 2:
                        rs = _a.sent();
                        if (!rs.hash) return [3, 4];
                        return [4, server_1.CITA.listeners.listenToTransactionReceipt(rs.hash)];
                    case 3:
                        receipt = _a.sent();
                        if (!receipt.errorMessage) {
                            console.log("send CITA tx success");
                            return [2, rs.hash];
                        }
                        else {
                            throw new Error("confirm fail " + receipt.errorMessage);
                        }
                        return [3, 5];
                    case 4: throw new Error("send CITA tx fail");
                    case 5: return [2];
                }
            });
        });
    };
    Common.CheckSignature = function (messageHash, signature, address) {
        var messageHashBuffer = Buffer.from(messageHash.replace("0x", ""), "hex");
        var sigDecoded = ethUtil.fromRpcSig(Buffer.from(signature.replace("0x", ""), "hex"));
        var recoveredPub = ethUtil.ecrecover(messageHashBuffer, sigDecoded.v, sigDecoded.r, sigDecoded.s);
        var recoveredAddress = ethUtil.pubToAddress(recoveredPub).toString("hex");
        recoveredAddress = "0x" + recoveredAddress;
        return recoveredAddress.toLowerCase() == address.toLowerCase();
    };
    Common.SignatureToHex = function (messageHash, privateKey) {
        var messageHex = messageHash.substr(0, 2) == "0x" ? messageHash.substr(2) : messageHash;
        var privateKeyHex = privateKey.substr(0, 2) == "0x" ? privateKey.substr(2) : privateKey;
        var messageBuffer = Buffer.from(messageHex, "hex");
        var privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
        var signatureObj = ethUtil.ecsign(messageBuffer, privateKeyBuffer);
        return ethUtil
            .toRpcSig(signatureObj.v, signatureObj.r, signatureObj.s)
            .toString("hex");
    };
    Common.RandomWord = function (randomFlag, min, max) {
        if (max === void 0) { max = 12; }
        var str = "", range = min, arr = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z"
        ];
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        var pos;
        for (var i = 0; i < range; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    };
    Common.GenerateSessionID = function (game) {
        var timestamp = new Date().getTime();
        var random = this.RandomWord(true, 6, 32);
        return server_1.web3.utils.soliditySha3({ v: game, t: "address" }, { v: timestamp, t: "uint256" }, { v: random, t: "bytes32" });
    };
    Common.Sleep = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (res, rej) {
                        setTimeout(res, time);
                    })];
            });
        });
    };
    return Common;
}());
exports.Common = Common;
//# sourceMappingURL=common.js.map