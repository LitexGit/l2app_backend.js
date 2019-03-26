import { PN } from "../lib/server";

const Web3 = require('web3');

export const cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

export const ethPaymentNetwork: PN = {address: '0x276B5d0202967D1aa26C86e135A94B3A0852bFdb', abi: JSON.stringify(require('./onchainPayment.json'))};

export const appPaymentNetwork: PN = {address: '0x8C4391F387B6d20d4F38b7e5449D755fC0B7DB0E', abi: JSON.stringify(require('./offchainPayment.json'))};

export const sessionPayNetwork: PN = {address: '0x418bDb873b3e8B200662571a643F65f7D90B468e', abi: JSON.stringify(require('./sessionPayment.json'))};

// export const  appRpcUrl = "http://wallet.milewan.com:8090";
export const  appRpcUrl = "ws://wallet.milewan.com:4337";

export const  ethRpcUrl = "http://54.250.21.165:8545";
export const  ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);

