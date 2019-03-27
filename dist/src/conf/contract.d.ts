export declare const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export declare const COMMIT_BLOCK_CONDITION = 250;
export declare enum CHANNEL_STATUS {
    CHANNEL_STATUS_OPEN = 1,
    CHANNEL_STATUS_CLOSE = 2,
    CHANNEL_STATUS_SETTLE = 3,
    CHANNEL_STATUS_PENDING_SETTLE = 4
}
export declare enum SESSION_STATUS {
    SESSION_STATUS_INIT = 0,
    SESSION_STATUS_OPEN = 1,
    SESSION_STATUS_CLOSE = 2
}
export declare type TRANSFER_EVENT = {
    from: string;
    to: string;
    token: string;
    amount: string;
    additionalHash: string;
    totalTransferredAmount: string;
};
export declare type USER_DEPOSIT_EVENT = {
    sender: string;
    user: string;
    type: number;
    token: string;
    amount: string;
    totalDeposit: string;
    txhash: string;
};
export declare type USER_WITHDRAW_EVENT = {
    user: string;
    type: number;
    token: string;
    amount: string;
    totalWithdraw: string;
    txhash: string;
};
export declare type PROVIDER_WITHDRAW_EVENT = {
    token: string;
    amount: string;
    totalWithdraw: string;
    txhash: string;
};
export declare type USER_FORCEWITHDRAW_EVENT = {
    closer: string;
    user: string;
    token: string;
    userSettleAmount: string;
    providerSettleAmount: string;
    txhash: string;
};
export declare type SESSION_MESSAGE_EVENT = {
    sessionID: string;
    from: string;
    type: string;
    content: string;
    token: string;
    amount: string;
};
export declare const TX_BASE: {
    nonce: number;
    quota: number;
    chainId: number;
    version: number;
    validUntilBlock: number;
    value: string;
};
export declare const TYPED_DATA: {
    types: {
        EIP712Domain: {
            name: string;
            type: string;
        }[];
        Transfer: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
};
export declare const ERC20ABI = "[\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"name\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"string\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": false,\n        \"inputs\": [\n            {\n                \"name\": \"_spender\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"approve\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"bool\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"nonpayable\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"totalSupply\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": false,\n        \"inputs\": [\n            {\n                \"name\": \"_from\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_to\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"transferFrom\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"bool\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"nonpayable\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"decimals\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"uint8\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [\n            {\n                \"name\": \"_owner\",\n                \"type\": \"address\"\n            }\n        ],\n        \"name\": \"balanceOf\",\n        \"outputs\": [\n            {\n                \"name\": \"balance\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"symbol\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"string\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": false,\n        \"inputs\": [\n            {\n                \"name\": \"_to\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"transfer\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"bool\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"nonpayable\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [\n            {\n                \"name\": \"_owner\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_spender\",\n                \"type\": \"address\"\n            }\n        ],\n        \"name\": \"allowance\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"payable\": true,\n        \"stateMutability\": \"payable\",\n        \"type\": \"fallback\"\n    },\n    {\n        \"anonymous\": false,\n        \"inputs\": [\n            {\n                \"indexed\": true,\n                \"name\": \"owner\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": true,\n                \"name\": \"spender\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": false,\n                \"name\": \"value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"Approval\",\n        \"type\": \"event\"\n    },\n    {\n        \"anonymous\": false,\n        \"inputs\": [\n            {\n                \"indexed\": true,\n                \"name\": \"from\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": true,\n                \"name\": \"to\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": false,\n                \"name\": \"value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"Transfer\",\n        \"type\": \"event\"\n    }\n]";
