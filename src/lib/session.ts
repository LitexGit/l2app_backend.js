import { Common } from "./common";
import {CITA, appPN, sessionPN, cpProvider, SessionData, PaymentData, web3, L2_EVENT, L2_CB} from "./server";
import {SESSION_STATUS} from "../conf/contract";

export class Session {

    public id: string;
    public status: SESSION_STATUS;

    public game: string;
    public customData: string;

    public callbacks: Map<string, (err: Error, res: any) => void>;

    static sessionList: Map<string, Session> = new Map<string, Session>();

    private constructor(sessionID: string) {
        this.id = sessionID;
    }

    /**
     * 初始化session
     *
     * @constructor
     */
    static async InitSession(sessionID: string, game: string, customData: any) {
        // 初始化 交易对象
        let tx = await Common.BuildAppChainTX();

        // 发送交易 到 AppChain
        let rs = await sessionPN.methods.initSession(sessionID, cpProvider.address, game, [cpProvider.address], appPN.options.address, web3.utils.toHex(customData)).send(tx);
        if (rs.hash) {
            let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

            if (!receipt.errorMessage) {
                //确认成功
                console.log("send CITA tx success", receipt);
                return 'confirm success'
            } else {
                //确认失败
                return 'confirm fail'
            }
        } else {
            // 提交失败
            return 'send CITA tx fail'
        }
    }

    /**
     * 用户加入session
     *
     * @param sessionID string sessionID
     * @param user      string 用户地址
     *
     * @return void
     */
    async JoinSession(sessionID: string, user: string) {
        // 初始化 交易对象
        let tx = await Common.BuildAppChainTX();

        // 发送交易 到 AppChain
        let rs = await sessionPN.methods.joinSession(sessionID, user).send(tx);
        if (rs.hash) {
            let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

            if (!receipt.errorMessage) {
                //确认成功
                console.log("send CITA tx success", receipt);
                return 'confirm success'
            } else {
                //确认失败
                return 'confirm fail'
            }
        } else {
            // 提交失败
            return 'send CITA tx fail'
        }
    }

    /**
     * 发送session消息
     *
     * @constructor
     */
    async SendSessionMessage(from: string, to: string, sessionData: SessionData, paymentData: PaymentData) {
        // 初始化 交易对象
        let tx = await Common.BuildAppChainTX();

        // 发送交易 到 AppChain
        let rs = await sessionPN.methods.sendMessage(
            from, to,
            sessionData.sessionID, sessionData.mType, sessionData.content, sessionData.signature,
            paymentData.channelID, paymentData.balance, paymentData.nonce, paymentData.additionalHash, paymentData.paymentSignature
        ).send(tx);
        if (rs.hash) {
            let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

            if (!receipt.errorMessage) {
                //确认成功
                console.log("send CITA tx success", receipt);
                return 'confirm success'
            } else {
                //确认失败
                return 'confirm fail'
            }
        } else {
            // 提交失败
            return 'send CITA tx fail'
        }
    }

    /**
     * 关闭session
     *
     * @constructor
     */
    static async CloseSession(sessionID: string) {
        // 初始化 交易对象
        let tx = await Common.BuildAppChainTX();

        // 发送交易 到 AppChain
        let rs = await sessionPN.methods.closeSession(sessionID).send(tx);
        if (rs.hash) {
            let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

            if (!receipt.errorMessage) {
                //确认成功
                console.log("send CITA tx success", receipt);
                return 'confirm success'
            } else {
                //确认失败
                return 'confirm fail'
            }
        } else {
            // 提交失败
            return 'send CITA tx fail'
        }
    }

    async onMessage(
        callback: (error: Error, res: any) => void
    ) {
        this.callbacks.set("message", callback);
    }

    /* Query Session Infos */

    /**
     * 根据SessionID 获取session信息
     *
     * @param sessionID string sessionID
     *
     * @return 返回 session 信息
     */
    static async GetSession(sessionID: string) {
        // return await sessionPN.methods.sessions(sessionID).call();
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
        if(Number(session.status) === SESSION_STATUS.SESSION_STATUS_INIT) {
            return false;
        }

        return true;
    }

    private async initialize() {
        // query session by _sessionPN
        let { status, provider, game, paymentContract, data } = await sessionPN.methods.sessions(this.id).call();
        this.status = Number(status);
        this.game = game;
        this.customData = data;

        this.callbacks = this.callbacks || new Map<string, () => void>();

    }
}