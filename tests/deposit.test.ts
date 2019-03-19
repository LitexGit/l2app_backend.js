import { L2 } from "../src/sdk/sdk";

import {
    appPaymentNetwork,
    appRpcUrl,
    cpPrivateKey,
    ethPaymentNetwork,
    ethProvider
} from "../src/conf/config.dev";

describe('单元测试', () => {

    let l2 = L2.GetInstance();
    l2.Init(cpPrivateKey, ethProvider, ethPaymentNetwork, appRpcUrl, appPaymentNetwork);

    it('CP充值', async () => {
        let hash = await l2.Deposit(1e16);
        console.log("CP充值操作结束， HASH:", hash);
    });

});