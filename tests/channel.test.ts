import { userOpenChannel, initL2 } from "./test_util";
import { L2 } from "../src/sdk/sdk";
import { Common } from "../src/lib/common";

jest.setTimeout(600000);

describe("channel test", () => {
  let l2: L2;
  let user = "0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0";
  let userPrivateKey =
    "118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB";
  beforeAll(async () => {
    l2 = await initL2();
    let depositAmount = 1e14;
    let watchDeposit = new Promise((resolve, reject) => {
      l2.on("UserDeposit", (err, res) => {
        console.log("Receive UserDeposit", res);
        resolve(res);
      });
    });
    await Promise.all([
      watchDeposit,
      userOpenChannel(user, userPrivateKey, depositAmount)
    ]);
  });

  it("ReBalance", async () => {});

  it("Transfer", async () => {});

  it("SubmitTransferFee", async () => {});

  it("WithdrawTransferFee", async () => {});

  it("kickUser", async () => {
    await Common.Sleep(3000);
    let watchForceWithdraw = new Promise((resolve, reject) => {
      l2.on("UserForceWithdraw", (err, res) => {
        console.log("Receive UserForceWithdraw", res);
        resolve(res);
      });
    });
    await Promise.all([l2.KickUser(user), watchForceWithdraw]);
    expect(true).toBe(true);
  });
});
