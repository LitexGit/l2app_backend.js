import { Contract } from 'web3/node_modules/web3-eth-contract';
import { provider } from 'web3-providers';
import { BN } from 'web3-utils';

import CITASDK from '@cryptape/cita-sdk';

import { Common } from "./common";
import {ETHListener} from "../listener/eth_listener";
import {AppChainListener} from "../listener/app_chain_listener";

import { ERC20ABI, ADDRESS_ZERO } from '../conf/contract';
import HttpWatcher from "../listener/listener";
import {ETH_EVENTS} from "../listener/eth_events";

const Web3 = require('web3');
// import Web3 from "web3";

// 定义 PaymentNetwork 合约对象
export type PN = {
    address: string,
    abi: string
};

export type L2_EVENT = 'Deposit' | 'Withdraw' | 'ForceWithdraw' | 'Transfer' | 'DisablePuppet';
export type L2_CB = (err: any, res: any) => { };
export var callbacks: Map<L2_EVENT, L2_CB>; // callbacks for L2.on

export class SDK {
    public static instance: SDK;

    public web3;
    public cita;

    public ethContractAddress;
    public appChainContract;

    public ethPaymentNetwork;
    public appPaymentNetwork;

    public cpProvider;

    public erc20;

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
     * @param cpPrivateKey      string
     * @param ethProvider       provider
     * @param ethContract       PN
     * @param appRpcUrl         string
     * @param appChainContract  PN
     * @constructor
     */
    async Init(cpPrivateKey: string, ethProvider: provider, ethContract: PN, appRpcUrl: string, appChainContract: PN) {
        this.web3    = new Web3(Web3.givenProvider || ethProvider);

        this.cita = CITASDK(appRpcUrl);

        this.ethPaymentNetwork  = new Contract(ethProvider, Common.Abi2JsonInterface(ethContract.abi), ethContract.address);
        this.appPaymentNetwork = new this.cita.base.Contract(Common.Abi2JsonInterface(appChainContract.abi), appChainContract.address);

        this.ethContractAddress = ethContract.address;
        this.appChainContract   = appChainContract.address;

        this.cpProvider = this.web3.eth.accounts.privateKeyToAccount(cpPrivateKey);

        this.erc20 = new Contract(ethProvider, Common.Abi2JsonInterface(ERC20ABI));

        // 监听 ETH合约事件
        new HttpWatcher(this.web3.eth, 15000, this.ethPaymentNetwork, ETH_EVENTS).start();
        // new ETHListener(this.web3, this.ethPaymentNetwork, this.appPaymentNetwork).Start();

        // 监听 appChain合约事件
        // new AppChainListener(this.web3, this.cita, Common.Abi2JsonInterface(appChainContract.abi)).Start();
    }

