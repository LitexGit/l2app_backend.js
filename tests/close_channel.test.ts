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

    it('CP强关', async () => {
        let hash = await l2.KickUser('');
        console.log("CP强关结束， HASH:", hash);
    });

});