import { L2, L2_CB, L2_EVENT, PN } from '../src/sdk/sdk'

import { expect } from 'chai';
import { Common } from "../src/lib/common";
import {cpProvider, ethPN, appPN, web3, CITA} from "../src/lib/server";
import {TX_BASE} from "../src/conf/contract";
// import * as should from 'should'

import { signHash } from '../src/lib/sign';

const Web3 = require('web3');

describe('单元测试', function () {

    let cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

    const ethPaymentNetwork: PN = {address: '0x119dc8Dae6C2EB015F108bF80d81f294D0711A14', abi: JSON.stringify(require('../src/conf/onchainPayment.json'))};

    let appPaymentNetwork: PN = {address: '0x0a95fF901dc4206Ac4a67E827436790A0A0cF36a', abi: JSON.stringify(require('../src/conf/offchainPayment.json'))};

    let appRpcUrl = "http://wallet.milewan.com:8090";

    let ethRpcUrl = "http://54.250.21.165:8545";
    let ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);
    // let ethRpcUrl = "ws://54.250.21.165:8546";
    // let ethProvider = new Web3.providers.WebsocketProvider(ethRpcUrl);

    let l2 = L2.GetInstance();
    l2.Init(cpPrivateKey, ethProvider, ethPaymentNetwork, appRpcUrl, appPaymentNetwork);

    // it('CP 充值', async function () {
    //     let hash = await l2.Deposit(1e16);
    //     console.log("Deposit HASH:", hash);
    //     expect(hash).to.be.a('string');
    // });

    // it('CP 申请提现', function () {
        // let hash = l2.ProposeWithdraw(1e15);
        // console.log("Withdraw HASH:", hash);
        // expect(hash).to.be.a('string');
    // });

    // it('CP ReBalance', async function () {
    //     let hash = await l2.ProposeReBalance('0x27449AaAC55559B30B505bC992CaF286a6D13835', 1e16);
    //     console.log("ReBalance HASH:", hash);
    //     // expect(hash).to.be.a('string');
    // });

    it('CP 转账', async function () {
        let hash = await l2.SendAsset('0x27449AaAC55559B30B505bC992CaF286a6D13835', 1e14);
        console.log("转账 HASH:", hash);
        // expect(hash).to.be.a('string');
    });
});