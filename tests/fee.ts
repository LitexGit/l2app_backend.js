import CITASDK from '@cryptape/cita-sdk';
import { TX_BASE } from "../src/conf/contract";
import { appPaymentNetwork, appRpcUrl, ethRpcUrl } from "../src/conf/config.dev";
import { Common } from "../src/lib/common";
import {ERC20, ethPN} from "../src/lib/server";

const Web3 = require('web3');

const operatorAddress = '0x38f8058A392807b99a6AfC225b8047ab3D31b00c';
const operatorPrivateKey = 'DDC1738AC05989633A43A49FB8B9FBE77970CCA9F85921768C2BD8FABBFB2E55';

const token = '0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928';

let CITA = CITASDK(appRpcUrl);

let operatorContract = new CITA.base.Contract(require('../src/conf/operatorContract.json'), operatorAddress);
let appChainContract = new CITA.base.Contract(Common.Abi2JsonInterface(appPaymentNetwork.abi), appPaymentNetwork.address);

let web3 = new Web3(Web3.givenProvider || ethRpcUrl);

function randomWord(randomFlag: boolean, min: number, max: number = 0): string {
    let str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // 随机产生
    if(randomFlag) {
        range = Math.round(Math.random() * (max-min)) + min;
    }

    let pos: any;

    for(let i=0; i<range; i++) {
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }

    return str;
}

describe('单元测试', () => {
    it('CP ReBalance', async () => {

        let tx = {
            ...TX_BASE,
            privateKey: operatorPrivateKey,
            from: operatorAddress,
        };

        // let hash = "0x" + randomWord(false, 32);

        let hash = web3.utils.soliditySha3(
            {v: randomWord(false, 32), t: 'bytes32'},
        );

        let blockNumber = await web3.eth.getBlockNumber();

        let currentBlockNumber = await CITA.base.getBlockNumber();
        tx.validUntilBlock = +currentBlockNumber + 88;

        let data = await appChainContract.methods.setFeeRate(token, 1).encodeABI();

        // submit transaction
        let rs = await operatorContract.methods.submitTransaction(
            hash,
            blockNumber,
            appPaymentNetwork.address,
            0,
            data
        ).send(tx);

        if (rs.hash) {
            let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

            if (!receipt.errorMessage) {
                //确认成功
                console.log("send CITA tx success", receipt);
                return 'confirm success'
            } else {
                //确认失败
                return 'confirm fail'
            }
        } else {
            // 提交失败
            return 'send CITA tx fail'
        }
    });

});