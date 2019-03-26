import {appPN, ethPN, cpProvider, callbacks, web3} from '../lib/server';
import {
    USER_JOIN_EVENT,
    USER_NEW_DEPOSIT_EVENT,
    PROVIDER_WITHDRAW_EVENT,
    USER_WITHDRAW_EVENT,
    USER_LEAVE_EVENT, CHANNEL_STATUS
} from "../conf/contract";
import {Common} from "../lib/common";
import {STATUS_CODES} from "http";

// let cp = cpProvider.address;

export const ETH_EVENTS = {
    'ProviderNewDeposit': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("ProviderNewDeposit event", event);

            // // 获取事件内容
            // let { returnValues: { token, amount, balance } } = event;
            //
            // let providerNewDepositEvent: PROVIDER_NEW_DEPOSIT_EVENT = { token, amount, balance, type:1 };
            // if (callbacks.get('Deposit')) {
            //     // @ts-ignore
            //     callbacks.get('Deposit')(null, providerNewDepositEvent);
            // }
        }
    },

    'ProviderWithdraw': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("ProviderWithdraw event", event);

            // 获取事件内容
            let {returnValues: {token, amount, balance}} = event;

            let providerWithdrawEvent: PROVIDER_WITHDRAW_EVENT = {token, withdraw: amount, totalWithdraw: balance, type: 1};
            if (callbacks.get('Withdraw')) {
                // @ts-ignore
                callbacks.get('Withdraw')(null, providerWithdrawEvent);
            }
        }
    },

    'UserNewDeposit': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("UserNewDeposit event", event);

            // 获取事件内容
            let {returnValues: {channelID, user, newDeposit, totalDeposit,}} = event;

            let userNewDepositEvent: USER_NEW_DEPOSIT_EVENT = {channelID, user, deposit: newDeposit, totalDeposit, type: 2};
            if (callbacks.get('Deposit')) {
                // @ts-ignore
                callbacks.get('Deposit')(null, userNewDepositEvent);
            }
        }
    },

    'UserWithdraw': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("UserWithdraw event", event);

            // 获取event事件内容
            let {returnValues: {channelID, user, amount, totalWithdraw}} = event;

            let userWithdrawEvent: USER_WITHDRAW_EVENT = {
                channelID,
                user,
                withdraw: amount,
                totalWithdraw,
                type: 2
            };
            if (callbacks.get('Withdraw')) {
                callbacks.get('Withdraw')(null, userWithdrawEvent);
            }
        }
    },

    'ChannelOpened': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("ChannelOpened event", event);

            // 获取事件内容
            let {returnValues: {sender, user, token, amount, channelID}} = event;

            let userJoinEvent: USER_JOIN_EVENT = {sender, user, token, userDeposit: amount, channelID};
            if (callbacks.get('Asset')) {
                callbacks.get('Asset')(null, userJoinEvent);
            }
        }
    },

    'ChannelClosed': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("ChannelClosed event", event);

            // 获取事件内容
            let {returnValues: {channelID}} = event;

            // 获取通道信息
            let channel = await ethPN.methods.channels(channelID).call();

            let data;

            if (Number(channel.status) !== CHANNEL_STATUS.CHANNEL_STATUS_CLOSE) {
                return;
            }

            let current = await web3.eth.getBlockNumber();

            if (current < channel.settleBlock) {
                // 强关发起方是用户
                if (channel.isCloser) {
                    // 获取通道证据
                    let [{balance, nonce, additionalHash, signature: partnerSignature}] = await Promise.all([
                        appPN.methods.balanceProofMap(channelID, cpProvider.address).call()
                    ]);

                    if (Number(nonce) === 0) {

                    } else {
                        // CP 签名
                        let messageHash = web3.utils.soliditySha3(
                            {v: ethPN.options.address, t: 'address'},
                            {v: channelID, t: 'bytes32'},
                            {v: balance, t: 'uint256'},
                            {v: nonce, t: 'uint256'},
                            {v: additionalHash, t: 'bytes32'},
                            {v: partnerSignature, t: 'bytes'},
                        );

                        // 进行签名
                        let consignorSignature = Common.SignatureToHex(messageHash);

                        // 获取 user数据
                        data = ethPN.methods.partnerUpdateProof(channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature).encodeABI();

                        // 发送ETH交易
                        await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, data);
                    }
                } else {
                    // 发起方为 cp
                    // 获取通道证据
                    let [{balance, nonce, additionalHash, signature: partnerSignature, consignorSignature}] = await Promise.all([
                        appPN.methods.balanceProofMap(channelID, channel.user).call()
                    ]);

                    if (Number(nonce) === 0) {

                    } else {
                        // 获取 cp数据
                        data = ethPN.methods.partnerUpdateProof(channelID, balance, nonce, additionalHash, partnerSignature, consignorSignature).encodeABI();

                        // 发送ETH交易
                        await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, data);
                    }
                }
            }

            let settle = channel.settleBlock;

            // settle 定时器
            while (true) {
                let current = await web3.eth.getBlockNumber();

                // console.log("current:", current);
                // console.log("settle", settle);

                if (current >= settle) {
                    let settleData = ethPN.methods.settleChannel(channelID).encodeABI();

                    // 发送ETH交易
                    let hash = await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, settleData);

                    console.log('Settle Channel HASH:', hash);
                    break;
                }

                // 休眠15s
                await Common.Sleep(15000);

                console.log('settle count down. current:', current, 'target:', settle);
            }

            // if (callbacks.get('Deposit') !== undefined) {
            //     callbacks.get('Deposit')(null, null);
            // }
        }
    },

    'CooperativeSettled': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let {returnValues: {channelID, user}} = event;

            // 获取通道信息
            let channel = await ethPN.methods.channels(channelID).call();

            let userLeaveEvent: USER_LEAVE_EVENT = {channelID, user, amount: channel.userBalance};
            if (callbacks.get('UserLeave')) {
                callbacks.get('UserLeave')(null, userLeaveEvent);
            }
        }
    },

    'ChannelSettled': {
        filter: () => { return {} },
        handler: async (event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let {returnValues: {channelID, user}} = event;

            // 获取通道信息
            let channel = await ethPN.methods.channels(channelID).call();

            let userLeaveEvent: USER_LEAVE_EVENT = {channelID, user, amount: channel.userBalance};
            if (callbacks.get('UserLeave')) {
                callbacks.get('UserLeave')(null, userLeaveEvent);
            }
        }
    },

};