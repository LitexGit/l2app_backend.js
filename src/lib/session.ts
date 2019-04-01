import { Common } from "./common";
import { CITA, appPN, sessionPN, cpProvider, web3 } from "./server";
import { SESSION_STATUS, SessionData, PaymentData } from "../conf/contract";

export class Session {
  public id: string;
  public status: SESSION_STATUS;

  public game: string;
  public customData: string;

  // public callbacks: Map<string, (err: Error, res: any) => void>;

  static sessionList: Map<string, Session> = new Map<string, Session>();

  private constructor(sessionID: string) {
    this.id = sessionID;
  }

  /**
   * 初始化session
   *
   * @constructor
   */
  static async InitSession(
    sessionID: string,
    game: string,
    userList: string[],
    customData: any
  ) {
    // 发送交易 到 AppChain
    return await Common.SendAppChainTX(
      sessionPN.methods.initSession(
        sessionID,
        cpProvider.address,
        game,
        userList,
        appPN.options.address,
        web3.utils.toHex(customData)
      )
    );
  }

  /**
   * 用户加入session
   *
   * @param sessionID string sessionID
   * @param user      string 用户地址
   *
   * @return void
   */
  static async JoinSession(sessionID: string, user: string) {
    // 发送交易 到 AppChain
    return await Common.SendAppChainTX(
      sessionPN.methods.joinSession(sessionID, user)
    );
  }

  /**
   * 发送session消息
   *
   *
   */
  static async SendSessionMessage(
    from: string,
    to: string,
    sessionData: SessionData,
    paymentData: PaymentData
  ) {
    console.log(
      "sendMessage params: from: [%s], to: [%s], sessionData.sessionID: [%s], sessionData.mType: [%s], sessionData.content: [%s], sessionData.signature: [%s], paymentData.transferData: [%o], paymentData.paymentSignature:[%s] ",
      from,
      to,
      sessionData.sessionID,
      sessionData.mType,
      sessionData.content,
      sessionData.signature,
      paymentData.transferData,
      paymentData.paymentSignature
    );

    // 发送交易 到 AppChain
    return await Common.SendAppChainTX(
      sessionPN.methods.sendMessage(
        from,
        to,
        sessionData.sessionID,
        sessionData.mType,
        sessionData.content,
        sessionData.signature,
        paymentData.transferData,
        paymentData.paymentSignature
      )
    );
  }

  /**
   * 关闭session
   *
   * @constructor
   */
  static async CloseSession(sessionID: string) {
    return await Common.SendAppChainTX(
      sessionPN.methods.closeSession(sessionID)
    );
  }

  // async onMessage(
  //     callback: (error: Error, res: any) => void
  // ) {
  //     // this.callbacks.set("message", callback);
  // }

  /* Query Session Infos */

  /**
   * 根据SessionID 获取session信息
   *
   * @param sessionID string sessionID
   *
   * @return 返回 session 信息
   */
  static async GetSession(sessionID: string, fromLine: boolean = false) {
    if (fromLine) {
      return await sessionPN.methods.sessions(sessionID).call();
    }

    let session = Session.sessionList.get(sessionID);
    if (!session) {
      let sessionExist = await Session.isExists(sessionID);
      if (!sessionExist) {
        return null;
      }

      session = new Session(sessionID);
      await session.initialize();
      Session.sessionList.set(sessionID, session);
    }

    return session;
  }

  static async isExists(sessionID: string): Promise<boolean> {
    let session = await sessionPN.methods.sessions(sessionID).call();
    if (Number(session.status) === SESSION_STATUS.SESSION_STATUS_INIT) {
      return false;
    }

    return true;
  }

  private async initialize() {
    // query session by _sessionPN
    let { status, game, data } = await sessionPN.methods
      .sessions(this.id)
      .call();
    this.status = Number(status);
    this.game = game;
    this.customData = data;

    // this.callbacks = this.callbacks || new Map<string, () => void>();
  }
}
