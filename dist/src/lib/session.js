"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const server_1 = require("./server");
const contract_1 = require("../conf/contract");
const mylog_1 = require("./mylog");
class Session {
    constructor(sessionID) {
        this.id = sessionID;
    }
    static async InitSession(sessionID, game, userList, customData) {
        let res = await common_1.Common.SendAppChainTX(server_1.sessionPN.methods.initSession(sessionID, server_1.cpProvider.address, game, userList, server_1.appPN.options.address, server_1.web3.utils.utf8ToHex(customData)), server_1.cpProvider.address, server_1.cpProvider.privateKey, "sessionPN.methods.initSession");
        let repeatTime = 0;
        while (repeatTime < 60) {
            if (await this.isExists(sessionID)) {
                break;
            }
            await common_1.Common.Sleep(1000);
            repeatTime++;
        }
        return res;
    }
    static async JoinSession(sessionID, user) {
        return await common_1.Common.SendAppChainTX(server_1.sessionPN.methods.joinSession(sessionID, user), server_1.cpProvider.address, server_1.cpProvider.privateKey, "sessionPN.methods.joinSession");
    }
    static async SendSessionMessage(from, to, sessionData, paymentData) {
        mylog_1.logger.debug("sendMessage params: from: [%s], to: [%s], sessionData.sessionID: [%s], sessionData.mType: [%s], sessionData.content: [%s], sessionData.signature: [%s], paymentData: [%o]", from, to, sessionData.sessionID, sessionData.mType, sessionData.content, sessionData.signature, paymentData);
        return await common_1.Common.SendAppChainTX(server_1.sessionPN.methods.sendMessage(from, to, sessionData.sessionID, sessionData.mType, sessionData.content, sessionData.signature, paymentData), server_1.cpProvider.address, server_1.cpProvider.privateKey, "sessionPN.methods.sendMessage");
    }
    static async CloseSession(sessionID) {
        return await common_1.Common.SendAppChainTX(server_1.sessionPN.methods.closeSession(sessionID), server_1.cpProvider.address, server_1.cpProvider.privateKey, "sessionPN.methods.closeSession");
    }
    static async GetSession(sessionID, fromLine = false) {
        if (fromLine) {
            return await server_1.sessionPN.methods.sessions(sessionID).call();
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
    static async isExists(sessionID) {
        let session = await server_1.sessionPN.methods.sessions(sessionID).call();
        if (Number(session.status) === contract_1.SESSION_STATUS.SESSION_STATUS_INIT) {
            return false;
        }
        return true;
    }
    async initialize() {
        let { status, game, data } = await server_1.sessionPN.methods
            .sessions(this.id)
            .call();
        this.status = Number(status);
        this.game = game;
        this.customData = server_1.web3.utils.hexToUtf8(data);
    }
}
Session.sessionList = new Map();
exports.Session = Session;
//# sourceMappingURL=session.js.map