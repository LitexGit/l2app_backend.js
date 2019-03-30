import { PN } from "../lib/server";

const Web3 = require('web3');
export const cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

export const ethPaymentNetwork: PN = {address: '0x0B3B88bAa51100D58A4710E3a2A2657fe3ca38e2', abi: JSON.stringify(require('./onchainPayment.json'))};

export const appPaymentNetwork: PN = {address: '0x436c5403eA2769948d6e1Cd90D78DA54D8982daa', abi: JSON.stringify(require('./offchainPayment.json'))};

export const sessionPayNetwork: PN = {address: '0xFAdec7E5b28bcFc6BB133Fcc76e45764EC7aF4Fb', abi: JSON.stringify(require('./sessionPayment.json'))};

// export const  appRpcUrl = "http://wallet.milewan.com:8090";
export const  appRpcUrl = "ws://wallet.milewan.com:4337";

export const  ethRpcUrl = "http://54.250.21.165:8545";
export const  ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);

