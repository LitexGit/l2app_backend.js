import { Contract } from 'web3-eth-contract/types';
import { provider } from 'web3-providers/types';
import { BN } from 'web3-utils/types';

import Web3 from "web3/types";
import CITASDK from '@cryptape/cita-sdk';

import { Common } from "./common";

// 定义 PaymentNetwork 合约对象
export type PN = {
    address: string,
    abi: string
};

export class SDK {
    public static instance: SDK;

    public web3;
    public cita;
    public ethPaymentNetwork;
    public appPaymentNetwork;

    public cpAddress;

    // 私有函数，不允许外部使用 new函数 创建
    private constructor() {}

    // 单例模式 返回SDK对象
    public static GetInstance(): SDK {
        if (this.instance === undefined) {
            this.instance = new SDK();
        }

        return this.instance;
    }

    /**
     * 初始化 SDK
     *
     * @param cpAddress       string
     * @param ethProvider       provider
     * @param ethContract       PN
     * @param appRpcUrl         string
     * @param appChainContract  PN
     * @constructor
     */
    async Init(cpAddress: string, ethProvider: provider, ethContract: PN, appRpcUrl: string, appChainContract: PN) {
        this.cpAddress = cpAddress;

        this.web3    = new Web3(ethProvider);

        this.cita = CITASDK(appRpcUrl);

        this.ethPaymentNetwork  = new Contract(ethProvider, Common.Abi2JsonInterface(ethContract.abi), ethContract.address);
        this.appPaymentNetwork = new this.cita.base.Contract(Common.Abi2JsonInterface(appChainContract.abi), appChainContract.address);
    }

    /**
     * CP充值
     *
     * @description 调用Eth支付合约的充值接口
     *
     * @param token    string token地址
     * @param amount   number 存入金额
     *
     * @returns string 返回交易hash
     */
    async Deposit(token: string, amount: number) {
        // 从 ETH 获取通道信息
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(this.cpAddress, token).call();

        // 查询到通道id (已经开通通道)
        if (channelID) {
            // 根据 通道ID 获取通道详情
            let channelInfo = await this.ethPaymentNetwork.methods.channels(channelID).call();
            // 用户通道状态正常
            if (channelInfo.status === CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
                // 进行 cp 充值操作
                let rs = await this.ethPaymentNetwork.methods.providerDeposit(token, amount).call();
                // rs 进行如下判断
                // 1. 提交失败
                // 2. 确认失败
                // 3. 确认成功， 等待审核
            }
        }
        // cp 不主动与用户开通道， 不做开通道处理
    }

    /**
     * CP发起提现申请
     *
     * @description 发送提现请求到AppChain上
     *
     * @param token            string  token地址
     * @param amount            bigint  提现金额
     * @param lastCommitBlock   number  最后区块高度
     *
     * @returns string 返回交易hash
     */
    async ProposeWithdraw(token: string, amount: bigint, lastCommitBlock: number) {
        // 从 ETH 获取通道信息
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(this.cpAddress, token).call();
        // 问题：如何获取 CP通道余额？

        // 余额检测
        // 输入的提现余额 大于 有效的可提现金额时 直接打回 (合约有同样的判断)

        // 余额监测通过
        // 调用 AppChain 合约
        // 使用 CP的 私钥  与 ETH 同一个
        // 参数 amount 与合约不一致， 应该为：  balance = paymentnetwork.providerBalance - amount
        let balance = 0;
        // lastCommitBlock 从 eth 获取
        let rs = await this.appPaymentNetwork.methods.providerProposeWithdraw(token, balance, lastCommitBlock);
        // rs 进行如下情况判断
        // 1. 提交失败
        // 2. 确认失败
        // 3. 确认成功， 等待审核

        // 等待 ProviderProposeWithdraw 事件回调
    }


