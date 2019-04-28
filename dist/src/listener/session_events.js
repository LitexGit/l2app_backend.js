"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../lib/server");
const mylog_1 = require("../lib/mylog");
exports.SESSION_EVENTS = {
    InitSession: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA InitSession--------------------");
        }
    },
    JoinSession: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA JoinSession--------------------");
        }
    },
    SendMessage: {
        filter: () => {
            return { to: server_1.cpProvider.address };
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA SendMessage--------------------");
            let { returnValues: { from, to, sessionID, mType: type, content, balance, nonce, amount, channelID }, transactionHash } = event;
            mylog_1.logger.debug(" from: [%s], to: [%s], sessionID: [%s], type: [%s], content: [%s], balance: [%s], nonce: [%s], amount: [%s], channelID: [%s] ", from, to, sessionID, type, content, balance, nonce, amount, channelID);
            let { token } = await server_1.appPN.methods.channelMap(channelID).call();
            let message = {
                from,
                sessionID,
                type,
                content,
                amount,
                token
            };
            server_1.callbacks.get("Message") && server_1.callbacks.get("Message")(null, message);
        }
    },
    CloseSession: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA CloseSession--------------------");
        }
    }
};
//# sourceMappingURL=session_events.js.map