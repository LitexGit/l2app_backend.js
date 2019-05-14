"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    ethPNAddress: "0x854b40910A47a2D07E8577601d1E4A038538985a",
    appPNAddress: "0x4f8fc4084a0d59EB59390053E718D79aFc12295E",
    appSessionAddress: "0x50Fc5569C9644FdFC22657E5E295fB5e131f7033",
    appOperatorAddress: "0x7c4866861CC34946194b6FfD1196F9f9166Cdc5A",
    appRpcUrl: "http://39.106.71.164:1337",
    ethRpcUrl: "http://39.96.8.192:8545",
    token: "0x0000000000000000000000000000000000000000"
};
exports.cpPrivateKey = "9C273F1FC38BCBAC1C41242F9D606E67A7BB868BD474E0E3099012ECAA88B059";
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