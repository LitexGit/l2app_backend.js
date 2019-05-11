import { PN } from "./contract";
// import mylog from "../lib/mylog";
// mylog();
export const config = {
  ethPNAddress: "0xcf3C676EE0B8817370eC40c653C75a9bB3296657",
  appPNAddress: "0x2398Fd042176e343cC47eD34ebB0C2ECb154128b",
  appSessionAddress: "0xf6486AB66Fa7e3af90098cBD9cd6342E422A1c3F",
  appOperatorAddress: "0xf165B50c6c7335b406c7F24d29329009Ca7745f8	",
  appRpcUrl: "http://54.64.76.19:1337",
  ethRpcUrl: "http://39.96.8.192:8545",
  // token: "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928"
  token: "0x0000000000000000000000000000000000000000"
  // token: '0x9ac78c85A0d3a86a8BE1e08Bea6Ef2EE1687bE18',
  // token: '0x3052c3104c32e666666fBEf3A5EAd4603747eA83',
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

export const cpPrivateKey =
  "6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5";

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
