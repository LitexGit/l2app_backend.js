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
        // let sessionID = l2.StartSession('0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928', 'hello world');
        // let session = await l2.GetSession(sessionID);

        let sessionID = '0x967156520cc68aa5d0752af396e41255243416b87ef4ea4d9947e7c8effa365e';
        let session = await l2.GetSession(sessionID);

        console.log(session);

        l2.CloseSession(sessionID);

        // let hash = await l2.Deposit(1e16);
        // console.log("CP充值操作结束， HASH:", hash);
    });

});