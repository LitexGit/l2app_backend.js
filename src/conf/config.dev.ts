import { PN } from "./contract";
// import mylog from "../lib/mylog";
// mylog();
export const config = {
  ethPNAddress: "0x854b40910A47a2D07E8577601d1E4A038538985a",
  appPNAddress: "0x4f8fc4084a0d59EB59390053E718D79aFc12295E",
  appSessionAddress: "0x50Fc5569C9644FdFC22657E5E295fB5e131f7033",
  appOperatorAddress: "0x7c4866861CC34946194b6FfD1196F9f9166Cdc5A",
  appRpcUrl: "http://39.106.71.164:1337",
  ethRpcUrl: "http://39.96.8.192:8545",
  // token: "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928"
  token: "0x0000000000000000000000000000000000000000"
};

// export const config = {
//   ethPNAddress: "0xdfb90231f2355E756993dE371C05f3e92395790c",
//   appPNAddress: "0x7085d3C32c48385Ee2386440645Ec0bf7d49550F",
//   appSessionAddress: "0x07591D8e1f0f5466124C09cBB2Eca1292C2c0673",
//   appOperatorAddress: "0x8804Fc15cbeA212289BA216dD56b93cBbe33b930",
//   appRpcUrl: "http://18.179.21.124:1337",
//   ethRpcUrl: "http://39.96.8.192:8545",
//   token: "0x3052c3104c32e666666fBEf3A5EAd4603747eA83"
//   // token: "0x9ac78c85A0d3a86a8BE1e08Bea6Ef2EE1687bE18"
//   // token: "0x0000000000000000000000000000000000000000"
// };

export const cpPrivateKey = "9C273F1FC38BCBAC1C41242F9D606E67A7BB868BD474E0E3099012ECAA88B059";

export const ethPaymentNetwork: PN = {
  address: config.ethPNAddress,
  abi: JSON.stringify(require("./onchainPayment.json"))
};

export const appPaymentNetwork: PN = {
  address: config.appPNAddress,
  abi: JSON.stringify(require("./offchainPayment.json"))
};

export const sessionPayNetwork: PN = {
  address: config.appSessionAddress,
  abi: JSON.stringify(require("./sessionPayment.json"))
};

export const appRpcUrl = config.appRpcUrl;
export const ethRpcUrl = config.ethRpcUrl;
