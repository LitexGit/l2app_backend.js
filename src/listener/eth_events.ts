import {appPN, ethPN, cpProvider, callbacks, web3} from '../lib/server';
import {
    USER_JOIN_EVENT,
    PROVIDER_NEW_DEPOSIT_EVENT,
    USER_NEW_DEPOSIT_EVENT,
    PROVIDER_WITHDRAW_EVENT,
    USER_WITHDRAW_EVENT,
    USER_LEAVE_EVENT, CHANNEL_STATUS
} from "../conf/contract";
import {Common} from "../lib/common";
import {STATUS_CODES} from "http";

// let cp = cpProvider.address;
async function sleep(time: number): Promise<void> {
    return new Promise<void>((res, rej) => {
        setTimeout(res, time);
    });
}

export const ETH_EVENTS = {
    'ProviderNewDeposit': {
        filter: {},
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
        filter: {},
        handler: async (event: any) => {
            console.log("ProviderWithdraw event", event);

            // 获取事件内容
            let {returnValues: {token, amount, balance, lastCommitBlock}} = event;

            let providerWithdrawEvent: PROVIDER_WITHDRAW_EVENT = {token, amount, balance, lastCommitBlock, type: 1};
            if (callbacks.get('Withdraw')) {
                // @ts-ignore
                callbacks.get('Withdraw')(null, providerWithdrawEvent);
            }
        }
    },

    'UserNewDeposit': {
        filter: {},
        handler: async (event: any) => {
            console.log("UserNewDeposit event", event);

            // 获取事件内容
            let {returnValues: {channelID, user, newDeposit, totalDeposit,}} = event;

            let userNewDepositEvent: USER_NEW_DEPOSIT_EVENT = {channelID, user, newDeposit, totalDeposit, type: 2};
            if (callbacks.get('Deposit')) {
                // @ts-ignore
                callbacks.get('Deposit')(null, userNewDepositEvent);
            }
        }
    },

    'UserWithdraw': {
        filter: {},
        handler: async (event: any) => {
            console.log("UserWithdraw event", event);

            // 获取event事件内容
            let {returnValues: {channelID, user, amount, totalWithdraw, lastCommitBlock}} = event;

            let userWithdrawEvent: USER_WITHDRAW_EVENT = {
                channelID,
                user,
                amount,
                totalWithdraw,
                lastCommitBlock,
                type: 2
            };
            if (callbacks.get('Withdraw')) {
                // @ts-ignore
                callbacks.get('Withdraw')(null, userWithdrawEvent);
            }
        }
    },

    'ChannelOpened': {
        filter: {},
        handler: async (event: any) => {
            console.log("ChannelOpened event", event);

            // 获取事件内容
            let {returnValues: {sender, user, token, puppet, amount, settleWindow, channelID}} = event;

            let userJoinEvent: USER_JOIN_EVENT = {sender, user, token, puppet, amount, settleWindow, channelID};
            if (callbacks.get('Asset')) {
                // @ts-ignore
                callbacks.get('Asset')(null, userJoinEvent);
            }
        }
    },

    'ChannelClosed': {
        filter: {},
        handler: async (event: any) => {
            console.log("ChannelClosed event", event);

            // 获取事件内容
            let {returnValues: {channelID}} = event;

            // 获取通道信息
            let channel = await ethPN.methods.channels(channelID).call();

            console.log("channel ------------------------", channel);

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
                        appPN.methods.balanceProofMap(channelID, channel.user).call()
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

                console.log("current:", current);
                console.log("settle", settle);

                if (current >= settle) {
                    let settleData = ethPN.methods.settleChannel(channelID).encodeABI();

                    // 发送ETH交易
                    let hash = await Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, settleData);

                    console.log('Settle Channel HASH:', hash);
                    break;
                }

                // 休眠15s
                await sleep(15000);

                console.log('settle count down. current:', current, 'target:', settle);
            }

            // if (callbacks.get('Deposit') !== undefined) {
            //     // @ts-ignore
            //     callbacks.get('Deposit')(null, null);
            // }
        }
    },

    'CooperativeSettled': {
        filter: {},
        handler: async (event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let {returnValues: {channelID, user}} = event;

            let userLeaveEvent: USER_LEAVE_EVENT = {channelID, user};
            if (callbacks.get('UserLeave')) {
                // @ts-ignore
                callbacks.get('UserLeave')(null, userLeaveEvent);
            }
        }
    },

    'ChannelSettled': {
        filter: {},
        handler: async (event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let {returnValues: {channelID, user}} = event;

            let userLeaveEvent: USER_LEAVE_EVENT = {channelID, user};
            if (callbacks.get('UserLeave')) {
                // @ts-ignore
                callbacks.get('UserLeave')(null, userLeaveEvent);
            }
        }
    },

};