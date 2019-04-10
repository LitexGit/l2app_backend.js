import {
  userOpenChannel,
  initL2,
  userCloseChannel,
  setTokenFee,
  userTransfer,
  regulatorWithdraw
} from "./test_util";
import { L2 } from "../src/sdk/sdk";
import { config as testConfig, config } from "./config_test";
import { Common } from "../src/lib/common";
import { cpProvider, appPN } from "../src/lib/server";
import { config as devConfig } from "../src/conf/config.dev";

let operatorContractAddress = devConfig.appOperatorAddress;
let {
  userAddress,
  userPrivateKey,
  operatorPrivateKey,
  regulatorPrivateKey,
  token,
  feeRate,
  jestTimeout,
  sleepInterval
} = testConfig;

jest.setTimeout(jestTimeout);

describe("session test", () => {
  let l2: L2;
  let depositAmount = 1e14;

  beforeAll(async () => {
    l2 = await initL2();
    let watchDeposit = new Promise((resolve, reject) => {
      l2.on("UserDeposit", (err, res) => {
        console.log("Receive UserDeposit", res);
        resolve(res);
      });
    });
    await Promise.all([
      watchDeposit,
      userOpenChannel(userAddress, userPrivateKey, depositAmount, token),
      setTokenFee(operatorContractAddress, token, feeRate, operatorPrivateKey)
    ]);
  });

  afterAll(async () => {
    let watchForceWithdraw = new Promise((resolve, reject) => {
      l2.on("UserForceWithdraw", (err, res) => {
        console.log("Receive UserForceWithdraw", res);
        resolve(res);
      });
    });
    await Promise.all([
      userCloseChannel(userAddress, userPrivateKey, token),
      watchForceWithdraw,
      setTokenFee(operatorContractAddress, token, 0, operatorPrivateKey)
    ]);
  });

  beforeEach(async () => {
    console.log(
      "/************************NEXT IT***********************************/"
    );
    await Common.Sleep(sleepInterval);
  });

  it("setFee", async () => {
    let feeRateOnChain = await l2.getTokeFeeRate(token);
    expect(feeRateOnChain).toBe(Number(feeRate) / 10000);
  });

  it("UserTransfer", async () => {
    let beforeChannel = await l2.getChannelInfo(userAddress, token);
    console.log("beforeChannel", beforeChannel);
    let beforeFeeProof = await appPN.methods.feeProofMap(token).call();

    let res = await userTransfer(
      userAddress,
      cpProvider.address,
      depositAmount / 10,
      token,
      userPrivateKey
    );

    await Common.Sleep(sleepInterval);
    let afterChannel = await l2.getChannelInfo(userAddress, token);
    console.log("afterChannel", afterChannel);
    let afterFeeProof = await appPN.methods.feeProofMap(token).call();

    expect(afterChannel.providerBalance).toBe(
      Number(beforeChannel.providerBalance) + depositAmount / 10 + ""
    );

    expect(afterFeeProof.amount).toBe(
      Number(beforeFeeProof.amount) +
        ((depositAmount / 10) * feeRate) / 10000 +
        ""
    );
  });

  it("Transfer", async () => {
    let channelInfo = await l2.getChannelInfo(userAddress, token);
    let transferAmount = Number(channelInfo.providerBalance) / 2;
    let res = await l2.transfer(userAddress, transferAmount, token);
    await Common.Sleep(sleepInterval);
    let afterChannelInfo = await l2.getChannelInfo(userAddress, token);
    expect(afterChannelInfo.providerBalance).toBe(transferAmount + "");
  });

  it("regulatorWithdraw", async () => {
    let res = await regulatorWithdraw(token, regulatorPrivateKey);
  });
});
