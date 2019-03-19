import { L2, L2_CB, L2_EVENT, PN } from '../src/sdk/sdk'

import { expect } from 'chai';
import { Common } from "../src/lib/common";
import {cpProvider, ethPN, appPN, web3, CITA} from "../src/lib/server";
import {TX_BASE} from "../src/conf/contract";
// import * as should from 'should'

import { signHash } from '../src/lib/sign';

const Web3 = require('web3');

// let cp = cpProvider.address;

describe('单元测试', function () {

    let cpPrivateKey = '6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5';

    const ethPaymentNetwork: PN = {address: '0x466F66B1C20a56B43e12F6Ab70781089c603BB65', abi: JSON.stringify(require('../src/conf/onchainPayment.json'))};

    let appPaymentNetwork: PN = {address: '0xf6486AB66Fa7e3af90098cBD9cd6342E422A1c3F', abi: JSON.stringify(require('../src/conf/offchainPayment.json'))};

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
    //     // expect(hash).to.be.a('string');
    // });

    // it('CP 申请提现', function () {
    //     let hash = l2.ProposeWithdraw(1e16);
    //     console.log("Withdraw HASH:", hash);
    //     expect(hash).to.be.a('string');
    // });

    // it('CP ReBalance', async function () {
    //     let hash = await l2.ProposeReBalance('0xF1DaF72BA2Fad1941dA8e987ADe11F9DE415542E', 1e16);
    //     console.log("ReBalance HASH:", hash);
    //     // expect(hash).to.be.a('string');
    // });

    // it('CP 转账', async function () {
    //     let hash = await l2.SendAsset('0xF1DaF72BA2Fad1941dA8e987ADe11F9DE415542E', 1e15, '0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928');
    //     console.log("转账 HASH:", hash);
    //     // expect(hash).to.be.a('string');
    // });

    it('Close Channel', async function () {
        let hash = await l2.CloseChannel('0xF1DaF72BA2Fad1941dA8e987ADe11F9DE415542E');
        console.log("Close Channel HASH:", hash);
    });
});