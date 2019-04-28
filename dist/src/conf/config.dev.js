"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    ethPNAddress: "0x3C8b15A48e7a07E7cBA0c29e6De42E7f289A92cb",
    appPNAddress: "0x2398Fd042176e343cC47eD34ebB0C2ECb154128b",
    appSessionAddress: "0x3707A2b09acFC704D820AB4b880957B840045123",
    appOperatorAddress: "0x4C636A5433CC3FaA5A3Af3429ceCA0852DA4Ba91",
    appRpcUrl: "http://54.64.76.19:1337",
    ethRpcUrl: "http://39.96.8.192:8545",
    token: '0x3052c3104c32e666666fBEf3A5EAd4603747eA83',
};
exports.cpPrivateKey = "6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5";
exports.ethPaymentNetwork = {
    address: exports.config.ethPNAddress,
    abi: JSON.stringify(require("./onchainPayment.json"))
};
exports.appPaymentNetwork = {
    address: exports.config.appPNAddress,
    abi: JSON.stringify(require("./offchainPayment.json"))
};
exports.sessionPayNetwork = {
    address: exports.config.appSessionAddress,
    abi: JSON.stringify(require("./sessionPayment.json"))
};
exports.appRpcUrl = exports.config.appRpcUrl;
exports.ethRpcUrl = exports.config.ethRpcUrl;
//# sourceMappingURL=config.dev.js.map