    /**
     * CP充值
     *
     * @description 调用Eth支付合约的充值接口
     *
     * @param amount   number 存入金额
     * @param token    string token地址，0x0 eth  其它 token
     *
     * @returns string 返回交易hash
     */
    async Deposit(amount: number, token: string = ADDRESS_ZERO) {
        let data = this.ethPaymentNetwork.methods.providerDeposit(token, amount).encodeABI();

        let balance = amount;
        // 其它token
        if(token !== ADDRESS_ZERO) {
            // 授权合约能从账户扣token
            let erc20Data = this.erc20.methods.approve(this.ethContractAddress, amount).encodeABI();

            // 发送ERC20交易
            await this.SendEthTransaction(this.cpProvider.address, token, 0, erc20Data);

            // 充值金额
            balance = 0;
        }

        // 发送ETH交易
        let rs = await this.SendEthTransaction(this.cpProvider.address, this.ethContractAddress, balance, data);

        // let rs = await this.ethPaymentNetwork.methods.providerDeposit(token, amount).send();
        // rs 进行如下判断
        // 1. 提交失败
        // 2. 确认失败
        // 3. 确认成功， 等待审核
        // cp 不主动与用户开通道， 不做开通道处理

        return rs;
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

        // 从 APPChain 获取 cp 签名
        let signature = await Promise.all([
            this.appPaymentNetwork.methods.providerWithdrawProofMap(this.cpProvider.address).call()
        ]);

        // 将提现请求提交到Eth
        /*FIX
            1. 此处前三个参数的含义与appPaymentNetwork.methods.providerProposeWithdraw的参数一致
            2. 第四个参数表示regulator的签名，可从appPayment中查询 providerWithdrawProofMap[token].signature
        */
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
     * @param userAddress string 用户地址
     * @param amount    bigint 挪进通道的金额
     *
     * @return
     */
    async ProposeReBalance(token: string, userAddress: string, amount: bigint) {
        // 从 ETH 获取通道信息
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(userAddress, token).call();

        // 通道未开通检测
        if(!channelID) {
            return false;
        }

        // 总金额检测， 判断是否有足够资金

        // 获取 appChain Nonce;
        let nonce = this.cita.base.getBlockNumber() + 1;

        let reBalanceType = true;

        // 对以上数据进行签名
        let signature = this.cita.base.sign('', this.cpProvider.address);

        // rebalanceProfMap
        // struct RebalanceProof {
        //         bytes32 channelID;
        //         uint256 amount;
        //         uint256 nonce;
        //         bytes providerSignature;
        //         bytes regulatorSignature;
        //     }
        let balance = 0;
        // balance = RebalanceProof.amount + amount
        // nonce = RebalanceProof.nonce + 1

        // 向 appChain 提交 ReBalance 申请
        let rs = await this.appPaymentNetwork.methods.proposeRebalance(channelID, balance, nonce, signature).call();

        // sign =
        // bytes32 messageHash = keccak256(
        //             abi.encodePacked(
        //                 onchainPayment,
        //                 channelID,
        //                 amount,
        //                 nonce
        //             )
        //         );
        // web3.utils.soliditySha3()

        // 等待 ConfirmRebalance 事件回调
    }

    /**
     * cp 关闭通道
     *
     * @param token
     * @param userAddress
     * @constructor
     */
    async CloseChannel(token: string, userAddress: string) {
        // 从 ETH 获取通道信息
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(userAddress, token).call();

        // 通道未开通 检测
        if (!channelID) {
            return false;
        }

        /*FIX
            rebalanceProofMap的参数已经变动
            closeChannel的参数已经修改
        */

        // AppChain 获取缓存数据
        let [{ balance, nonce, additionalHash, partnerSignature },
            { inAmount, inNonce, regulatorSignature, inProviderSignature }]
            = await Promise.all([
            this.appPaymentNetwork.methods.balanceProofMap(channelID, this.cpProvider.address).call(),
            this.appPaymentNetwork.methods.rebalanceProofMap(channelID).call()
        ]);

        // 向eth 提交强关请求
        let rs = await this.ethPaymentNetwork.methods.closeChannel(
            channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, inProviderSignature
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
        let channelID = await this.ethPaymentNetwork.methods.getChannelID(this.cpProvider.address, token).call();

        // 构造交易结构体
        let tx = {
            nonce: 999999,
            quota: 1000000,
            chainId: 1,
            version: 1,
            validUntilBlock: 999999,
            value: '0x0',
            from: this.cpProvider.address,
        };


        // 获取 cita block Number
        tx.validUntilBlock = this.cita.base.getBlockNumber() + 1;

        // get balance proof from appChain contract
        let { balance, nonce, additionalHash } = await this.appPaymentNetwork.methods.balanceProofMap(channelID, to).call();

        balance = new BN(amount).add(balance);
        nonce += 1;

        // cp 签名
        let signature = this.web3.utils.soliditySha3(this.ethPaymentNetwork, channelID, balance, nonce, additionalHash);

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
        // let { balance, nonce, additionalHash, partnerSignature } = await this.appPaymentNetwork.methods.balanceProofMap(channelID, cpAdd).call();
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
    }

    /**
     *
     * @constructor
     */
    SettleChannel() {
        // channelID
        // 设置定时器， 定时器为 区块号  eth  channelMap[channelID].settleBlock
    }

    /**
     * 外部设置事件回调
     * @param event 外部事件名
     * @param callback 外部设置的回调
     */
    on(event: L2_EVENT, callback: L2_CB){
        // callbacks.set(event, callback);
    }


    private async SendEthTransaction(from: string, to: string, value: number | string | BN, data: string) {
        // this.web3.eth.sendTransaction({ from, to, value, data }, function (err: any, result: any) {
        //     console.log("send Transaction", err, result);
        // });

        let nonce = await this.web3.eth.getTransactionCount(from);

        let transaction = {
            from: from,
            nonce: "0x" + nonce.toString(16),
            gasPrice: this.web3.utils.toHex(8 * 1e9),
            gasLimit: this.web3.utils.toHex(600000),
            to: to,
            value: this.web3.utils.toHex(value),
            data: data,
            chainId: await this.web3.eth.net.getId(),
        };

        console.log("transaction", transaction);return;

        let rawTransaction = this.web3.eth.accounts.signTransaction(transaction, this.cpProvider.privateKey);

        return this.web3.eth.sendSignedTransaction(rawTransaction);
    }

}