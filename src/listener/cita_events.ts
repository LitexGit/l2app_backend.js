import { appPN, ethPN, CITA, cpProvider, callbacks, web3 } from '../lib/server';
import { Common } from "../lib/common";
import { ASSET_EVENT } from "../conf/contract";
import {signHash} from "../lib/sign";

export const CITA_EVENTS = {
    /*
    'ProviderProposeWithdraw': {
        filter: { },
        handler: async (event: any) => {
            console.log("ProviderProposeWithdraw event", event);

            // 获取event事件内容
            let {returnValues: { token, balance, lastCommitBlock }} = event;

            // 检测交易是否成功

            // 签署消息
            let messageHash = web3.utils.soliditySha3(
                {v: ethPN.options.address, t: 'address'},
                {v: token, t: 'address'},
                {v: balance, t: 'int256'},
                {v: lastCommitBlock, t: 'uint256'},
            );
            let signature = Common.SignatureToHex(messageHash);

            // 提交到合约
            let tx = await Common.BuildAppChainTX();

            let res = await appPN.methods.confirmProviderWithdraw(token, signature).send(tx);
            if (res.hash) {
                let receipt = await CITA.listeners.listenToTransactionReceipt(res.hash);

                if (!receipt.errorMessage) {
                    //确认成功
                    console.log("send CITA tx success", receipt);
                } else {
                    //确认失败
                }
            } else {
                // 提交失败
            }

        }
    },

    'ConfirmRebalance': {
        filter: { },
        handler: async (event: any) => {
            console.log("ConfirmRebalance event", event);
            // TODO
        }
    },
    */
    'Transfer': {
        filter: { },
        handler: async (event: any) => {
            console.log("Transfer event", event);
            // 获取event事件内容
            let { returnValues: { from, to, channelID, balance, nonce, additionalHash } } = event;

            let channel = await appPN.methods.channelMap(channelID).call();
            let token = channel.token;

            // 签署消息
            let messageHash = web3.utils.soliditySha3(
                {v: ethPN.options.address, t: 'address'},
                {v: token, t: 'address'},
                {v: balance, t: 'uint256'},
                {v: nonce, t: 'uint256'},
            );

            // 进行签名
            let signature = Common.SignatureToHex(messageHash);

            // 构建交易
            let tx = await Common.BuildAppChainTX();

            let rs = await appPN.methods.submitFee(channelID, token, balance, nonce, signature).send(tx);
            if (rs.hash) {
                let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

                if (!receipt.errorMessage) {
                    //确认成功
                    console.log("send CITA tx success", receipt);

                    let assetEvent: ASSET_EVENT = { from, to, channelID, balance, nonce, additionalHash };
                    if (callbacks.get('Asset')) {
                        // @ts-ignore
                        callbacks.get('Asset')(null, assetEvent);
                    }
                } else {
                    //确认失败
                }
            } else {
                // 提交失败
            }
        }
    },
    /*
    'SubmitFee': {
        filter: { },
        handler: async (event: any) => {
            console.log("SubmitFee event", event);


        }
    },
    */
    'UserProposeWithdraw': {
        filter: { },
        handler: async (event: any) => {
            console.log("UserProposeWithdraw event", event);

            // 获取event事件内容
            let { returnValues: { channelID, amount, lastCommitBlock } } = event;

            // 签署消息
            let messageHash = web3.utils.soliditySha3(
                {v: ethPN.options.address, t: 'address'},
                {v: channelID, t: 'bytes32'},
                {v: amount, t: 'uint256'},
                {v: lastCommitBlock, t: 'uint256'},
            );

            // 进行签名
            let signature = Common.SignatureToHex(messageHash);

            // 构建交易
            let tx = await Common.BuildAppChainTX();

            // 提交到合约
            let rs = await appPN.methods.confirmUserWithdraw(channelID, signature).send(tx);
            if (rs.hash) {
                let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

                if (!receipt.errorMessage) {
                    //确认成功
                    console.log("send CITA tx success", receipt);

                } else {
                    //确认失败
                }
            } else {
                // 提交失败
            }
        }
    },

    'ProposeCooperativeSettle': {
        filter: { },
        handler: async (event: any) => {
            console.log("ProposeCooperativeSettle event", event);

            // 获取event事件内容
            let { returnValues: { channelID, balance, lastCommitBlock } } = event;

            // 签署消息
            let messageHash = web3.utils.soliditySha3(
                {v: ethPN.options.address, t: 'address'},
                {v: channelID, t: 'bytes32'},
                {v: balance, t: 'uint256'},
                {v: lastCommitBlock, t: 'uint256'},
            );

            // 进行签名
            let signature = Common.SignatureToHex(messageHash);

            // 构建交易
            let tx = await Common.BuildAppChainTX();

            // 提交到合约
            let rs = await appPN.methods.confirmCooperativeSettle(channelID, signature).send(tx);
            if (rs.hash) {
                let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

                if (!receipt.errorMessage) {
                    //确认成功
                    console.log("send CITA tx success", receipt);
                } else {
                    //确认失败
                    console.log("confirm fail, error message:", receipt.errorMessage);
                }
            } else {
                // 提交失败
                console.log("send CITA tx fail");
            }
        }
    },

    'ConfirmProviderWithdraw': {
        filter: { },
        handler: async (event: any) => {
            console.log("confirmProviderWithdraw event", event);

            // 获取event事件内容
            let { returnValues: { token, balance, lastCommitBlock } } = event;

            // 从 APPChain 获取 cp 签名
            let [{signature}] = await Promise.all([
                appPN.methods.providerWithdrawProofMap(event.returnValues.token).call()
            ]);

            /*
            // 验证签名
            let messageHash = web3.utils.soliditySha3(
                {v: ethPN.options.address, t: 'address'},
                {v: token, t: 'address'},
                {v: balance, t: 'int256'},
                {v: lastCommitBlock, t: 'uint256'},
            );
            Common.CheckSignature(messageHash, signature, '');
            */

            // 获取数据
            let data = await ethPN.methods.providerWithdraw(token, balance, lastCommitBlock, signature).encodeABI();

            // 提交数据到 ETH
            let hash = Common.SendEthTransaction(cpProvider.address, ethPN.options.address, 0, data);

            console.log(hash);
        }
    },
};