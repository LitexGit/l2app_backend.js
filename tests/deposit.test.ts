import { initL2 } from "./test_util";
import { L2 } from "../src/sdk/sdk";
import { Common } from "../src/lib/common";
import { web3, cpProvider } from "../src/lib/server";
jest.setTimeout(600000);

describe("单元测试", () => {
  let l2: L2;

  beforeAll(async () => {
    l2 = await initL2();
  });

  beforeEach(() => {
    console.log("*****************NEXT IT***********************");
  });

  it("CP deposit", async () => {
    let depositAmount = 1e16;
    let watchDepsoit = new Promise((resolve, reject) => {
      l2.on("ProviderDeposit", (err, res) => {
        console.log("Receive ProviderDeposit", res);
        expect(res.amount).toBe(depositAmount + "");
        resolve(res);
      });
    });

    let beforePN = await l2.GetPaymentNetwork();
    Promise.all([await l2.Deposit(depositAmount), await watchDepsoit]);
    await Common.Sleep(2000);
    let afterPN = await l2.GetPaymentNetwork();

    console.log("beforePN", beforePN);
    console.log("afterPN", afterPN);
    expect(Number(afterPN.providerDeposit)).toBe(
      Number(beforePN.providerDeposit) + depositAmount
    );
    expect(Number(afterPN.providerBalance)).toBe(
      Number(beforePN.providerBalance) + depositAmount
    );
  });

  it("CP withdraw", async () => {
    let withdrawAmount = 1e15;

    let watchWithdraw = new Promise((resolve, reject) => {
      l2.on("ProviderWithdraw", (err, res) => {
        console.log("Receive ProviderWithdraw", res);
        expect(res.amount).toBe(withdrawAmount + "");
        resolve(res);
      });
    });

    // let beforeBalance = await web3.eth.getBalance(cpProvider.address);
    let beforePN = await l2.GetPaymentNetwork();
    Promise.all([await l2.Withdraw(withdrawAmount), await watchWithdraw]);
    await Common.Sleep(2000);
    let afterPN = await l2.GetPaymentNetwork();
    // let afterBalance = await web3.eth.getBalance(cpProvider.address);
    console.log("beforePN", beforePN);
    console.log("afterPN", afterPN);
    expect(Number(afterPN.providerBalance)).toBe(
      Number(beforePN.providerBalance) - withdrawAmount
    );
  });
});
