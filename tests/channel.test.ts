import { userOpenChannel, initL2, userTransfer } from "./test_util";
import { L2 } from "../src/sdk/sdk";
import { Common } from "../src/lib/common";
import { ethPN, cpProvider } from "../src/lib/server";
import { config as testConfig } from "./config_test";
let {
  userAddress,
  userPrivateKey,
  operatorPrivateKey,
  token,
  feeRate,
  jestTimeout,
  sleepInterval
} = testConfig;

jest.setTimeout(jestTimeout);

describe("channel test", () => {
  let l2: L2;
  let user = "0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0";
  let userPrivateKey =
    "118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB";
  let depositAmount = 1e14;
  beforeAll(async () => {
    l2 = await initL2();
    let channel = await l2.getChannelInfo(user, token);

    console.log("channel is ", channel);
    if (Number(channel.status) === 2) {
      // settle channel
      let settleData = ethPN.methods
        .settleChannel(channel.channelID)
        .encodeABI();
      // 发送ETH交易
      await Common.SendEthTransaction(
        cpProvider.address,
        ethPN.options.address,
        0,
        settleData,
        cpProvider.privateKey
      );
    }

    // await l2.kickUser(userAddress);

    channel = await l2.getChannelInfo(user, token);
    console.log("step2 channel is ", channel);

    if (Number(channel.status) === 0) {
      // open channel
      let watchDeposit = new Promise((resolve, reject) => {
        l2.on("UserDeposit", (err, res) => {
          console.log("Receive UserDeposit", res);
          resolve(res);
        });
      });
      await Promise.all([
        watchDeposit,
        userOpenChannel(user, userPrivateKey, depositAmount, token)
      ]);
    }
  });

  beforeEach(async () => {
    console.log(
      "/************************NEXT IT***********************************/"
    );
    await Common.Sleep(sleepInterval);
  });

  it("TransferWithAutoRebalance", async () => {
    let beforeChannelInfo = await l2.getChannelInfo(user, token);
    console.log("before channel info is ", beforeChannelInfo);

    let providerBalance = beforeChannelInfo.providerBalance;

    let res = await l2.transfer(user, depositAmount, token);

    await Common.Sleep(sleepInterval);
    let afterChannelInfo = await l2.getChannelInfo(user, token);
    console.log("after channel info is ", afterChannelInfo);

    expect(Number(afterChannelInfo.providerBalance)).toBe(0);
    expect(Number(afterChannelInfo.userBalance)).toBe(
      Number(beforeChannelInfo.userBalance) + depositAmount
    );

    // expect(l2.Transfer(user, providerBalance)).rejects.toThrowError("Reverted");
  });

  // it("ReBalance", async () => {
  //   let beforeChannelInfo = await l2.getChannelInfo(user, token);
  //   console.log("before channel info is ", beforeChannelInfo);

  //   let res = await l2.rebalance(user, depositAmount, token);
  //   await Common.Sleep(sleepInterval);
  //   let afterChannelInfo = await l2.getChannelInfo(user, token);
  //   console.log("after channel info is ", afterChannelInfo);

  //   expect(Number(afterChannelInfo.providerBalance)).toBe(
  //     Number(beforeChannelInfo.providerBalance) + depositAmount
  //   );
  // });

  // it("Transfer", async () => {
  //   let beforeChannelInfo = await l2.getChannelInfo(user, token);
  //   console.log("before channel info is ", beforeChannelInfo);

  //   let providerBalance = beforeChannelInfo.providerBalance;

  //   let res = await l2.transfer(
  //     user,
  //     depositAmount,
  //     token
  //   );

  //   await Common.Sleep(sleepInterval);
  //   let afterChannelInfo = await l2.getChannelInfo(user, token);
  //   console.log("after channel info is ", afterChannelInfo);

  //   expect(Number(afterChannelInfo.providerBalance)).toBe(
  //     Number(beforeChannelInfo.providerBalance) - depositAmount
  //   );

  //   // expect(l2.Transfer(user, providerBalance)).rejects.toThrowError("Reverted");
  // });

  it("kickUser", async () => {
    await Common.Sleep(sleepInterval);
    let watchForceWithdraw = new Promise((resolve, reject) => {
      l2.on("UserForceWithdraw", (err, res) => {
        console.log("Receive UserForceWithdraw", res);
        resolve(res);
      });
    });
    await Promise.all([l2.kickUser(user, token), watchForceWithdraw]);
    expect(true).toBe(true);
  });
});
