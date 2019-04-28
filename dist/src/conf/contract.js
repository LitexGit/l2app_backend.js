"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
exports.COMMIT_BLOCK_CONDITION = 250;
exports.CHANNEL_SETTLE_WINDOW = 3;
var CHANNEL_STATUS;
(function (CHANNEL_STATUS) {
    CHANNEL_STATUS[CHANNEL_STATUS["CHANNEL_STATUS_INIT"] = 0] = "CHANNEL_STATUS_INIT";
    CHANNEL_STATUS[CHANNEL_STATUS["CHANNEL_STATUS_OPEN"] = 1] = "CHANNEL_STATUS_OPEN";
    CHANNEL_STATUS[CHANNEL_STATUS["CHANNEL_STATUS_CLOSE"] = 2] = "CHANNEL_STATUS_CLOSE";
    CHANNEL_STATUS[CHANNEL_STATUS["CHANNEL_STATUS_SETTLE"] = 3] = "CHANNEL_STATUS_SETTLE";
    CHANNEL_STATUS[CHANNEL_STATUS["CHANNEL_STATUS_PENDING_SETTLE"] = 4] = "CHANNEL_STATUS_PENDING_SETTLE";
})(CHANNEL_STATUS = exports.CHANNEL_STATUS || (exports.CHANNEL_STATUS = {}));
var SESSION_STATUS;
(function (SESSION_STATUS) {
    SESSION_STATUS[SESSION_STATUS["SESSION_STATUS_INIT"] = 0] = "SESSION_STATUS_INIT";
    SESSION_STATUS[SESSION_STATUS["SESSION_STATUS_OPEN"] = 1] = "SESSION_STATUS_OPEN";
    SESSION_STATUS[SESSION_STATUS["SESSION_STATUS_CLOSE"] = 2] = "SESSION_STATUS_CLOSE";
})(SESSION_STATUS = exports.SESSION_STATUS || (exports.SESSION_STATUS = {}));
exports.TX_BASE = {
    nonce: 999999,
    quota: 1000000,
    chainId: 1,
    version: 1,
    validUntilBlock: 999999,
    value: "0x0"
};
exports.TYPED_DATA = {
    types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" }
        ],
        Transfer: [
            { name: "channelID", type: "bytes32" },
            { name: "balance", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "additionalHash", type: "bytes32" }
        ]
    },
    primaryType: "Transfer",
    domain: {
        name: "litexlayer2",
        version: "1",
        chainId: 4,
        verifyingContract: ""
    }
};
exports.ERC20ABI = `[
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]`;
//# sourceMappingURL=contract.js.map