export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const COMMIT_BLOCK_CONDITION = 250;

export enum CHANNEL_STATUS {
    CHANNEL_STATUS_OPEN = 1,
    CHANNEL_STATUS_CLOSE = 2,
    CHANNEL_STATUS_SETTLE = 3,
    CHANNEL_STATUS_PENDING_SETTLE = 4,
}

export type ASSET_EVENT = {
    from: string,
    to: string,
    channelID: string,
    balance: number,
    nonce: number,
    additionalHash: string,
}

export type USER_JOIN_EVENT = {
    sender: string,
    user: string,
    token: string,
    puppet: string,
    amount: number,
    settleWindow: number,
    channelID: string,
}

export type PROVIDER_NEW_DEPOSIT_EVENT = {
    token: string,
    amount: number,
    balance: number,
    type: number,
}

export type USER_NEW_DEPOSIT_EVENT = {
    channelID: string,
    user: string,
    newDeposit: number,
    totalDeposit: number,
    type: number,
}

export type PROVIDER_WITHDRAW_EVENT = {
    token: string,
    amount: number,
    balance: number,
    lastCommitBlock: number,
    type: number,
}

export type USER_WITHDRAW_EVENT = {
    channelID: string,
    user: string,
    amount: number,
    totalWithdraw: number,
    lastCommitBlock: number,
    type: number,
}

export type USER_LEAVE_EVENT = {
    channelID: string,
    user: string,
}

export const TX_BASE = {
    nonce: 999999,
    quota: 1000000,
    chainId: 1,
    version: 1,
    validUntilBlock: 999999,
    value: '0x0',
};

export const TYPED_DATA = {
    types: {
        EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ],
        Transfer: [
            { name: 'channelID', type: 'bytes32' },
            { name: 'balance', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'additionalHash', type: 'bytes32' }
        ],
    },
    primaryType: 'Transfer',
    domain: {
        name: 'litexlayer2',
        version: '1',
        chainId: 4,
        verifyingContract: '',
    },
};

export const ERC20ABI = `[
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

