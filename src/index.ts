import { L2, L2_CB, L2_EVENT, PN } from './sdk/sdk';

const Web3 = require('web3');

let cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

const ethPaymentNetwork: PN = {address: '0xA912988325863ca89cF3cC6F5Dcb5aAf813B6C24', abi: JSON.stringify(require('../src/conf/onchainPayment.json'))};

let appPaymentNetwork: PN = {address: '0x2021B7DbB3a3FfE0E87Af909BB876656641dD1Ba', abi: JSON.stringify(require('../src/conf/offchainPayment.json'))};

let appRpcUrl = "http://wallet.milewan.com:8090";

let ethRpcUrl = "http://54.250.21.165:8545";
let ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);

let l2 = L2.GetInstance();

l2.Init(cpPrivateKey, ethProvider, ethPaymentNetwork, appRpcUrl, appPaymentNetwork);
