import { PN } from "./contract";
// import mylog from "../lib/mylog";
// mylog();

export const config = {
  ethPNAddress: "0xb661DB91C0EB7ff242871BB2787690BF51959DDA",
  appPNAddress: "0xa097122AcdC2dEc8532985dAeEE5020F25086ED7",
  appSessionAddress: "0xD8eA3Cfe187b2C98Bc6e379454CCa432C36F72b9",
  appOperatorAddress: "0x637CC5997eF214Ed34603a09846a3849CaA9B090",
  appRpcUrl: "ws://18.179.21.124:4337",
  ethRpcUrl: "http://39.96.8.192:8545",
  // token: "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928"
  token: "0x0000000000000000000000000000000000000000"
};

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
