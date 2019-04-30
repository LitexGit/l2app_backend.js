"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../lib/server");
const common_1 = require("../lib/common");
const mylog_1 = require("../lib/mylog");
exports.CITA_EVENTS = {
    Transfer: {
        filter: () => ({ to: server_1.cpProvider.address }),
        handler: async (event) => {
            let { returnValues: { from, to, channelID, balance, transferAmount, additionalHash } } = event;
            mylog_1.logger.debug("--------------------Handle CITA Transfer--------------------");
            mylog_1.logger.debug("from :[%s], to :[%s], channelID :[%s], balance :[%s], transferAmount :[%s], additionalHash :[%s]", from, to, channelID, balance, transferAmount, additionalHash);
            let channel = await server_1.appPN.methods.channelMap(channelID).call();
            let token = channel.token;
            mylog_1.logger.debug("channel", channel);
            let assetEvent = {
                from: from,
                to: to,
                token,
                amount: transferAmount,
                additionalHash,
                totalTransferredAmount: balance
            };
            if (server_1.callbacks.get("Transfer")) {
                let { toBN } = server_1.web3.utils;
                let time = 0;
                while (time < 15) {
                    let channelInfo = await server_1.appPN.methods
                        .balanceProofMap(channelID, to)
                        .call();
                    if (toBN(channelInfo.balance).gte(toBN(balance))) {
                        break;
                    }
                    await common_1.Common.Sleep(1000);
                    time++;
                }
                server_1.callbacks.get("Transfer")(null, assetEvent);
            }
            let { amount: feeProofAmount, nonce: road } = await server_1.appPN.methods.feeProofMap(token).call();
            let feeRate = await server_1.appPN.methods.feeRateMap(token).call();
            if (Number(feeRate) === 0) {
                mylog_1.logger.debug("feeRate is 0, will do nothing");
                return;
            }
            mylog_1.logger.debug("start to submit feeProof, old feeProofAmount :[%s], feeRate :[%s]", feeProofAmount, feeRate);
            let [{ balance: amount }] = await Promise.all([
                server_1.appPN.methods.balanceProofMap(channelID, server_1.cpProvider.address).call()
            ]);
            let bn = server_1.web3.utils.toBN;
            let feeAmount = bn(feeProofAmount)
                .add(bn(feeRate)
                .mul(bn(balance).sub(bn(amount)))
                .div(bn(10000)))
                .toString();
            mylog_1.logger.debug("provider balance :[%s], provider nonce :[%s], event Balance :[%s], feeAmount :[%s]", amount, road, balance, feeAmount);
            let feeNonce = Number(road) + 1;
            let messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: token, t: "address" }, { v: feeAmount, t: "uint256" }, { v: feeNonce, t: "uint256" });
            let signature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
            mylog_1.logger.debug("infos:  channelID :[%s], token :[%s], feeAmount :[%s], feeNonce :[%s], signature :[%s]", channelID, token, feeAmount, feeNonce, signature);
            common_1.Common.SendAppChainTX(server_1.appPN.methods.submitFee(channelID, token, feeAmount, feeNonce, signature), server_1.cpProvider.address, server_1.cpProvider.privateKey, "appPN.methods.submitFee");
        }
    },
    SubmitFee: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA SubmitFee--------------------");
            let { token, amount, nonce } = event.returnValues;
            mylog_1.logger.debug("token:[%s], amount:[%s], nonce:[%s]", token, amount, nonce);
        }
    },
    UserProposeWithdraw: {
        filter: () => ({}),
        handler: async (event) => {
            let { returnValues: { user, channelID, amount, balance, receiver, lastCommitBlock } } = event;
            mylog_1.logger.debug("--------------------Handle CITA UserProposeWithdraw--------------------");
            mylog_1.logger.debug("user :[%s], channelID :[%s], amount :[%s], balance :[%s], receiver :[%s], lastCommitBlock :[%s] ", user, channelID, amount, balance, receiver, lastCommitBlock);
            let messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: balance, t: "uint256" }, { v: lastCommitBlock, t: "uint256" });
            let signature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
            common_1.Common.SendAppChainTX(server_1.appPN.methods.confirmUserWithdraw(channelID, signature), server_1.cpProvider.address, server_1.cpProvider.privateKey, "appPN.methods.confirmUserWithdraw");
        }
    },
    ProposeCooperativeSettle: {
        filter: () => ({}),
        handler: async (event) => {
            let { returnValues: { channelID, balance, lastCommitBlock } } = event;
            mylog_1.logger.debug("--------------------Handle CITA ProposeCooperativeSettle--------------------");
            mylog_1.logger.debug(" channelID: [%s], balance:[%s], lastCommitBlock:[%s] ", channelID, balance, lastCommitBlock);
            let messageHash = server_1.web3.utils.soliditySha3({ v: server_1.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: balance, t: "uint256" }, { v: lastCommitBlock, t: "uint256" });
            let signature = common_1.Common.SignatureToHex(messageHash, server_1.cpProvider.privateKey);
            common_1.Common.SendAppChainTX(server_1.appPN.methods.confirmCooperativeSettle(channelID, signature), server_1.cpProvider.address, server_1.cpProvider.privateKey, "appPN.methods.confirmCooperativeSettle");
        }
    },
    ConfirmProviderWithdraw: {
        filter: () => ({}),
        handler: async (event) => {
            let { returnValues: { token, amount: balance, lastCommitBlock, signature } } = event;
            mylog_1.logger.debug("--------------------Handle CITA ConfirmProviderWithdraw--------------------");
            mylog_1.logger.debug(" token: [%s], balance: [%s], lastCommitBlock: [%s], signature: [%s]", token, balance, lastCommitBlock, signature);
            let data = await server_1.ethPN.methods
                .providerWithdraw(token, balance, lastCommitBlock, signature)
                .encodeABI();
            common_1.Common.SendEthTransaction(server_1.cpProvider.address, server_1.ethPN.options.address, 0, data, server_1.cpProvider.privateKey);
        }
    },
    OnchainProviderWithdraw: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainProviderWithdraw--------------------");
            let { returnValues, transactionHash: txhash } = event;
            let { token, amount, balance } = returnValues;
            mylog_1.logger.debug("token:[%s], amount:[%s], balance:[%s]", token, amount, balance);
            let providerWithdrawEvent = {
                token,
                amount: amount,
                totalWithdraw: amount,
                txhash
            };
            if (server_1.callbacks.get("ProviderWithdraw")) {
                server_1.callbacks.get("ProviderWithdraw")(null, providerWithdrawEvent);
            }
        }
    },
    OnchainProviderDeposit: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainProviderDeposit--------------------");
            let { returnValues, transactionHash: txhash } = event;
            let { token, amount } = returnValues;
            mylog_1.logger.debug("token:[%s], amount:[%s]", token, amount);
            let providerDepositEvent = {
                token,
                amount,
                totalDeposit: amount,
                txhash
            };
            if (server_1.callbacks.get("ProviderDeposit")) {
                server_1.callbacks.get("ProviderDeposit")(null, providerDepositEvent);
            }
        }
    },
    OnchainUserDeposit: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainUserDeposit--------------------");
            let { returnValues: { channelID, user, deposit: newDeposit, totalDeposit }, transactionHash: txhash } = event;
            mylog_1.logger.debug(" channelID: [%s], user: [%s], newDeposit: [%s], totalDeposit: [%s] ", channelID, user, newDeposit, totalDeposit);
            let { token } = await server_1.appPN.methods.channelMap(channelID).call();
            let userNewDepositEvent = {
                sender: user,
                user,
                type: 2,
                token,
                amount: newDeposit,
                totalDeposit,
                txhash
            };
            if (server_1.callbacks.get("UserDeposit")) {
                server_1.callbacks.get("UserDeposit")(null, userNewDepositEvent);
            }
        }
    },
    OnchainUserWithdraw: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainUserWithdraw--------------------");
            let { returnValues: { channelID, user, amount, withdraw: totalWithdraw }, transactionHash: txhash } = event;
            mylog_1.logger.debug(" channelID: [%s], user: [%s], amount: [%s], totalWithdraw: [%s] ", channelID, user, amount, totalWithdraw);
            let { token } = await server_1.appPN.methods.channelMap(channelID).call();
            let userWithdrawEvent = {
                user,
                type: 1,
                token,
                amount,
                totalWithdraw,
                txhash
            };
            if (server_1.callbacks.get("UserWithdraw")) {
                server_1.callbacks.get("UserWithdraw")(null, userWithdrawEvent);
            }
        }
    },
    OnchainOpenChannel: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainOpenChannel--------------------");
            let { returnValues: { user, token, amount, channelID }, transactionHash: txhash } = event;
            mylog_1.logger.debug(" sender: [%s], user: [%s], token: [%s], amount: [%s], channelID: [%s] ", user, user, token, amount, channelID);
            let userJoinEvent = {
                sender: user,
                user,
                type: 1,
                token,
                amount,
                totalDeposit: amount,
                txhash
            };
            if (server_1.callbacks.get("UserDeposit")) {
                server_1.callbacks.get("UserDeposit")(null, userJoinEvent);
            }
        }
    },
    OnchainCooperativeSettleChannel: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainCooperativeSettleChannel--------------------");
            let { returnValues: { channelID, user, token, balance }, transactionHash: txhash } = event;
            mylog_1.logger.debug(" channelID: [%s], user: [%s], token: [%s], balance: [%s] ", channelID, user, token, balance);
            let userLeaveEvent = {
                user,
                type: 2,
                token,
                amount: balance,
                totalWithdraw: "",
                txhash
            };
            if (server_1.callbacks.get("UserWithdraw")) {
                server_1.callbacks.get("UserWithdraw")(null, userLeaveEvent);
            }
        }
    },
    OnchainSettleChannel: {
        filter: () => ({}),
        handler: async (event) => {
            mylog_1.logger.debug("--------------------Handle CITA OnchainSettleChannel--------------------");
            let { returnValues: { channelID, user, token, userSettleAmount: transferTouserAmount, providerSettleAmount: transferToProviderAmount }, transactionHash: txhash } = event;
            mylog_1.logger.debug(" channelID: [%s], user: [%s], token: [%s], transferTouserAmount: [%s], transferToProviderAmount: [%s] ", channelID, user, token, transferTouserAmount, transferToProviderAmount);
            let { closer } = await server_1.appPN.methods.closingChannelMap(channelID).call();
            let userLeaveEvent = {
                closer,
                user,
                token,
                userSettleAmount: transferTouserAmount,
                providerSettleAmount: transferToProviderAmount,
                txhash
            };
            if (server_1.callbacks.get("UserForceWithdraw")) {
                server_1.callbacks.get("UserForceWithdraw")(null, userLeaveEvent);
            }
        }
    }
};
//# sourceMappingURL=cita_events.js.map