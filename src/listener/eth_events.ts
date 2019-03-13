// import { callbacks } from '../lib/server';

export const ETH_EVENTS = {
    'ProviderNewDeposit': {
        filter: {},
        handler: async(event: any) => {
            console.log("ProviderNewDeposit event", event);
        }
    },
    'ProviderWithdraw': {
        filter: {},
        handler: async(event: any) => {
            console.log("ProviderWithdraw event", event);
        }
    },
    'UserNewDeposit': {
        filter: {},
        handler: async(event: any) => {
            console.log("UserNewDeposit event", event);
        }
    },
    'UserWithdraw': {
        filter: {},
        handler: async(event: any) => {
            console.log("UserWithdraw event", event);
        }
    },

    // 'UserJoin': {
    //     filter: {},
    //     handler: async(event: any) => {
    //         console.log("UserJoin event", event);
    //     }
    // },
    'ChannelClosed': {
        filter: {},
        handler: async(event: any) => {
            console.log("ChannelClosed event", event);
        }
    },
    // 'UserLeave': {
    //     filter: { },
    //     handler: async (event: string) => {
    //         console.log("UserLeave event", event);
    //     }
    // },

};