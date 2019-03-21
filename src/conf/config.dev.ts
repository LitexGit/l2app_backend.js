import { PN } from "../lib/server";

const Web3 = require('web3');

export const cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

export const ethPaymentNetwork: PN = {address: '0xA522665CEf690221850264696a02d4D785F9ba8A', abi: JSON.stringify(require('./onchainPayment.json'))};

export const appPaymentNetwork: PN = {address: '0x9324C590040b140def29d8968Ea6c40b53F25C9c', abi: JSON.stringify(require('./offchainPayment.json'))};

export const  appRpcUrl = "http://wallet.milewan.com:8090";

export const  ethRpcUrl = "http://54.250.21.165:8545";
export const  ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);

