import {cpProvider} from "../lib/server";
import {Session} from "../lib/session";
import {ADDRESS_ZERO} from "../conf/contract";

export const SESSION_EVENTS = {
    'InitSession': {
        filter: () => { return { from: cpProvider.address } },
        handler: async (event: any) => {
            console.log("InitSession event", event);

        }
    },

    'JoinSession': {
        filter: () => { return { from: cpProvider.address } },
        handler: async (event: any) => {
            console.log("JoinSession event", event);
            // TODO
        }
    },

    'SendMessage': {
        filter: () => { return { from: cpProvider.address } },
        handler: async (event: any) => {
            console.log("SendMessage event", event);

            let { returnValues: { from, to, sessionID, mType: type, content, channelID, balance, nonce } } = event;
            let session = await Session.GetSession(sessionID);
            if (!session) {
                return;
            }

            let amount = 0;

            if(session.callbacks.get('message') !== undefined) {
                session.callbacks.get('message')(null, { from, to, sessionID, type, content, amount, ADDRESS_ZERO });
            }
        }
    },

    'CloseSession': {
        filter: () => { return { from: cpProvider.address } },
        handler: async (event: any) => {
            console.log("CloseSession event", event);
            // TODO
        }
    },
};