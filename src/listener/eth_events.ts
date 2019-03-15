import { appPN, ethPN, cpProvider, callbacks } from '../lib/server';
import {
    USER_JOIN_EVENT,
    PROVIDER_NEW_DEPOSIT_EVENT,
    USER_NEW_DEPOSIT_EVENT,
    PROVIDER_WITHDRAW_EVENT,
    USER_WITHDRAW_EVENT,
    USER_LEAVE_EVENT
} from "../conf/contract";

// let cp = cpProvider.address;

export const ETH_EVENTS = {
    'ProviderNewDeposit': {
        filter: {  },
        handler: async(event: any) => {
            console.log("ProviderNewDeposit event", event);

            // 获取event事件内容
            let { returnValues: { token, amount, balance } } = event;

            let providerNewDepositEvent: PROVIDER_NEW_DEPOSIT_EVENT = { token, amount, balance, type:1 };
            if (callbacks.get('Deposit')) {
                // @ts-ignore
                callbacks.get('Deposit')(null, providerNewDepositEvent);
            }
        }
    },

    'ProviderWithdraw': {
        filter: {},
        handler: async(event: any) => {
            console.log("ProviderWithdraw event", event);

            // 获取event事件内容
            let { returnValues: { token, amount, balance, lastCommitBlock } } = event;

            let providerWithdrawEvent: PROVIDER_WITHDRAW_EVENT = { token, amount, balance, lastCommitBlock, type:1 };
            if (callbacks.get('Withdraw')) {
                // @ts-ignore
                callbacks.get('Withdraw')(null, providerWithdrawEvent);
            }
        }
    },

    'UserNewDeposit': {
        filter: {},
        handler: async(event: any) => {
            console.log("UserNewDeposit event", event);

            // 获取event事件内容
            let { returnValues: { channelID, user, newDeposit, totalDeposit, } } = event;

            let userNewDepositEvent: USER_NEW_DEPOSIT_EVENT = { channelID, user, newDeposit, totalDeposit, type:2 };
            if (callbacks.get('Deposit')) {
                // @ts-ignore
                callbacks.get('Deposit')(null, userNewDepositEvent);
            }
        }
    },

    'UserWithdraw': {
        filter: {},
        handler: async(event: any) => {
            console.log("UserWithdraw event", event);

            // 获取event事件内容
            let { returnValues: { channelID, user, amount, totalWithdraw, lastCommitBlock } } = event;

            let userWithdrawEvent: USER_WITHDRAW_EVENT = { channelID, user, amount, totalWithdraw, lastCommitBlock, type:2 };
            if (callbacks.get('Withdraw')) {
                // @ts-ignore
                callbacks.get('Withdraw')(null, userWithdrawEvent);
            }
        }
    },

    'ChannelOpened': {
        filter: {},
        handler: async(event: any) => {
            console.log("ChannelOpened event", event);

            // 获取event事件内容
            let { returnValues: { sender, user, token, puppet, amount, settleWindow, channelID } } = event;

            let userJoinEvent: USER_JOIN_EVENT = { sender, user, token, puppet, amount, settleWindow, channelID };
            if (callbacks.get('Asset')) {
                // @ts-ignore
                callbacks.get('Asset')(null, userJoinEvent);
            }
        }
    },

    'ChannelClosed': {
        filter: {},
        handler: async(event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let { returnValues: { token, amount, nonce, channelID } } = event;

            // let [{ balance, nonce, additionalHash, partnerSignature }] = await Promise.all([ appPN.methods.balanceProofMap(channelID, cpAdd).call() ]);
            // function partnerUpdateProof (
            //         bytes32 channelID,
            //         uint256 balance,
            //         uint256 nonce,
            //         bytes32 additionalHash,
            //         bytes memory partnerSignature,
            //         bytes memory consignorSignature
            //     )

            /*
             consignorSignature = CP PK 签名

            * bytes32 messageHash = keccak256(
                abi.encodePacked(
                    address(this), //this.ethPaymentNetwork
                    channelID,
                    balance,
                    nonce,
                    additionalHash,
                    partnerSignature
                )
            );

            // 提交 .ethPaymentNetwork. partnerUpdateProof
            */

            // if (callbacks.get('Deposit') !== undefined) {
            //     // @ts-ignore
            //     callbacks.get('Deposit')(null, null);
            // }

        }
    },

    'CooperativeSettled': {
        filter: {},
        handler: async(event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let { returnValues: { channelID, user } } = event;

            let userLeaveEvent: USER_LEAVE_EVENT = { channelID, user };
            if (callbacks.get('UserLeave')) {
                // @ts-ignore
                callbacks.get('UserLeave')(null, userLeaveEvent);
            }
        }
    },

    'ChannelSettled': {
        filter: {},
        handler: async(event: any) => {
            console.log("ChannelClosed event", event);

            // 获取event事件内容
            let { returnValues: { channelID, user } } = event;

            let userLeaveEvent: USER_LEAVE_EVENT = { channelID, user };
            if (callbacks.get('UserLeave')) {
                // @ts-ignore
                callbacks.get('UserLeave')(null, userLeaveEvent);
            }
        }
    },

};