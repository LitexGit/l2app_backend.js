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

    it('CP转账', async () => {
        let rs = await l2.SendAsset('', 1e14);
        console.log("CP转账结束， 操作结果:", rs);
    });

});