    /**
     * 审核通过, 提交提现数据到ETH
     *
     * @description 构造Eth交易，将提现请求提交到Eth的支付合约中
     *
     * @param token             string  token地址
     * @param amount            bigint  提现金额
     * @param lastCommitBlock   number  最后区块高度
     *
     * @return
     */
    async Withdraw(token: string, amount: bigint, lastCommitBlock: number) {
        // 参数 token, amount, lastCommitBlock   由 eth event回调返回

        // cp 签名
        let signature = '';

        // 将提现请求提交到Eth
        let rs = await this.ethPaymentNetwork.methods.providerWithdraw(token, amount, lastCommitBlock, signature);
        // rs 进行如下情况判断
        // 1. 提交失败
        // 2. 确认失败
        // 3. 确认成功， 等待审核

        // 等待 ConfirmProviderWithdraw 事件回调
    }

    /**
     * CP ReBalance 操作
     *
     * @description 提交到AppChain的支付合约
     *
     * @param token     string token地址
     * @param amount    bigint 挪进通道的总金额
     *
     * @return
     */
    async ProposeReBalance(token: string, amount: bigint) {
        // 从 ETH 获取通道信息
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(this.cpAddress, token).call();

        // 通道未开通检测
        if(!channelID) {
            return false;
        }

        // 总金额检测， 判断是否有足够资金

        // 参数 amount 与合约不一致， 应该为：  balance = paymentnetwork.providerBalance + amount
        let balance = 0;

        // 获取 appChain Nonce;
        let nonce = this.cita.base.getBlockNumber() + 1;

        let reBalanceType = true;

        // 对以上数据进行签名
        let signature = this.cita.base.sign('', this.cpAddress);

        // 向 appChain 提交 ReBalance 申请
        let rs = await this.appPaymentNetwork.methods.proposeRebalance(channelID, balance, nonce, signature).call();

        // 等待 ConfirmRebalance 事件回调
    }

    /**
     *
     *
     * @param token
     * @constructor
     */
    async CloseChannel(token: string) {
        // 从 ETH 获取通道信息
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(this.cpAddress, token).call();

        // 通道未开通 检测
        if (!channelID) {
            return false;
        }

        // AppChain 获取缓存数据
        let [{ balance, nonce, additionalHash, partnerSignature },
            { inAmount, inNonce, regulatorSignature, inProviderSignature, outAmount, outNonce, userSignature, outProviderSignature }]
            = await Promise.all([
            this.appPaymentNetwork.methods.balanceProofMap(channelID, this.cpAddress).call(),
            this.appPaymentNetwork.methods.rebalanceProofMap(channelID).call()
        ]);

        // 向eth 提交强关请求
        let rs = await this.ethPaymentNetwork.methods.closeChannel(
            channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, inProviderSignature,
            outAmount, outNonce, userSignature, outProviderSignature
        ).call();

        // 等待 ChannelClosed 事件回调
    }

    /**
     * cp 转账操作
     *
     * @description 提交到AppChain的支付合约
     *
     * @param to     接收方地址
     * @param amount 转账金额
     * @param token  token地址
     *
     * @constructor
     */
    async SendAsset (to: string, amount: string, token: string) {
        // 获取通道id
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(this.cpAddress, token).call();

        // 构造交易结构体
        let tx = {
            nonce: 999999,
            quota: 1000000,
            chainId: 1,
            version: 1,
            validUntilBlock: 999999,
            value: '0x0',
            from: this.cpAddress,
        };

        // 获取 cita block Number
        let blockNumber = this.cita.base.getBlockNumber() + 1;
        tx.validUntilBlock = blockNumber;

        // get balance proof from appChain contract
        let { balance, nonce, additionalHash } = await this.appPaymentNetwork.methods.balanceProofMap(channelID, this.cpAddress).call();
        balance = new BN(amount).add(balance);

        // cp 签名
        let signature = this.web3.utils.soliditySha3(this.ethPaymentNetwork, channelID, balance, nonce, additionalHash)

        // 发送转账交易
        let rs = await this.appPaymentNetwork.methods.transfer(to, channelID, balance, nonce, additionalHash).send(tx);

        // 等待 Transfer 事件回调
    }

    /**
     *
     * @constructor
     */
    SendMessage() {

    }

    /**
     *
     * @constructor
     */
    ConfirmUserWithdraw() {

    }

    /**
     * 用户关闭通道, CP提交通道证据
     *
     * @description 从AppChain上获取最新的通道状态数据，提交到ETH支付合约
     */
    UpdateProof(token: string) {
        
    }

    /**
     *
     * @constructor
     */
    SettleChannel() {

    }

}