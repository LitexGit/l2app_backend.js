import { L2, L2_CB, L2_EVENT, PN } from '../src/sdk/sdk'

import mocha from 'mocha';
// import * as should from 'should'

const Web3 = require('web3');

describe('单元测试', function () {

    let cpPrivateKey = '0xfb5730ba3cb517e56f75e75a63d8fd4bb17c4bde0f7146f21167da233ca82bf3';

    const ethPN: PN = {address: '0x3231d5D58325B1a53d4D8a3c11501078e1b6f307', abi: `[ { "constant": true, "inputs": [], "name": "provider", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "puppetMap", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "counter", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "channels", "outputs": [ { "name": "status", "type": "uint8" }, { "name": "user", "type": "address" }, { "name": "isCloser", "type": "bool" }, { "name": "settleBlock", "type": "uint256" }, { "name": "token", "type": "address" }, { "name": "deposit", "type": "uint256" }, { "name": "withdraw", "type": "uint256" }, { "name": "userBalance", "type": "uint256" }, { "name": "userNonce", "type": "uint256" }, { "name": "providerBalance", "type": "uint256" }, { "name": "providerNonce", "type": "uint256" }, { "name": "inAmount", "type": "uint256" }, { "name": "inNonce", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "settleWindowMax", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "providerBalance", "outputs": [ { "name": "", "type": "int256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "settleWindowMin", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "channelCounter", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "regulator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "regulatorWithdrawMap", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "sender", "type": "address" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": true, "name": "token", "type": "address" }, { "indexed": false, "name": "puppet", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "settleWindow", "type": "uint256" }, { "indexed": false, "name": "channelID", "type": "bytes32" } ], "name": "ChannelOpened", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "puppet", "type": "address" } ], "name": "PuppetAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "puppet", "type": "address" } ], "name": "PuppetDisabled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "newDeposit", "type": "uint256" }, { "indexed": false, "name": "totalDeposit", "type": "uint256" } ], "name": "UserNewDeposit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "balance", "type": "int256" } ], "name": "ProviderNewDeposit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "totalWithdraw", "type": "uint256" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" } ], "name": "UserWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "balance", "type": "int256" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" } ], "name": "ProviderWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "withdrawAmount", "type": "uint256" }, { "indexed": false, "name": "feeAmount", "type": "uint256" }, { "indexed": false, "name": "feeNonce", "type": "uint256" } ], "name": "RegulatorWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" } ], "name": "CooperativeSettled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "nonce", "type": "uint256" }, { "indexed": false, "name": "inAmount", "type": "uint256" }, { "indexed": false, "name": "inNonce", "type": "uint256" } ], "name": "ChannelClosed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": false, "name": "userBalance", "type": "uint256" }, { "indexed": false, "name": "userNonce", "type": "uint256" }, { "indexed": false, "name": "providerBalance", "type": "uint256" }, { "indexed": false, "name": "providerNonce", "type": "uint256" } ], "name": "PartnerUpdateProof", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": false, "name": "inAmount", "type": "uint256" }, { "indexed": false, "name": "inNonce", "type": "uint256" } ], "name": "RegulatorUpdateProof", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": true, "name": "token", "type": "address" }, { "indexed": false, "name": "transferTouserAmount", "type": "uint256" }, { "indexed": false, "name": "transferToProviderAmount", "type": "uint256" } ], "name": "ChannelSettled", "type": "event" }, { "constant": false, "inputs": [ { "name": "_regulator", "type": "address" }, { "name": "_provider", "type": "address" }, { "name": "_settleWindowMin", "type": "uint256" }, { "name": "_settleWindowMax", "type": "uint256" } ], "name": "initializer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "user", "type": "address" }, { "name": "puppet", "type": "address" }, { "name": "settleWindow", "type": "uint256" }, { "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "openChannel", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "puppet", "type": "address" } ], "name": "addPuppet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "puppet", "type": "address" } ], "name": "disablePuppet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" } ], "name": "userDeposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "providerDeposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "withdraw", "type": "uint256" }, { "name": "lastCommitBlock", "type": "uint256" }, { "name": "providerSignature", "type": "bytes" }, { "name": "regulatorSignature", "type": "bytes" }, { "name": "receiver", "type": "address" } ], "name": "userWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "balance", "type": "int256" }, { "name": "lastCommitBlock", "type": "uint256" }, { "name": "regulatorSignature", "type": "bytes" } ], "name": "providerWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "withdrawAmount", "type": "uint256" }, { "name": "feeAmount", "type": "uint256" }, { "name": "feeNonce", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "name": "regulatorWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "balance", "type": "uint256" }, { "name": "lastCommitBlock", "type": "uint256" }, { "name": "providerSignature", "type": "bytes" }, { "name": "regulatorSignature", "type": "bytes" } ], "name": "cooperativeSettle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "balance", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "additionalHash", "type": "bytes32" }, { "name": "partnerSignature", "type": "bytes" }, { "name": "inAmount", "type": "uint256" }, { "name": "inNonce", "type": "uint256" }, { "name": "regulatorSignature", "type": "bytes" }, { "name": "providerSignature", "type": "bytes" } ], "name": "closeChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "balance", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "additionalHash", "type": "bytes32" }, { "name": "partnerSignature", "type": "bytes" }, { "name": "consignorSignature", "type": "bytes" } ], "name": "partnerUpdateProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "inAmount", "type": "uint256" }, { "name": "inNonce", "type": "uint256" }, { "name": "regulatorSignature", "type": "bytes" }, { "name": "inProviderSignature", "type": "bytes" } ], "name": "regulatorUpdateProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" } ], "name": "settleChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "user", "type": "address" }, { "name": "token", "type": "address" } ], "name": "getChannelID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" } ]`};

    let appPN: PN = {address: '0xF1B2E4F40b48Fd6903EA7e8E7F0779683B1aEA79', abi: `[ { "constant": true, "inputs": [], "name": "provider", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "userWithdrawProofMap", "outputs": [ { "name": "isConfirmed", "type": "bool" }, { "name": "amount", "type": "uint256" }, { "name": "lastCommitBlock", "type": "uint256" }, { "name": "providerSignature", "type": "bytes" }, { "name": "regulatorSignature", "type": "bytes" }, { "name": "receiver", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "operator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "onchainPayment", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "channelMap", "outputs": [ { "name": "user", "type": "address" }, { "name": "token", "type": "address" }, { "name": "userDeposit", "type": "uint256" }, { "name": "userWithdraw", "type": "uint256" }, { "name": "userBalance", "type": "uint256" }, { "name": "providerBalance", "type": "uint256" }, { "name": "status", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "providerWithdrawProofMap", "outputs": [ { "name": "balance", "type": "int256" }, { "name": "lastCommitBlock", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "paymentNetworkMap", "outputs": [ { "name": "userCount", "type": "uint256" }, { "name": "userTotalDeposit", "type": "uint256" }, { "name": "userTotalWithdraw", "type": "uint256" }, { "name": "providerDeposit", "type": "uint256" }, { "name": "providerWithdraw", "type": "uint256" }, { "name": "providerRebalanceIn", "type": "uint256" }, { "name": "providerTotalSettled", "type": "uint256" }, { "name": "providerBalance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "rebalanceProofMap", "outputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "providerSignature", "type": "bytes" }, { "name": "regulatorSignature", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "regulator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "uint256" } ], "name": "puppets", "outputs": [ { "name": "p", "type": "address" }, { "name": "enabled", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "proposeRebalanceProofMap", "outputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "providerSignature", "type": "bytes" }, { "name": "regulatorSignature", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "closingChannelMap", "outputs": [ { "name": "closer", "type": "address" }, { "name": "userTransferredAmount", "type": "uint256" }, { "name": "userTransferredNonce", "type": "uint256" }, { "name": "providerTransferredAmount", "type": "uint256" }, { "name": "providerTransferredNonce", "type": "uint256" }, { "name": "providerRebalanceInAmount", "type": "uint256" }, { "name": "providerRebalanceOutAmount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "address" } ], "name": "balanceProofMap", "outputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "balance", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "additionalHash", "type": "bytes32" }, { "name": "signature", "type": "bytes" }, { "name": "consignorSignature", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "feeProofMap", "outputs": [ { "name": "amount", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_onchainPayment", "type": "address" }, { "name": "_provider", "type": "address" }, { "name": "_regulator", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "oldOperator", "type": "address" }, { "indexed": true, "name": "newOperator", "type": "address" } ], "name": "OperatorChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "channelID", "type": "bytes32" }, { "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "nonce", "type": "uint256" }, { "indexed": false, "name": "additionalHash", "type": "bytes32" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "user", "type": "address" }, { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "nonce", "type": "uint256" } ], "name": "GuardBalanceProof", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "nonce", "type": "uint256" } ], "name": "SubmitFee", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "receiver", "type": "address" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" } ], "name": "UserProposeWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "confirmer", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" }, { "indexed": false, "name": "isAllConfirmed", "type": "bool" } ], "name": "ConfirmUserWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "token", "type": "address" }, { "indexed": false, "name": "balance", "type": "int256" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" } ], "name": "ProviderProposeWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "token", "type": "address" }, { "indexed": false, "name": "balance", "type": "int256" }, { "indexed": false, "name": "lastCommitBlock", "type": "uint256" } ], "name": "ConfirmProviderWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": false, "name": "amout", "type": "uint256" }, { "indexed": false, "name": "nonce", "type": "uint256" }, { "indexed": false, "name": "id", "type": "bytes32" } ], "name": "ProposeRebalance", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelID", "type": "bytes32" }, { "indexed": true, "name": "id", "type": "bytes32" }, { "indexed": false, "name": "amout", "type": "uint256" }, { "indexed": false, "name": "nonce", "type": "uint256" } ], "name": "ConfirmRebalance", "type": "event" }, { "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "channelID", "type": "bytes32" }, { "name": "balance", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "additionalHash", "type": "bytes32" }, { "name": "signature", "type": "bytes" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "balance", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "additionalHash", "type": "bytes32" }, { "name": "signature", "type": "bytes" }, { "name": "consignorSignature", "type": "bytes" } ], "name": "guardBalanceProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "name": "submitFee", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" }, { "name": "receiver", "type": "address" }, { "name": "lastCommitBlock", "type": "uint256" } ], "name": "userProposeWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "signature", "type": "bytes" } ], "name": "confirmUserWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "balance", "type": "int256" }, { "name": "lastCommitBlock", "type": "uint256" } ], "name": "providerProposeWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "signature", "type": "bytes" } ], "name": "confirmProviderWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "name": "proposeRebalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "id", "type": "bytes32" }, { "name": "signature", "type": "bytes" } ], "name": "confirmRebalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "user", "type": "address" }, { "name": "token", "type": "address" }, { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" } ], "name": "onchainOpenChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "user", "type": "address" }, { "name": "puppet", "type": "address" } ], "name": "onchainAddPuppet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "user", "type": "address" }, { "name": "puppet", "type": "address" } ], "name": "onchainDisablePuppet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "user", "type": "address" }, { "name": "deposit", "type": "uint256" } ], "name": "onchainUserDeposit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "onchainProviderDeposit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "amount", "type": "uint256" }, { "name": "withdraw", "type": "uint256" }, { "name": "lastCommitBlock", "type": "uint256" } ], "name": "onchainUserWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "balance", "type": "uint256" }, { "name": "lastCommitBlock", "type": "uint256" } ], "name": "onchainProviderWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }, { "name": "lastCommitBlock", "type": "uint256" } ], "name": "onchainCooperativeSettleChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "closer", "type": "address" }, { "name": "balance", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "inAmount", "type": "uint256" } ], "name": "onchainCloseChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "userBalance", "type": "uint256" }, { "name": "userNonce", "type": "uint256" }, { "name": "providerBalance", "type": "uint256" }, { "name": "providerNonce", "type": "uint256" } ], "name": "onchainPartnerUpdateProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "inAmount", "type": "uint256" } ], "name": "onchainRegulatorUpdateProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelID", "type": "bytes32" }, { "name": "userSettleAmount", "type": "uint256" }, { "name": "providerSettleAmount", "type": "uint256" } ], "name": "onchainSettleChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOperator", "type": "address" } ], "name": "setOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "lockIds", "type": "bytes32[]" } ], "name": "unlockAsset", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]`};

    let appRpcUrl = "https://node.cryptape.com";

    let ethRpcUrl = "http://54.250.21.165:8545";
    let ethProvider = new Web3.providers.HttpProvider(ethRpcUrl);
    // let ethRpcUrl = "ws://54.250.21.165:8546";
    // let ethProvider = new Web3.providers.WebsocketProvider(ethRpcUrl);

    let l2 = L2.GetInstance();
    l2.Init(cpPrivateKey, ethProvider, ethPN, appRpcUrl, appPN);

    it('CP充值', function () {
        let rs = l2.Deposit(100);
        console.log(rs);
    })
});