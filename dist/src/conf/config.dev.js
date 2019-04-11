"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    ethPNAddress: "0xb661DB91C0EB7ff242871BB2787690BF51959DDA",
    appPNAddress: "0xa097122AcdC2dEc8532985dAeEE5020F25086ED7",
    appSessionAddress: "0xd1DDD0232BA1E8B23Bd1531FfF35e30f3cC6fAcA",
    appOperatorAddress: "0x637CC5997eF214Ed34603a09846a3849CaA9B090",
    appRpcUrl: "ws://18.179.21.124:4337",
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