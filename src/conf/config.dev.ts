import { PN } from "./contract";
import mylog from "../lib/mylog";
// mylog();
export const cpPrivateKey =
  "6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5";

export const ethPaymentNetwork: PN = {
  address: "0x8220a551498dC9f1221dC63179D817Ea1814fc56",
  abi: JSON.stringify(require("./onchainPayment.json"))
};

export const appPaymentNetwork: PN = {
  address: "0xC0b2F7F36aD57f9F9C8e9821E18f4FEe3c19F994",
  abi: JSON.stringify(require("./offchainPayment.json"))
};

export const sessionPayNetwork: PN = {
  address: "0x6923C31b8ab980217bE283DEF58013355537C39D",
  abi: JSON.stringify(require("./sessionPayment.json"))
};

// export const  appRpcUrl = "http://wallet.milewan.com:8090";
export const appRpcUrl = "ws://wallet.milewan.com:4337";

export const ethRpcUrl = "http://39.96.8.192:8545";
// export const ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);
