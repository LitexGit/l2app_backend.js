import {Session} from "../lib/session";
import {ADDRESS_ZERO} from "../conf/contract";

export const SESSION_EVENTS = {
    'InitSession': {
        filter: () => { return {  } },
        handler: async (event: any) => {
            console.log("InitSession event", event);

        }
    },

    'JoinSession': {
        filter: () => { return {  } },
        handler: async (event: any) => {
            console.log("JoinSession event", event);
        }
    },

    'SendMessage': {
        filter: () => { return { } },
        handler: async (event: any) => {
            console.log("SendMessage event", event);

            let { returnValues: { from, to, sessionID, mType: type, content } } = event;
            let session = await Session.GetSession(sessionID);
            if (!session) {
                return;
            }

            let amount = 0;

            if(session.callbacks.get('message') !== undefined) {
                session.callbacks.get('message')(null, { to, from, sessionID, type, content, amount, ADDRESS_ZERO });
            }
        }
    },

    'CloseSession': {
        filter: () => { return {  } },
        handler: async (event: any) => {
            console.log("CloseSession event", event);
            // TODO
        }
    },
};