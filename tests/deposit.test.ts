import { initL2 } from "./test_util";
import { L2 } from "../src/sdk/sdk";
import { Common } from "../src/lib/common";
import { config as testConfig } from "./config_test";
import { ethPN, appPN } from "../src/lib/server";
import { config } from "../src/conf/config.dev";
let {
  userAddress,
  userPrivateKey,
  operatorPrivateKey,
  feeRate,
  jestTimeout,
  sleepInterval
} = testConfig;
let { token } = config;

jest.setTimeout(jestTimeout);

describe("单元测试", () => {
  let l2: L2;

  beforeAll(async () => {
    l2 = await initL2();
  });

  beforeEach(() => {
    console.log("*****************NEXT IT***********************");
  });

  it("CP deposit", async () => {
    let depositAmount = "5000000000000000000000";
    let watchDepsoit = new Promise((resolve, reject) => {
      l2.on("ProviderDeposit", (err, res) => {
        console.log("Receive ProviderDeposit", res);
        expect(res.amount).toBe(depositAmount + "");
        resolve(res);
      });
    });

    let beforePN = await l2.getPaymentNetwork(token);
    console.log("beforePN", beforePN);

    let regulator = await ethPN.methods.regulator().call();
    let provider = await ethPN.methods.provider().call();

    let regulatorApp = await appPN.methods.regulator().call();
    let providerApp = await appPN.methods.provider().call();
    let operatorApp = await appPN.methods.operator().call();

    console.log(regulator, regulatorApp, provider, providerApp, operatorApp);

    Promise.all([await l2.deposit(depositAmount, token), await watchDepsoit]);
    await Common.Sleep(sleepInterval);
    let afterPN = await l2.getPaymentNetwork(token);

    console.log("beforePN", beforePN);
    console.log("afterPN", afterPN);
    expect(Number(afterPN.providerDeposit)).toBe(
      Number(beforePN.providerDeposit) + depositAmount
    );
    expect(Number(afterPN.providerBalance)).toBe(
      Number(beforePN.providerBalance) + depositAmount
    );
  });

  // it("CP withdraw", async () => {
  //   let withdrawAmount = 1e15;

  //   let watchWithdraw = new Promise((resolve, reject) => {
  //     l2.on("ProviderWithdraw", (err, res) => {
  //       console.log("Receive ProviderWithdraw", res);
  //       expect(res.amount).toBe(withdrawAmount + "");
  //       resolve(res);
  //     });
  //   });

  //   // let beforeBalance = await web3.eth.getBalance(cpProvider.address);
  //   let beforePN = await l2.getPaymentNetwork(token);
  //   Promise.all([
  //     await l2.withdraw(withdrawAmount, token),
  //     await watchWithdraw
  //   ]);
  //   await Common.Sleep(sleepInterval);
  //   let afterPN = await l2.getPaymentNetwork(token);
  //   // let afterBalance = await web3.eth.getBalance(cpProvider.address);
  //   console.log("beforePN", beforePN);
  //   console.log("afterPN", afterPN);
  //   expect(Number(afterPN.providerBalance)).toBe(
  //     Number(beforePN.providerBalance) - withdrawAmount
  //   );
  // });
});
