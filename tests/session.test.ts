import { userOpenChannel, initL2, userCloseChannel } from "./test_util";
import { L2 } from "../src/sdk/sdk";
import { config as testConfig } from "./config_test";
import { Common } from "../src/lib/common";
import { web3, cpProvider } from "../src/lib/server";
import { SESSION_STATUS } from "../src/conf/contract";
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

describe("session test", () => {
  let l2: L2;

  let sessionID: string;

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
      userOpenChannel(userAddress, userPrivateKey, depositAmount, token)
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
      watchForceWithdraw
    ]);
  });

  beforeEach(async () => {
    console.log(
      "/************************NEXT IT***********************************/"
    );
    await Common.Sleep(sleepInterval);
  });

  it("ReBalance", async () => {
    let pnInfo = await l2.getPaymentNetwork(token);
    console.log("pnInfo: ", pnInfo);

    let depositAmount = Number(pnInfo.providerBalance) / 10;

    let beforeChannelInfo = await l2.getChannelInfo(userAddress, token);
    console.log("before channel info is ", beforeChannelInfo);

    let res = await l2.rebalance(userAddress, depositAmount, token);
    await Common.Sleep(sleepInterval);
    let afterChannelInfo = await l2.getChannelInfo(userAddress, token);
    console.log("after channel info is ", afterChannelInfo);

    expect(Number(afterChannelInfo.providerBalance)).toBe(
      Number(beforeChannelInfo.providerBalance) + depositAmount
    );
  });

  it("CreateSession", async () => {
    sessionID = web3.utils.sha3("hello world" + new Date().toISOString());
    await l2.startSession(
      sessionID,
      userAddress,
      [userAddress],
      web3.utils.toHex("hello world")
    );
    await Common.Sleep(sleepInterval);

    let session = await l2.getSession(sessionID);
    console.log("session: ", session);
    expect(session.game).toBe(userAddress);
    expect(session.status).toBe(SESSION_STATUS.SESSION_STATUS_OPEN);

    let players = await l2.getPlayersBySessionID(sessionID);
    console.log("players: ", players);
    expect(players.length).toBe(1);
    expect(players[0]).toBe(userAddress);
  });

  it("JoinSession", async () => {
    // let session = await l2.GetSession(sessionID);
    let res = await l2.joinSession(sessionID, cpProvider.address);
    await Common.Sleep(sleepInterval);

    let players = await l2.getPlayersBySessionID(sessionID);
    console.log("players: ", players);
    expect(players.length).toBeGreaterThanOrEqual(1);
    expect(players[players.length - 1]).toBe(cpProvider.address);
  });

  it("SendMessage", async () => {
    // let session = await l2.GetSession(sessionID)
    let messageContent = web3.utils.toHex(
      "hello world" + new Date().toISOString()
    );
    await l2.sendMessage(sessionID, userAddress, 2, messageContent);
    await Common.Sleep(sleepInterval);

    let messages = await l2.getMessagesBySessionID(sessionID);
    console.log("messages: ", messages);
    expect(messages.length).toBeGreaterThanOrEqual(1);
    expect(messages[messages.length - 1].content).toBe(messageContent);
  });

  it("SendMessageWithAsset", async () => {
    let channelInfo = await l2.getChannelInfo(userAddress, token);
    let sendAmount = Number(channelInfo.providerBalance) / 10 + "";
    // let session = await l2.GetSession(sessionID)
    let messageContent = web3.utils.toHex("hello world with money");
    await l2.sendMessage(
      sessionID,
      userAddress,
      3,
      messageContent,
      sendAmount,
      token
    );

    await Common.Sleep(sleepInterval);
    let messages = await l2.getMessagesBySessionID(sessionID);
    console.log("messages: ", messages);
    expect(messages.length).toBeGreaterThanOrEqual(1);
    let lastMessage = messages[messages.length - 1];
    expect(lastMessage.content).toBe(messageContent);
    expect(lastMessage.amount).toBe(sendAmount);

    let afterChannelInfo = await l2.getChannelInfo(userAddress, token);
    expect(afterChannelInfo.providerBalance).toBe(
      Number((channelInfo.providerBalance * 9) / 10) + ""
    );
  });

  it("exportSessionBytes", async () => {
    // for (let i = 0; i < 10; i++) {
    //   let messageContent = web3.utils.toHex(
    //     "hello world" + i + new Date().toISOString()
    //   );
    //   await l2.SendMessage(sessionID, userAddress, 2, messageContent);
    // }
    // await Common.Sleep(sleepInterval * 2);

    let messages = await l2.getMessagesBySessionID(sessionID);
    console.log("messages length", messages.length);
    console.log("messages: ", messages);

    let bytes = await l2.exportSessionBytes(sessionID);
    console.log("export session bytes", bytes);
  });

  it("CloseSession", async () => {
    let res = await l2.closeSession(sessionID);
    await Common.Sleep(sleepInterval);
    await Common.Sleep(sleepInterval);

    let session = await l2.getSession(sessionID);
    console.log("session: ", session);
    expect(session.status).toBe(SESSION_STATUS.SESSION_STATUS_CLOSE);
  });
});
