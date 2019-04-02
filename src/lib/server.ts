import { SESSION_EVENTS } from "../listener/session_events";
const Web3 = require("web3");
import { Contract } from "web3/node_modules/web3-eth-contract";
import CITASDK from "@cryptape/cita-sdk";
import {
  ERC20ABI,
  ADDRESS_ZERO,
  CHANNEL_STATUS,
  TYPED_DATA,
  L2_CB,
  L2_EVENT,
  PN,
  SESSION_STATUS
} from "../conf/contract";
import HttpWatcher from "../listener/listener";
import { ETH_EVENTS } from "../listener/eth_events";
import { CITA_EVENTS } from "../listener/cita_events";
import { Common } from "./common";
import { signHash } from "./sign";
import { Session } from "./session";
import * as protobuf from "protobufjs";
protobuf.common("google/protobuf/descriptor.proto", {});

export let CITA: any;
export let cpProvider: any;
export let web3: any;
export let ethPN: Contract;
export let appPN: Contract;
export let ERC20: Contract;
export let sessionPN: Contract;
export let callbacks: Map<L2_EVENT, L2_CB>;

export class SDK {
  public static instance: SDK;

  // 私有函数，不允许外部使用 new函数 创建
  private constructor() {}

  // 单例模式 返回SDK对象
  public static GetInstance(): SDK {
    if (this.instance === undefined) {
      this.instance = new SDK();
    }

    return this.instance;
  }

  private ethWatcher: HttpWatcher;
  private appWatcher: HttpWatcher;

  private appRpcUrl: string;
  private ethRpcUrl: string;

  /**
   * 初始化 SDK
   *
   * @param cpPrivateKey      string
   * @param ethRpcUrl      string
   * @param ethPaymentNetwork       PN
   * @param appRpcUrl         string
   * @param appPaymentNetwork  PN
   * @param sessionPayNetwork PN
   * @constructor
   */
  async init(
    cpPrivateKey: string,
    ethRpcUrl: string,
    ethPaymentNetwork: PN,
    appRpcUrl: string,
    appPaymentNetwork: PN,
    sessionPayNetwork: PN
  ) {
    console.log(
      "L2 server sdk init start with params: ethRpcUrl: [%s], ethPaymentNetwork: [%o], appRpcUrl: [%s], appPaymentNetwork: [%o]",
      ethRpcUrl,
      ethPaymentNetwork.address,
      appRpcUrl,
      appPaymentNetwork.address
    );
    web3 = new Web3(Web3.givenProvider || ethRpcUrl);

    this.appRpcUrl = appRpcUrl;
    this.ethRpcUrl = ethRpcUrl;

    CITA = CITASDK(appRpcUrl);

    ethPN = new Contract(
      web3.currentProvider,
      Common.Abi2JsonInterface(ethPaymentNetwork.abi),
      ethPaymentNetwork.address
    );
    appPN = new CITA.base.Contract(
      Common.Abi2JsonInterface(appPaymentNetwork.abi),
      appPaymentNetwork.address
    );

    ethPN.options.address = ethPaymentNetwork.address;
    appPN.options.address = appPaymentNetwork.address;

    TYPED_DATA.domain.verifyingContract = ethPaymentNetwork.address;

    ERC20 = new Contract(
      web3.currentProvider,
      Common.Abi2JsonInterface(ERC20ABI)
    );

    sessionPN = new CITA.base.Contract(
      Common.Abi2JsonInterface(sessionPayNetwork.abi),
      sessionPayNetwork.address
    );

    cpProvider = CITA.base.accounts.privateKeyToAccount(cpPrivateKey);

    callbacks = new Map<L2_EVENT, L2_CB>();

    // 私钥错误, 不进行监听
    if (cpProvider.address) {
      this.initListeners();
    }
  }

  /**
   * CP充值
   *
   * @description 调用Eth支付合约的充值接口
   *
   * @param amount   number 存入金额
   * @param token    string token地址，0x0 eth  其它 token
   *
   * @returns string 返回交易hash
   */
  async deposit(amount: number | string, token: string = ADDRESS_ZERO) {
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }
    console.log(
      "start deposit with params: amount: [%s], token: [%s]",
      amount,
      token
    );

