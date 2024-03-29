import { SESSION_EVENTS } from "../listener/session_events";
const Web3 = require("web3");
import { Contract } from "web3/node_modules/web3-eth-contract";
import CITASDK from "@cryptape/cita-sdk";
import { ERC20ABI, ADDRESS_ZERO, CHANNEL_STATUS, TYPED_DATA, L2_CB, L2_EVENT, PN, SESSION_STATUS, CHANNEL_SETTLE_WINDOW } from "../conf/contract";
import HttpWatcher from "../listener/listener";
import { ETH_EVENTS } from "../listener/eth_events";
import { CITA_EVENTS } from "../listener/cita_events";
import { Common } from "./common";
import { signHash } from "./sign";
import { Session } from "./session";
import { logger, setLogger } from "./mylog";
import * as rlp from "rlp";
import * as AsyncLock from "async-lock";

export let debug: boolean;
export let CITA: any;
export let cpProvider: any;
export let web3: any;
export let ethChainId: number;
export let ethPN: Contract;
export let appPN: Contract;
export let ERC20: Contract;
export let sessionPN: Contract;
export let callbacks: Map<L2_EVENT, L2_CB>;

export class SDK {
  public static instance: SDK;

  // 私有函数，不允许外部使用 new函数 创建
  private constructor() {
    debug = true;
    setLogger();

    this.channelTransferLock = new AsyncLock();
  }

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

  private channelTransferLock: AsyncLock;

  /**
   * 初始化 SDK
   *
   * @param cpPrivateKey      string
   * @param ethRpcUrl      string
   * @param ethPaymentNetwork       PN
   * @param appRpcUrl         string
   * @param appPaymentNetwork  PN
   * @param sessionPayNetwork PN
   * @param enableListener boolean if start watch blockchain
   * @constructor
   */
  async init(cpPrivateKey: string, ethRpcUrl: string, ethPaymentNetwork: PN, appRpcUrl: string, appPaymentNetwork: PN, sessionPayNetwork: PN, enableListener: boolean = true) {
    logger.debug(
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

    ethPN = new Contract(web3.currentProvider, Common.Abi2JsonInterface(ethPaymentNetwork.abi), ethPaymentNetwork.address);
    appPN = new CITA.base.Contract(Common.Abi2JsonInterface(appPaymentNetwork.abi), appPaymentNetwork.address);

    ethPN.options.address = ethPaymentNetwork.address;
    appPN.options.address = appPaymentNetwork.address;

    ethChainId = await web3.eth.net.getId();
    TYPED_DATA.domain.verifyingContract = ethPN.options.address;
    TYPED_DATA.domain.chainId = ethChainId;

    ERC20 = new Contract(web3.currentProvider, Common.Abi2JsonInterface(ERC20ABI));

    sessionPN = new CITA.base.Contract(Common.Abi2JsonInterface(sessionPayNetwork.abi), sessionPayNetwork.address);

    cpProvider = CITA.base.accounts.privateKeyToAccount(cpPrivateKey);

    callbacks = new Map<L2_EVENT, L2_CB>();

    // 私钥错误, 不进行监听
    if (cpProvider.address && enableListener) {
      this.initListeners();
    }
  }

  /**
   * set log switch
   *
   * @param debugFlag  if set true, will set log on.
   */
  setDebug(debugFlag: boolean) {
    debug = debugFlag;
    setLogger();
  }

  /**
   * set logger for server sdk
   *
   * @param logger logger
   */
  setLogger(logger: any) {
    setLogger(logger);
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
    logger.debug("start deposit with params: amount: [%s], token: [%s]", amount, token);

    let amountBN = web3.utils.toBN(amount).toString();
    let data = ethPN.methods.providerDeposit(token, amountBN).encodeABI();

    // 其它token
    if (token !== ADDRESS_ZERO) {
      // 授权合约能从账户扣token
      let erc20Data = ERC20.methods.approve(ethPN.options.address, amountBN).encodeABI();

      // 发送ERC20交易
      await Common.SendEthTransaction(cpProvider.address, token, 0, erc20Data, cpProvider.privateKey);

      // 发送ETH交易
      return await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, data, cpProvider.privateKey);
    } else {
      // 发送ETH交易
      return await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, amountBN, data, cpProvider.privateKey);
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
    logger.debug("start withdraw with params: amount: [%s], token: [%s]", amount, token);

    const { toBN } = web3.utils;

    let amountBN = toBN(amount);

    let [
      { providerOnchainBalance, providerBalance, providerWithdraw }
      // ethProviderBalance
    ] = await Promise.all([
      appPN.methods.paymentNetworkMap(token).call()
      // ethPN.methods.providerBalance(token).call()
    ]);

    logger.debug(
      "providerOnchainBalance:[%s], providerBalance:[%s], ethProviderBalance:[%s]",
      providerOnchainBalance,
      providerBalance
      // ethProviderBalance
    );

    let onChainBalanceBN = toBN(providerOnchainBalance);
    let balanceBN = toBN(providerBalance);
    let totalWithdrawBN = toBN(providerWithdraw);

    // 余额检测 (BN 计算)
    if (amountBN.gt(onChainBalanceBN)) {
      throw new Error(`withdraw amount[${amountBN.toString()}] great than onchain balance[${onChainBalanceBN.toString()}]`);
    }

    totalWithdrawBN = totalWithdrawBN.add(amountBN);

    // ETH lastCommitBlock
    let lastCommitBlock = await Common.GetLastCommitBlock();

    // 发送交易 到 AppChain
    return await Common.SendAppChainTX(
      appPN.methods.providerProposeWithdraw(token, totalWithdrawBN.toString(), lastCommitBlock),
      cpProvider.address,
      cpProvider.privateKey,
      "appPN.methods.providerProposeWithdraw"
    );

    // 等待 ProviderProposeWithdraw 事件回调
  }

