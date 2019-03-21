import { L2 } from "../src/sdk/sdk";

import {
    appPaymentNetwork,
    appRpcUrl,
    cpPrivateKey,
    ethPaymentNetwork,
    ethProvider
} from "../src/conf/config.dev";
import {cpProvider, ERC20, ethPN, web3} from "../src/lib/server";

const TX = require('ethereumjs-tx');

describe('单元测试', () => {

    let l2 = L2.GetInstance();
    l2.Init(cpPrivateKey, ethProvider, ethPaymentNetwork, appRpcUrl, appPaymentNetwork);

    it('CP充值', async () => {
        // 授权合约能从账户扣token
        let data = ethPN.methods.regulatorWithdraw('0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928', '100000000000000000000000', '1000000000000000000000000', 1, '0x900678b5abdfc321191a2ce36412402e1cdde7d198abf1e0ee971584fd5f0d7773b431298ecd802585d5cbc7578d240daca1a3064295b65bd5f842546fca23ff1b').encodeABI();

        let from = '0x4Aa670bCe722B9698A670afc968b1dE5f1553df9';
        let to = '0xA522665CEf690221850264696a02d4D785F9ba8A';
        let value = 0;

        let nonce = await web3.eth.getTransactionCount(from);

        let rawTx = {
            from: from,
            nonce: "0x" + nonce.toString(16),
            chainId: await web3.eth.net.getId(),
            to: to,
            data: data,
            value: web3.utils.toHex(value),
            // gasPrice: web3.utils.toHex(8 * 1e9),
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
            gasLimit: web3.utils.toHex(300000),
        };

        let tx = new TX(rawTx);

        let priKey = 'DDC1738AC05989633A43A49FB8B9FBE77970CCA9F85921768C2BD8FABBFB2E55';

        if (priKey.substr(0, 2) === '0x') {
            tx.sign(Buffer.from(priKey.substr(2), 'hex'));
        } else {
            tx.sign(Buffer.from(priKey, 'hex'));
        }

        let serializedTx = tx.serialize();

        let txData = "0x" + serializedTx.toString("hex");

        console.log("SEND TX", rawTx);

        return new Promise((resolve, reject) => {
            try {
                web3.eth.sendSignedTransaction(txData).on("transactionHash", (value: {} | PromiseLike<{}>)=>{
                    resolve(value);
                }).on('error', (error: any)=>{
                    // reject(error);
                });
            } catch (e) {
                // reject(e);
            }
        });

        // let hash = await l2.Deposit(1e16);
        // console.log("CP充值操作结束， HASH:", hash);
    });

});