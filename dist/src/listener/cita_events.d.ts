export declare const CITA_EVENTS: {
    'Transfer': {
        filter: () => {
            to: any;
        };
        handler: (event: any) => Promise<void>;
    };
    'UserProposeWithdraw': {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    'ProposeCooperativeSettle': {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    'ConfirmProviderWithdraw': {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
};
