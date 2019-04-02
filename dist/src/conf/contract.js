"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
exports.COMMIT_BLOCK_CONDITION = 250;
var CHANNEL_STATUS;
(function (CHANNEL_STATUS) {
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
exports.ERC20ABI = "[\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"name\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"string\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": false,\n        \"inputs\": [\n            {\n                \"name\": \"_spender\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"approve\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"bool\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"nonpayable\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"totalSupply\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": false,\n        \"inputs\": [\n            {\n                \"name\": \"_from\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_to\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"transferFrom\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"bool\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"nonpayable\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"decimals\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"uint8\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [\n            {\n                \"name\": \"_owner\",\n                \"type\": \"address\"\n            }\n        ],\n        \"name\": \"balanceOf\",\n        \"outputs\": [\n            {\n                \"name\": \"balance\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [],\n        \"name\": \"symbol\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"string\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": false,\n        \"inputs\": [\n            {\n                \"name\": \"_to\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"transfer\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"bool\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"nonpayable\",\n        \"type\": \"function\"\n    },\n    {\n        \"constant\": true,\n        \"inputs\": [\n            {\n                \"name\": \"_owner\",\n                \"type\": \"address\"\n            },\n            {\n                \"name\": \"_spender\",\n                \"type\": \"address\"\n            }\n        ],\n        \"name\": \"allowance\",\n        \"outputs\": [\n            {\n                \"name\": \"\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"payable\": false,\n        \"stateMutability\": \"view\",\n        \"type\": \"function\"\n    },\n    {\n        \"payable\": true,\n        \"stateMutability\": \"payable\",\n        \"type\": \"fallback\"\n    },\n    {\n        \"anonymous\": false,\n        \"inputs\": [\n            {\n                \"indexed\": true,\n                \"name\": \"owner\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": true,\n                \"name\": \"spender\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": false,\n                \"name\": \"value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"Approval\",\n        \"type\": \"event\"\n    },\n    {\n        \"anonymous\": false,\n        \"inputs\": [\n            {\n                \"indexed\": true,\n                \"name\": \"from\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": true,\n                \"name\": \"to\",\n                \"type\": \"address\"\n            },\n            {\n                \"indexed\": false,\n                \"name\": \"value\",\n                \"type\": \"uint256\"\n            }\n        ],\n        \"name\": \"Transfer\",\n        \"type\": \"event\"\n    }\n]";
//# sourceMappingURL=contract.js.map