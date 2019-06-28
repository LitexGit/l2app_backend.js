export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const COMMIT_BLOCK_CONDITION = 250;

export const CHANNEL_SETTLE_WINDOW = 20;

export enum CHANNEL_STATUS {
  CHANNEL_STATUS_INIT = 0,
  CHANNEL_STATUS_OPEN = 1,
  CHANNEL_STATUS_CLOSE = 2,
  CHANNEL_STATUS_SETTLE = 3,
  CHANNEL_STATUS_PENDING_SETTLE = 4
}

export enum SESSION_STATUS {
  SESSION_STATUS_INIT = 0,
  SESSION_STATUS_OPEN,
  SESSION_STATUS_CLOSE
}

// 定义 PaymentNetwork 合约对象
export type PN = {
  address: string;
  abi: string;
};

// 定义 SessionData 类型
export type SessionData = {
  sessionID: string;
  mType: number;
  content: string;
  signature: string;
};

// 定义 PaymentData 类型
export type PaymentData = {
  transferData: any;
  paymentSignature: string;
};

export type L2_EVENT = "Message" | "UserDeposit" | "UserWithdraw" | "UserForceWithdraw" | "ProviderWithdraw" | "ProviderDeposit" | "Transfer";
export type L2_CB = (err: any, res: any) => void;

// 转账事件
export type TRANSFER_EVENT = {
  from: string;
  to: string;
  token: string;
  amount: string;
  additionalHash: string;
  totalTransferredAmount: string;
};

export type USER_DEPOSIT_EVENT = {
  sender: string;
  user: string;
  type: number;
  token: string;
  amount: string;
  totalDeposit: string;
  txhash: string;
};

export type USER_WITHDRAW_EVENT = {
  user: string;
  type: number;
  token: string;
  amount: string;
  totalWithdraw: string;
  txhash: string;
};

export type PROVIDER_WITHDRAW_EVENT = {
  token: string;
  amount: string;
  totalWithdraw: string;
  txhash: string;
};

export type PROVIDER_DEPOSIT_EVENT = {
  token: string;
  amount: string;
  totalDeposit: string;
  txhash: string;
};

export type USER_FORCEWITHDRAW_EVENT = {
  closer: string;
  user: string;
  token: string;
  userSettleAmount: string;
  providerSettleAmount: string;
  txhash: string;
};

export type SESSION_MESSAGE_EVENT = {
  sessionID: string;
  from: string;
  type: string;
  content: string;
  token: string;
  amount: string;
  txhash: string;
};

export const TX_BASE = {
  nonce: 999999,
  quota: 1000000,
  chainId: 1,
  version: 1,
  validUntilBlock: 999999,
  value: "0x0"
};

export const TYPED_DATA = {
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
