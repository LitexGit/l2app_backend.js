export declare const SESSION_EVENTS: {
    'InitSession': {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    'JoinSession': {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
    'SendMessage': {
        filter: () => {
            to: any;
        };
        handler: (event: any) => Promise<void>;
    };
    'CloseSession': {
        filter: () => {};
        handler: (event: any) => Promise<void>;
    };
};
