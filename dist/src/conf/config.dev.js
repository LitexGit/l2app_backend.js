"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    ethPNAddress: "0x35e73CF2D3717B88322E23E6aE2ceb65B74B42c5",
    appPNAddress: "0x4C636A5433CC3FaA5A3Af3429ceCA0852DA4Ba91",
    appSessionAddress: "0x2398Fd042176e343cC47eD34ebB0C2ECb154128b",
    appOperatorAddress: "0xf6486AB66Fa7e3af90098cBD9cd6342E422A1c3F",
    appRpcUrl: "http://54.64.76.19:1337",
    ethRpcUrl: "http://39.96.8.192:8545",
    token: "0x0000000000000000000000000000000000000000"
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