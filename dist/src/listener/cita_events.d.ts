export declare const CITA_EVENTS: {
    Transfer: {
        filter: () => {
            to: any;
        };
        handler: (event: any) => Promise<void>;
    };
    SubmitFee: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    UserProposeWithdraw: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    ProposeCooperativeSettle: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    ConfirmProviderWithdraw: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainProviderWithdraw: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainProviderDeposit: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainUserDeposit: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainUserWithdraw: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainOpenChannel: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainCooperativeSettleChannel: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    OnchainSettleChannel: {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
};
