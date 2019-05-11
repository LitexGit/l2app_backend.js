"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    ethPNAddress: "0xcf3C676EE0B8817370eC40c653C75a9bB3296657",
    appPNAddress: "0x2398Fd042176e343cC47eD34ebB0C2ECb154128b",
    appSessionAddress: "0xf6486AB66Fa7e3af90098cBD9cd6342E422A1c3F",
    appOperatorAddress: "0xf165B50c6c7335b406c7F24d29329009Ca7745f8	",
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