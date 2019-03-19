import { PN } from "../lib/server";

const Web3 = require('web3');

export const cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

export const ethPaymentNetwork: PN = {address: '0xA912988325863ca89cF3cC6F5Dcb5aAf813B6C24', abi: JSON.stringify(require('../src/conf/onchainPayment.json'))};

export const appPaymentNetwork: PN = {address: '0x2021B7DbB3a3FfE0E87Af909BB876656641dD1Ba', abi: JSON.stringify(require('../src/conf/offchainPayment.json'))};

export const  appRpcUrl = "http://wallet.milewan.com:8090";

export const  ethRpcUrl = "http://54.250.21.165:8545";
export const  ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);