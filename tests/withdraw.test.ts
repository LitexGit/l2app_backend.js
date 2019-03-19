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

    it('CP申请提现', async () => {
        let rs = await l2.ProposeWithdraw(1e16);
        console.log("CP申请提现结束， 操作结果:", rs);
    });

});