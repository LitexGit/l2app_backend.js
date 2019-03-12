// ETH Contract
const ethWSUrl = 'ws://54.250.21.165:8546';
const paymentContractAddress = '0x4B70A4d4d885cb397E2bD5b0A77DA9bD3EEb033e';
const paymentContractAbi = require('./PaymentContractAbi.json');

const gameContractAddress = '0x2ec9B713cCa3f42fd7E263D91B46e86E6fe7ea4B';
const gameContractAbi = require('./GameContractAbi.json');


// AppChain Contract
const appChainUrl = 'http://wallet.milewan.com:8090';

const appChainContractAddress = '0xeBdc4a25EFba864F7635F718b9A3F5518dE43040';
const appChainContractAbi = require('./AppChainContractAbi.json');

enum CHANNEL_STATUS {
    CHANNEL_STATUS_INIT = 1,
    CHANNEL_STATUS_PENDINGOPEN,
    CHANNEL_STATUS_OPEN,
    CHANNEL_STATUS_PENDING_UPDATE_PUPPET,
    CHANNEL_STATUS_PENDING_SETTLE,
    CHANNEL_STATUS_CLOSE,
    CHANNEL_STATUS_PARTNER_UPDATE_PROOF,
    CHANNEL_STATUS_REGULATOR_UPDATE_PROOF
};

// let contractEvent = 'Deposit' | 'Withdraw' | 'ForceWithdraw' | 'Transfer' | 'DisablePuppet';