  /**
   * open a channel for user if there is no channel
   *
   * @param userAddress
   * @param token
   */
  async openChannelForUser(userAddress: string, token: string = ADDRESS_ZERO) {
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }
    if (!web3.utils.isAddress(userAddress)) {
      throw new Error(`token [${userAddress}] is not a valid address`);
    }
    logger.debug("start openChannelForUser with params: user: [%s], token: [%s]", userAddress, token);

    let channelID = await ethPN.methods.getChannelID(userAddress, token).call();
    let channel = await ethPN.methods.channelMap(channelID).call();

    if (Number(channel.status) !== CHANNEL_STATUS.CHANNEL_STATUS_INIT) {
      throw new Error("channel exist, can not be open.");
    }

    let data = ethPN.methods.openChannel(userAddress, ADDRESS_ZERO, CHANNEL_SETTLE_WINDOW, token, "0").encodeABI();

    return await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, "0", data, cpProvider.privateKey);
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
  async rebalance(userAddress: string, amount: number | string, token: string = ADDRESS_ZERO) {
    let { toBN, isAddress, soliditySha3 } = web3.utils;
    if (!isAddress(userAddress)) {
      throw new Error(`userAddress [${userAddress}] is not a valid address`);
    }
    if (!isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }

    logger.debug("start reblance with params: userAddress: [%s], amount: [%s], token: [%s]", userAddress, amount, token);

    // 从 ETH 获取通道信息
    let channelID = await appPN.methods.channelIDMap(userAddress, token).call();
    let channel = await appPN.methods.channelMap(channelID).call();

    // 通道状态异常
    if (Number(channel.status) != CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
      throw new Error("channel status is not open");
    }

    let amountBN = toBN(amount);
    let [{ providerBalance }] = await Promise.all([appPN.methods.paymentNetworkMap(token).call()]);
    let providerBalanceBN = toBN(providerBalance);

    // 获取 ReBalance 数据
    let [{ amount: balance, nonce }] = await Promise.all([appPN.methods.rebalanceProofMap(channelID).call()]);
    // 转换金额 为BN, 便于计算
    let balanceBN = toBN(balance);

    // 总金额检测，判断是否有足够资金
    if (amountBN.sub(balanceBN).gt(providerBalanceBN)) {
      return false;
    }

    // 计算 ReBalance amount
    let reBalanceAmountBN = balanceBN.add(amountBN).toString();

    // 计算 NONCE
    nonce = toBN(nonce)
      .add(toBN(1))
      .toString();

    let flag = soliditySha3({ v: "rebalanceIn", t: "string" });

    // CP 签名
    let messageHash = soliditySha3(
      { v: ethPN.options.address, t: "address" },
      { v: flag, t: "bytes32" },
      { v: channelID, t: "bytes32" },
      { v: reBalanceAmountBN, t: "uint256" },
      { v: nonce, t: "uint256" }
    );

    // 进行签名
    let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);

    // 向 appChain 提交 ReBalance 数据
    let res = await Common.SendAppChainTX(
      appPN.methods.proposeRebalance(channelID, reBalanceAmountBN, nonce, signature),
      cpProvider.address,
      cpProvider.privateKey,
      "appPN.methods.proposeRebalance"
    );

    let repeatTime = 0;
    while (repeatTime < 10) {
      let newRebalanceProof = await appPN.methods.rebalanceProofMap(channelID).call();
      if (newRebalanceProof.nonce === nonce) {
        logger.info("Rebalance break loop ", repeatTime);
        break;
      }
      await Common.Sleep(1000);
      repeatTime++;
    }

    return res;

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

    logger.debug("start kickuser with params: userAddress: [%s], token: [%s]", userAddress, token);
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
      { amount: inAmount, nonce: inNonce, regulatorSignature, providerSignature }
    ] = await Promise.all([appPN.methods.balanceProofMap(channelID, cpProvider.address).call(), appPN.methods.rebalanceProofMap(channelID).call()]);

    partnerSignature = partnerSignature || "0x0";
    regulatorSignature = regulatorSignature || "0x0";
    providerSignature = providerSignature || "0x0";

    logger.debug(
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
      .closeChannel(channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, providerSignature)
      .encodeABI();

    // 发送交易
    return await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, data, cpProvider.privateKey);
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
  async transfer(to: string, amount: number | string, token: string = ADDRESS_ZERO) {
    if (!web3.utils.isAddress(to)) {
      throw new Error(`to [${to}] is not a valid address`);
    }
    if (!web3.utils.isAddress(token)) {
      throw new Error(`token [${token}] is not a valid address`);
    }
    logger.debug("Transfer start execute with params: to: [%s], amount: [%s], token: [%s]", to, amount, token);
    let channelID = await appPN.methods.channelIDMap(to, token).call();
    return this.channelTransferLock.acquire(channelID, async done => {
      try {
        let result = await this.doTransfer(channelID, to, amount, token);
        done(null, result);
      } catch (err) {
        done(err, null);
      }
    });
  }

  private async doTransfer(channelID: string, to: string, amount: number | string, token: string = ADDRESS_ZERO) {
    let { toBN } = web3.utils;
    // 获取通道id

    // // 通道状态异常
    // if (Number(channel.status) != CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
    //   throw new Error("channel status is not open");
    // }
    let amountBN = toBN(amount);
    await this.checkBalance(to, amountBN.toString(), token, true);

    // 金额转成BN
    let [{ balance, nonce, additionalHash }] = await Promise.all([appPN.methods.balanceProofMap(channelID, to).call()]);

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
    let res = await Common.SendAppChainTX(
      appPN.methods.transfer(to, channelID, assetAmountBN, nonce, additionalHash, signature),
      cpProvider.address,
      cpProvider.privateKey,
      "appPN.methods.transfer"
    );
    let repeatTime = 0;
    while (repeatTime < 10) {
      let [{ nonce: newNonce }] = await Promise.all([appPN.methods.balanceProofMap(channelID, to).call()]);
      if (newNonce === nonce) {
        logger.info("Transfer break loop", repeatTime);
        break;
      }
      repeatTime++;
      await Common.Sleep(1000);
    }
    return res;
  }

  /**
   * 测试启动session
   *
   * @param sessionID
   * @param game
   * @param customData
   * @constructor
   */
  async startSession(sessionID: string, game: string, userList: string[], customData: any) {
    logger.debug("start session with params: sessionID: [%s], game: [%s], userList: [%o], customData: [%s]", sessionID, game, userList, customData);
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

    // let session = await Session.GetSession(sessionID);
    // if (Number(session.status) !== SESSION_STATUS.SESSION_STATUS_OPEN) {
    //   throw new Error(`session is not open now. status = [${session.status}]`);
    // }

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
    logger.debug(
      "start sendmessage with params: sessionID: [%s], to: [%s], type: [%s], content: [%s], amount: [%s], token: [%s]",
      sessionID,
      to,
      type,
      content,
      amount,
      token
    );

    if (await Session.isExists(sessionID)) {
      let channelID = "0x0000000000000000000000000000000000000000000000000000000000000000";

      if (Number(amount) > 0) {
        channelID = await appPN.methods.channelIDMap(to, token).call();

        return this.channelTransferLock.acquire(channelID, async done => {
          try {
            let result = await this.doSendMessage(channelID, sessionID, to, type, content, amount, token);
            done(null, result);
          } catch (err) {
            done(err, null);
          }
        });
      } else {
        return await this.doSendMessage(channelID, sessionID, to, type, content, amount, token);
      }
    } else {
      throw new Error("Session is not open");
    }
  }

  private async doSendMessage(
    channelID: string,
    sessionID: string,
    to: string,
    type: number,
    content: string,
    amount: string = "0",
    token: string = ADDRESS_ZERO
  ): Promise<string> {
    let from = cpProvider.address;
    let messageHash = web3.utils.soliditySha3(
      { t: "address", v: from },
      { t: "address", v: to },
      { t: "bytes32", v: sessionID },
      { t: "uint8", v: type },
      { t: "bytes", v: content }
    );
    let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);
    let { rlpencode: transferData, paymentData } = await this.buildTransferData(channelID, to, amount, token, messageHash);
    let res = await Session.SendSessionMessage(
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
    if (Number(amount) === 0) {
      return res;
    }

    let repeatTime = 0;
    while (repeatTime < 10) {
      let [{ nonce: newNonce }] = await Promise.all([appPN.methods.balanceProofMap(channelID, to).call()]);
      if (newNonce === paymentData.nonce) {
        logger.info("SendMessage break loop", repeatTime);
        break;
      }
      repeatTime++;
      await Common.Sleep(1000);
    }
    return res;
  }
  async closeSession(sessionID: string) {
    logger.debug("start CloseSession, params: sessionID: [%s]", sessionID);
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
      { userCount, userTotalDeposit, userTotalWithdraw, providerDeposit, providerWithdraw, providerBalance, providerOnchainBalance }
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
    let channelID = await appPN.methods.channelIDMap(userAddress, token).call();

    // 通道未开通检测
    if (!channelID) {
      return {
        channel: { channelID }
      };
    }

    // 获取通道信息
    let channel = await appPN.methods.channelMap(channelID).call();
    channel.channelID = channelID;
    if (Number(channel.status) === CHANNEL_STATUS.CHANNEL_STATUS_SETTLE) {
      channel.userBalance = "0";
    }
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
      this.ethWatcher = new HttpWatcher(web3.eth, this.ethRpcUrl, 5000, ethWatchList);
      this.ethWatcher.start();
    } catch (err) {
      logger.error("ethWatcher err: ", err);
    }

    //before start new watcher, stop the old watcher
    try {
      this.appWatcher && this.appWatcher.stop();

      let appWatchList = [{ contract: appPN, listener: CITA_EVENTS }, { contract: sessionPN, listener: SESSION_EVENTS }];
      this.appWatcher = new HttpWatcher(CITA.base, this.appRpcUrl, 1000, appWatchList, 0);
      this.appWatcher.start();
    } catch (err) {
      logger.error("appWatcher err: ", err);
    }
  }

  /**
   * check balance is great than transfer amount. If need Rebalance, rebalance in the enough assets
   *
   * @param to
   * @param amount
   * @param token
   * @param needRebalance
   */
  private async checkBalance(to: any, amount: string, token: string, needRebalance: boolean) {
    let { toBN } = web3.utils;
    // 获取通道id
    let channelID = await appPN.methods.channelIDMap(to, token).call();
    let channel = await appPN.methods.channelMap(channelID).call();

    // 通道状态异常
    if (Number(channel.status) != CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
      throw new Error("channel status is not open");
    }

    let balanceBN = toBN(channel.providerBalance);
    let amountBN = toBN(amount);
    if (balanceBN.gte(amountBN)) {
      return;
    }
    if (!needRebalance) {
      throw new Error(`providerBalance[${channel.providerBalance}] is less than sendAmount[${amount}]`);
    }

    await this.rebalance(to, amountBN.sub(balanceBN).toString(), token);
    // TODO watch event to make sure rebalance is confirmed by regulator
    return true;
  }

  private async buildTransferData(channelID: string, user: string, amount: string, token: string, messageHash: string): Promise<any> {
    let { hexToBytes, toHex, soliditySha3, toBN } = web3.utils;
    let balance = "0";
    let nonce = "0";
    let additionalHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    let paymentSignature = "0x0";

    if (Number(amount) > 0) {
      channelID = await appPN.methods.channelIDMap(user, token).call();

      await this.checkBalance(user, amount, token, true);

      // build transfer message
      // get balance proof from eth contract
      let balanceProof = await appPN.methods.balanceProofMap(channelID, user).call();

      balance = toBN(amount)
        .add(toBN(balanceProof.balance))
        .toString();
      nonce = toBN(balanceProof.nonce)
        .add(toBN(1))
        .toString();
      additionalHash = soliditySha3({ t: "bytes32", v: messageHash }, { t: "uint256", v: amount });

      // sign data with typed data v3
      let messageHash2 = signHash({
        channelID: channelID,
        balance: balance,
        nonce: nonce,
        additionalHash: additionalHash
      });
      paymentSignature = Common.SignatureToHex(messageHash2, cpProvider.privateKey);
    }

    let paymentData = [channelID, toHex(balance), toHex(nonce), toHex(amount), additionalHash, paymentSignature];
    logger.info("paymentData: ", JSON.stringify(paymentData));
    // rlpencode is encoded data
    let rlpencode = "0x" + rlp.encode(paymentData).toString("hex");

    logger.info("rlpencode is", rlpencode);

    return { rlpencode, paymentData: { channelID, balance, nonce } };
  }
}
