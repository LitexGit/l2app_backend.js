import { PN } from "./contract";
const Web3 = require("web3");
export const cpPrivateKey =
  "6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5";

export const ethPaymentNetwork: PN = {
  address: "0xdCbd4E045096Ef980d635381Cd183120F46825d3",
  abi: JSON.stringify(require("./onchainPayment.json"))
};

export const appPaymentNetwork: PN = {
  address: "0xB30d792F5c705cAe7Ec3Fc57A12408745fd0CE7F",
  abi: JSON.stringify(require("./offchainPayment.json"))
};

export const sessionPayNetwork: PN = {
  address: "0x6923C31b8ab980217bE283DEF58013355537C39D",
  abi: JSON.stringify(require("./sessionPayment.json"))
};

// export const  appRpcUrl = "http://wallet.milewan.com:8090";
export const appRpcUrl = "ws://wallet.milewan.com:4337";

export const ethRpcUrl = "http://54.250.21.165:8545";
// export const ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);

let oldlog = console.log;
console.log = (message?: any, ...optionalParams: any[]) => {
  let timestamp = new Date().toISOString();
  if (optionalParams.length >= 1) {
    if (typeof message === "string") {
      oldlog(timestamp + "-------  " + message, ...optionalParams);
    } else {
      oldlog(timestamp + "-------  ", message, ...optionalParams);
    }
  } else {
    if (typeof message === "string") {
      oldlog(timestamp + "-------  " + message);
    } else {
      oldlog(timestamp + "-------  ", message);
    }
  }
};
