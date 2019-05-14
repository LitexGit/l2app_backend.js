"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../lib/server");
const contract_1 = require("../conf/contract");
const common_1 = require("../lib/common");
const mylog_1 = require("../lib/mylog");
exports.ETH_EVENTS = {
    ProviderNewDeposit: {
        filter: () => {
            return {};
        },
        handler: async (event) => { }
    },
    ProviderWithdraw: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH ProviderWithdraw--------------------");
        }
    },
    UserNewDeposit: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH UserNewDeposit--------------------");
        }
    },
    UserWithdraw: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH UserWithdraw--------------------");
        }
    },
    ChannelOpened: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH ChannelOpened--------------------");
        }
    },
    ChannelClosed: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH ChannelClosed--------------------");
            let { returnValues: { channelID, balance, nonce, inAmount, inNonce } } = event;
            mylog_1.logger.debug("channelID: [%s], balance: [%s], nonce: [%s], inAmount: [%s], inNonce: [%s]", channelID, balance, nonce, inAmount, inNonce);
            let channel = await server_1.ethPN.methods.channelMap(channelID).call();
            let data;
            if (Number(channel.status) !== contract_1.CHANNEL_STATUS.CHANNEL_STATUS_CLOSE) {
                return;
            }
            let current = await server_1.web3.eth.getBlockNumber();
            if (current < channel.settleBlock) {
                if (channel.isCloser) {
                    let [{ balance, nonce, additionalHash, signature: partnerSignature }] = await Promise.all([
                        server_1.appPN.methods.balanceProofMap(channelID, server_1.cpProvider.address).call()
                    ]);
                    if (Number(nonce) === 0) {
                        mylog_1.logger.debug("no transfer data, will not submit proof");
                    }
                    else {
                        let messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: balance, t: "uint256" }, { v: nonce, t: "uint256" }, { v: additionalHash, t: "bytes32" }, { v: partnerSignature, t: "bytes" });
                        let consignorSignature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
                        mylog_1.logger.debug("user close the channel, provider will submit proof");
                        mylog_1.logger.debug("proof data: channelID: [%s], balance: [%s], nonce: [%s], additionalHash: [%s], partnerSignature: [%s], consignorSignature: [%s]", channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature);
                        data = server_1.ethPN.methods
                            .partnerUpdateProof(channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature)
                            .encodeABI();
                        await common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data, server_1.cpProvider.privateKey);
                    }
                }
                else {
                    let [{ balance, nonce, additionalHash, signature: partnerSignature, consignorSignature }] = await Promise.all([
                        server_1.appPN.methods.balanceProofMap(channelID, channel.user).call()
                    ]);
                    if (Number(nonce) === 0) {
                        mylog_1.logger.debug("no transfer data, will not submit proof");
                    }
                    else {
                        mylog_1.logger.debug("provider close the channel, will submit user's proof");
                        mylog_1.logger.debug("proof data: channelID: [%s], balance: [%s], nonce: [%s], additionalHash: [%s], partnerSignature: [%s], consignorSignature: [%s]", channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature);
                        if (consignorSignature == null || consignorSignature == "") {
                            mylog_1.logger.debug("no user proof signature, will not submit proof");
                        }
                        else {
                            data = server_1.ethPN.methods
                                .partnerUpdateProof(channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature)
                                .encodeABI();
                            await common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data, server_1.cpProvider.privateKey);
                        }
                    }
                }
            }
            let settle = channel.settleBlock;
            while (true) {
                let current = await server_1.web3.eth.getBlockNumber();
                if (current >= settle) {
                    mylog_1.logger.debug("settle time is up, channelID: ", channelID);
                    let settleData = server_1.ethPN.methods.settleChannel(channelID).encodeABI();
                    let hash = await common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, settleData, server_1.cpProvider.privateKey);
                    mylog_1.logger.debug("Settle Channel HASH:", hash);
                    break;
                }
                await common_1.Common.Sleep(15000);
                mylog_1.logger.debug("settle count down. current:", current, "target:", settle);
            }
        }
    },
    CooperativeSettled: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH CooperativeSettled--------------------");
        }
    },
    ChannelSettled: {
        filter: () => {
            return {};
        },
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle ETH ChannelSettled--------------------");
        }
    }
};
//# sourceMappingURL=eth_events.js.map