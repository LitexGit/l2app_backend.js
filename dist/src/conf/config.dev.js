"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Web3 = require("web3");
exports.cpPrivateKey = "6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5";
exports.ethPaymentNetwork = {
    address: "0x8220a551498dC9f1221dC63179D817Ea1814fc56",
    abi: JSON.stringify(require("./onchainPayment.json"))
};
exports.appPaymentNetwork = {
    address: "0xC0b2F7F36aD57f9F9C8e9821E18f4FEe3c19F994",
    abi: JSON.stringify(require("./offchainPayment.json"))
};
exports.sessionPayNetwork = {
    address: "0x6923C31b8ab980217bE283DEF58013355537C39D",
    abi: JSON.stringify(require("./sessionPayment.json"))
};
exports.appRpcUrl = "ws://wallet.milewan.com:4337";
exports.ethRpcUrl = "http://39.96.8.192:8545";
var oldlog = console.log;
console.log = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    var timestamp = new Date().toISOString();
    if (optionalParams.length >= 1) {
        if (typeof message === "string") {
            oldlog.apply(void 0, [timestamp + "-------  " + message].concat(optionalParams));
        }
        else {
            oldlog.apply(void 0, [timestamp + "-------  ", message].concat(optionalParams));
        }
    }
    else {
        if (typeof message === "string") {
            oldlog(timestamp + "-------  " + message);
        }
        else {
            oldlog(timestamp + "-------  ", message);
        }
    }
};
//# sourceMappingURL=config.dev.js.map