    let amountBN = web3.utils.toBN(amount).toString();
    let data = ethPN.methods.providerDeposit(token, amountBN).encodeABI();

    // 其它token
    if (token !== ADDRESS_ZERO) {
      // 授权合约能从账户扣token
      let erc20Data = ERC20.methods
        .approve(ethPN.options.address, amountBN)
        .encodeABI();

      // 发送ERC20交易
      await Common.SendEthTransaction(
        cpProvider.address,
        token,
        0,
        erc20Data,
        cpProvider.privateKey
      );

      // 发送ETH交易
      return await Common.SendEthTransaction(
        cpProvider.address,
        ethPN.options.address,
        0,
        data,
        cpProvider.privateKey
      );
    } else {
      // 发送ETH交易
      return await Common.SendEthTransaction(
        cpProvider.address,
        ethPN.options.address,
        amountBN,
        data,
        cpProvider.privateKey
      );
    }
  }

  /**
   * CP发起提现申请
   *
   * @description 发送提现请求到AppChain上
   *
   * @param amount number  提现金额
   * @param token  string  token地址
   *
   * @returns string 返回交易hash
   */
  async withdraw(amount: number | string, token: string = ADDRESS_ZERO) {
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }
    console.log(
      "start withdraw with params: amount: [%s], token: [%s]",
      amount,
      token
    );

    let amountBN = web3.utils.toBN(amount);

    let [
      { providerOnchainBalance, providerBalance },
      ethProviderBalance
    ] = await Promise.all([
      appPN.methods.paymentNetworkMap(token).call(),
      ethPN.methods.providerBalance(token).call()
    ]);

    console.log(
      "providerOnchainBalance:[%s], providerBalance:[%s], ethProviderBalance:[%s]",
      providerOnchainBalance,
      providerBalance,
      ethProviderBalance
    );

    let onChainBalanceBN = web3.utils.toBN(providerOnchainBalance);
    let balanceBN = web3.utils.toBN(providerBalance);

    // 余额检测 (BN 计算)
    if (amountBN.gt(onChainBalanceBN)) {
      throw new Error(
        `withdraw amount[${amountBN.toString()}] great than onchain balance[${onChainBalanceBN.toString()}]`
      );
    }

    //web3.utils.toBN(amount).gt()
    let balance = web3.utils
      .toBN(providerOnchainBalance)
      .sub(web3.utils.toBN(amount));
    // 余额检测 (BN 计算)
    // if (balance.gt(balanceBN)) {
    //   return false;
    // }

    // ETH lastCommitBlock
    let lastCommitBlock = await Common.GetLastCommitBlock();

    // 发送交易 到 AppChain
    return await Common.SendAppChainTX(
      appPN.methods.providerProposeWithdraw(
        token,
        balance.toString(),
        lastCommitBlock
      ),
      cpProvider.address,
      cpProvider.privateKey
    );

    // 等待 ProviderProposeWithdraw 事件回调
  }

  /**
   * CP ReBalance 操作
   *
   * @description 提交到AppChain的支付合约
   *
   * @param userAddress string 用户地址
   * @param amount    bigint 挪进通道的金额
   * @param token     string token地址
   *
   * @return
   */
  async rebalance(
    userAddress: string,
    amount: number | string,
    token: string = ADDRESS_ZERO
  ) {
    if (!web3.utils.isAddress(userAddress)) {
      throw new Error(`userAddress [${userAddress}] is not a valid address`);
    }
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }

    console.log(
      "start reblance with params: userAddress: [%s], amount: [%s], token: [%s]",
      userAddress,
      amount,
      token
    );

    // 从 ETH 获取通道信息
    let channelID = await ethPN.methods.getChannelID(userAddress, token).call();
    let channel = await appPN.methods.channelMap(channelID).call();

    // 通道状态异常
    if (Number(channel.status) != CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
      throw new Error("channel status is not open");
    }

    let amountBN = web3.utils.toBN(amount);
    let [{ providerBalance }] = await Promise.all([
      appPN.methods.paymentNetworkMap(token).call()
    ]);
    let providerBalanceBN = web3.utils.toBN(providerBalance);

    // 获取 ReBalance 数据
    let [{ amount: balance, nonce }] = await Promise.all([
      appPN.methods.rebalanceProofMap(channelID).call()
    ]);
    // 转换金额 为BN, 便于计算
    let balanceBN = web3.utils.toBN(balance);

    // 总金额检测，判断是否有足够资金
    if (amountBN.sub(balanceBN).gt(providerBalanceBN)) {
      return false;
    }

    // 计算 ReBalance amount
    let reBalanceAmountBN = balanceBN.add(amountBN).toString();

    // 计算 NONCE
    nonce = web3.utils
      .toBN(nonce)
      .add(web3.utils.toBN(1))
      .toString();

    // CP 签名
    let messageHash = web3.utils.soliditySha3(
      { v: ethPN.options.address, t: "address" },
      { v: channelID, t: "bytes32" },
      { v: reBalanceAmountBN, t: "uint256" },
      { v: nonce, t: "uint256" }
    );

    // 进行签名
    let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);

    // 向 appChain 提交 ReBalance 数据
    return await Common.SendAppChainTX(
      appPN.methods.proposeRebalance(
        channelID,
        reBalanceAmountBN,
        nonce,
        signature
      ),
      cpProvider.address,
      cpProvider.privateKey
    );

    // 等待 ConfirmRebalance 事件回调
  }

  /**
   * cp 关闭通道
   *
   * @param token
   * @param userAddress
   * @constructor
   */
  async kickUser(userAddress: string, token: string = ADDRESS_ZERO) {
    if (!web3.utils.isAddress(userAddress)) {
      throw new Error(`userAddress [${userAddress}] is not a valid address`);
    }
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }

    console.log(
      "start kickuser with params: userAddress: [%s], token: [%s]",
      userAddress,
      token
    );
    // 从 ETH 获取通道信息
    let channelID = await ethPN.methods.getChannelID(userAddress, token).call();
    let channel = await appPN.methods.channelMap(channelID).call();

    // 通道状态异常
    if (Number(channel.status) != CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
      throw new Error("channel status is not open");
    }

    // AppChain 获取缓存数据
    let [
      { balance, nonce, additionalHash, partnerSignature },
      {
        amount: inAmount,
        nonce: inNonce,
        regulatorSignature,
        providerSignature
      }
    ] = await Promise.all([
      appPN.methods.balanceProofMap(channelID, cpProvider.address).call(),
      appPN.methods.rebalanceProofMap(channelID).call()
    ]);

    partnerSignature = partnerSignature || "0x0";
    regulatorSignature = regulatorSignature || "0x0";
    providerSignature = providerSignature || "0x0";

    console.log(
      "closeChannel params:  channelID:[%s], balance:[%s], nonce:[%s], additionalHash:[%s], partnerSignature:[%s], inAmount:[%s], inNonce:[%s], regulatorSignature:[%s], inProviderSignature:[%s]",
      channelID,
      balance,
      nonce,
      additionalHash,
      partnerSignature,
      inAmount,
      inNonce,
      regulatorSignature,
      providerSignature
    );
    // 生成数据
    let data = await ethPN.methods
      .closeChannel(
        channelID,
        balance,
        nonce,
        additionalHash,
        partnerSignature,
        inAmount,
        inNonce,
        regulatorSignature,
        providerSignature
      )
      .encodeABI();

    // 发送交易
    return await Common.SendEthTransaction(
      cpProvider.address,
      ethPN.options.address,
      0,
      data,
      cpProvider.privateKey
    );
  }

  /**
   * cp 转账操作
   *
   * @description 提交到AppChain的支付合约
   *
   * @param to     接收方地址
   * @param amount 转账金额
   * @param token  token地址
   *
   * @constructor
   */
  async transfer(
    to: string,
    amount: number | string,
    token: string = ADDRESS_ZERO
  ) {
    if (!web3.utils.isAddress(to)) {
      throw new Error(`to [${to}] is not a valid address`);
    }
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }
    console.log(
      "Transfer start execute with params: to: [%s], amount: [%s], token: [%s]",
      to,
      amount,
      token
    );

    let { toBN } = web3.utils;
    // 获取通道id
    let channelID = await ethPN.methods.getChannelID(to, token).call();
    let channel = await appPN.methods.channelMap(channelID).call();

    // 通道状态异常
    if (Number(channel.status) != CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
      throw new Error("channel status is not open");
    }

    // 金额转成BN
    let amountBN = toBN(amount);
    let [{ balance, nonce, additionalHash }] = await Promise.all([
      appPN.methods.balanceProofMap(channelID, to).call()
    ]);

    let balanceBN = toBN(balance);
    let assetAmountBN = amountBN.add(balanceBN).toString();
    nonce = toBN(nonce)
      .add(toBN(1))
      .toString();

    additionalHash = "0x0";
    let messageHash = signHash({
      channelID: channelID,
      balance: assetAmountBN,
      nonce: nonce,
      additionalHash: additionalHash
    });

    let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);
    return await Common.SendAppChainTX(
      appPN.methods.transfer(
        to,
        channelID,
        assetAmountBN,
        nonce,
        additionalHash,
        signature
      ),
      cpProvider.address,
      cpProvider.privateKey
    );
  }

  /**
   * 测试启动session
   *
   * @param sessionID
   * @param game
   * @param customData
   * @constructor
   */
  async startSession(
    sessionID: string,
    game: string,
    userList: string[],
    customData: any
  ) {
    console.log(
      "start session with params: sessionID: [%s], game: [%s], userList: [%o], customData: [%s]",
      sessionID,
      game,
      userList,
      customData
    );
    if (await Session.isExists(sessionID)) {
      throw new Error("session is already exist, can not start again");
    } else {
      await Session.InitSession(sessionID, game, userList, customData);
    }
  }

  /**
   * make a user join in a session
   *
   * @param sessionID
   * @param user user's eth address
   *
   * @returns if success, return join session tx hash, else throw err
   */
  async joinSession(sessionID: string, user: string): Promise<string> {
    if (!web3.utils.isAddress(user)) {
      throw new Error(`user[${user}] is not valid address`);
    }

    let session = await Session.GetSession(sessionID);
    if (Number(session.status) !== SESSION_STATUS.SESSION_STATUS_OPEN) {
      throw new Error(`session is not open now. status = [${session.status}]`);
    }

    return await Session.JoinSession(sessionID, user);
  }

  /**
   * get a session instance by sessionID
   *
   * @param sessionID
   *
   * @returns session instance
   */
  async getSession(sessionID: string): Promise<Session> {
    let count_down = 10;

    let session: Session;
    for (let i = 0; i < count_down; i++) {
      session = await Session.GetSession(sessionID);
      if (session) {
        break;
      }

      await Common.Sleep(1000);
    }

    if (!session) {
      throw new Error("session not found");
    }

    return session;
  }

  /**
   * send a session message to user
   *
   * @param sessionID
   * @param to   receiver address of the message
   * @param type  type of encoding
   * @param content encoded message content
   * @param amount OPTIONAL transfer token amount, default: '0'
   * @param token  OPTIONAL transfer token address, default: '0x0000000000000000000000000000000000000000'
   */
  async sendMessage(
    sessionID: string,
    to: string,
    type: number,
    content: string,
    amount: string = "0",
    token: string = ADDRESS_ZERO
  ): Promise<string> {
    console.log(
      "start sendmessage with params: sessionID: [%s], to: [%s], type: [%s], content: [%s], amount: [%s], token: [%s]",
      sessionID,
      to,
      type,
      content,
      amount,
      token
    );

    if (await Session.isExists(sessionID)) {
      let from = cpProvider.address;

      let messageHash = web3.utils.soliditySha3(
        { t: "address", v: from },
        { t: "address", v: to },
        { t: "bytes32", v: sessionID },
        { t: "uint8", v: type },
        { t: "bytes", v: content }
      );
      let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);

      let transferData = await this.buildTransferData(
        to,
        amount,
        token,
        messageHash
      );

      return Session.SendSessionMessage(
        cpProvider.address,
        to,
        {
          sessionID,
          mType: type,
          content,
          signature
        },
        transferData
      );
    } else {
      throw new Error("Session is not open");
    }
  }

  async closeSession(sessionID: string) {
    console.log("start CloseSession, params: sessionID: [%s]", sessionID);
    if (await Session.isExists(sessionID)) {
      return await Session.CloseSession(sessionID);
    } else {
      throw new Error("session is not exist now");
    }
  }

  /**
   * 外部设置事件回调
   * @param event 外部事件名
   * @param callback 外部设置的回调
   */
  on(event: L2_EVENT, callback: L2_CB) {
    callbacks.set(event, callback);
  }

  /* 查询接口部分 */

  /**
   * 获取支付通道信息
   *
   * @param token token地址
   *
   * @return json 支付通道信息
   */
  async getPaymentNetwork(token: string = ADDRESS_ZERO) {
    // 获取通道 可用金额
    let [
      {
        userCount,
        userTotalDeposit,
        userTotalWithdraw,
        providerDeposit,
        providerWithdraw,
        providerBalance,
        providerOnchainBalance
      }
    ] = await Promise.all([appPN.methods.paymentNetworkMap(token).call()]);

    return {
      userCount: userCount,
      userTotalDeposit: userTotalDeposit,
      userTotalWithdraw: userTotalWithdraw,
      providerDeposit: providerDeposit,
      providerWithdraw: providerWithdraw,
      providerBalance: providerBalance,
      providerOnChainBalance: providerOnchainBalance
    };
  }

  async getTokeFeeRate(token: string = ADDRESS_ZERO) {
    let feeRate = await appPN.methods.feeRateMap(token).call();
    return Number(feeRate) / 10000;
  }

  async getChannelInfo(userAddress: string, token: string = ADDRESS_ZERO) {
    // 从 ETH 获取通道信息
    let channelID = await ethPN.methods.getChannelID(userAddress, token).call();

    // 通道未开通检测
    if (!channelID) {
      return {
        channel: { channelID }
      };
    }

    // 获取通道信息
    let channel = await appPN.methods.channelMap(channelID).call();
    channel.channelID = channelID;
    return channel;
  }

  async getAllTXs(token: string = ADDRESS_ZERO): Promise<any> {
    let [inTXs, outTXs] = await Promise.all([
      appPN.getPastEvents("Transfer", { filter: { to: cpProvider.address } }),
      appPN.getPastEvents("Transfer", { filter: { from: cpProvider.address } })
    ]);

    const cmpNonce = (key: string) => {
      return (a: any, b: any) => {
        return a[key] - b[key];
      };
    };

    let lastBalance = web3.utils.toBN(0);
    const getTX = (tx: any) => {
      let { balance, ...rest } = tx.returnValues;
      balance = web3.utils.toBN(balance);
      let amount = balance.sub(lastBalance).toString();
      lastBalance = balance;

      return {
        id: tx.transactionHash,
        amount,
        ...rest
      };
    };

    inTXs = inTXs.sort(cmpNonce("nonce")).map(tx => getTX(tx));
    outTXs = outTXs.sort(cmpNonce("nonce")).map(tx => getTX(tx));

    return { in: inTXs, out: outTXs };
  }

  /**
   * 根据SessionID 获取session的所有消息(数组)
   *
   * @param sessionID string sessionID
   *
   * @return
   */
  async getMessagesBySessionID(sessionID: string) {
    return await sessionPN.methods.exportSession(sessionID).call();
  }

  /**
   * 根据SessionID 获取session的所有的玩家(数组)
   *
   * @param sessionID string sessionID
   *
   * @return
   */
  async getPlayersBySessionID(sessionID: string) {
    return await sessionPN.methods.exportPlayer(sessionID).call();
  }

  /**
   * export session message as bytes
   *
   * @param sessionID
   *
   */
  async exportSessionBytes(sessionID: string) {
    return await sessionPN.methods.exportSessionBytes(sessionID).call();
  }

  private async initListeners() {
    //before start new watcher, stop the old watcher
    try {
      this.ethWatcher && this.ethWatcher.stop();

      let ethWatchList = [{ contract: ethPN, listener: ETH_EVENTS }];
      this.ethWatcher = new HttpWatcher(
        web3.eth,
        this.ethRpcUrl,
        5000,
        ethWatchList
      );
      this.ethWatcher.start();
    } catch (err) {
      console.log("ethWatcher err: ", err);
    }

    //before start new watcher, stop the old watcher
    try {
      this.appWatcher && this.appWatcher.stop();

      let appWatchList = [
        { contract: appPN, listener: CITA_EVENTS },
        { contract: sessionPN, listener: SESSION_EVENTS }
      ];
      this.appWatcher = new HttpWatcher(
        CITA.base,
        this.appRpcUrl,
        1000,
        appWatchList
      );
      this.appWatcher.start();
    } catch (err) {
      console.log("appWatcher err: ", err);
    }
  }

  private async buildTransferData(
    user: string,
    amount: string,
    token: string,
    messageHash: string
  ): Promise<any> {
    let { hexToBytes, numberToHex, soliditySha3, toBN } = web3.utils;
    let channelID =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    let balance = "0";
    let nonce = "0";
    let additionalHash =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    let paymentSignature = "0x0";

    if (Number(amount) > 0) {
      channelID = await ethPN.methods.getChannelID(user, token).call();
      let channel = await appPN.methods.channelMap(channelID).call();

      // check channel status
      if (Number(channel.status) !== CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
        throw new Error("app channel status is not open, can not transfer now");
      }
      // check provider's balance is enough
      if (toBN(channel.providerBalance).lt(toBN(amount))) {
        throw new Error("provider's balance is less than transfer amount");
      }

      // build transfer message
      // get balance proof from eth contract
      let balanceProof = await appPN.methods
        .balanceProofMap(channelID, user)
        .call();

      balance = toBN(amount)
        .add(toBN(balanceProof.balance))
        .toString();
      nonce = toBN(balanceProof.nonce)
        .add(toBN(1))
        .toString();
      additionalHash = soliditySha3(
        { t: "uint256", v: amount },
        { t: "bytes32", v: messageHash }
      );

      // sign data with typed data v3
      let messageHash2 = signHash({
        channelID: channelID,
        balance: balance,
        nonce: nonce,
        additionalHash: additionalHash
      });
      paymentSignature = Common.SignatureToHex(
        messageHash2,
        cpProvider.privateKey
      );
    }

    let transferPB = protobuf.Root.fromJSON(require("../conf/transfer.json"));

    // Obtain a message type
    let Transfer = transferPB.lookupType("TransferData.Transfer");

    // Exemplary payload
    let payload = {
      channelID: hexToBytes(channelID),
      balance: hexToBytes(numberToHex(balance)),
      nonce: hexToBytes(numberToHex(nonce)),
      amount: hexToBytes(numberToHex(amount)),
      // balance: [0],
      // nonce: [0],
      // amount: [0],
      additionalHash: hexToBytes(additionalHash)
    };

    // console.log("payload", payload);
    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    let errMsg = Transfer.verify(payload);
    if (errMsg) throw Error(errMsg);
    // Create a new message
    let message = Transfer.create(payload); // or use .fromObject if conversion is necessary
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    let buffer = Transfer.encode(message).finish();
    // console.log("buildTransferData", {
    //   transferData: buffer,
    //   paymentSignature
    // });

    return { transferData: buffer, paymentSignature };
  }
}
