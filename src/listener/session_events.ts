export const SESSION_EVENTS = {
    'InitSession': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("InitSession event", event);

        }
    },

    'JoinSession': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("JoinSession event", event);
            // TODO
        }
    },

    'SendMessage': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("SendMessage event", event);
            // TODO
        }
    },

    'CloseSession': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("CloseSession event", event);
            // TODO
        }
    },
};