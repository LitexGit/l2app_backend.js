"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    ethPNAddress: "0xdfb90231f2355E756993dE371C05f3e92395790c",
    appPNAddress: "0x7085d3C32c48385Ee2386440645Ec0bf7d49550F",
    appSessionAddress: "0x07591D8e1f0f5466124C09cBB2Eca1292C2c0673",
    appOperatorAddress: "0x8804Fc15cbeA212289BA216dD56b93cBbe33b930",
    appRpcUrl: "http://18.179.21.124:1337",
    ethRpcUrl: "http://39.96.8.192:8545",
    token: "0x3052c3104c32e666666fBEf3A5EAd4603747eA83"
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