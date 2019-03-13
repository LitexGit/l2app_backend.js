export class AppChainListener {
    public web3;

    public cita;

    public abi;

    constructor(web3, cita, abi) {
        this.web3 = web3;
        this.cita = cita;
        this.abi  = abi;
    }

    /**
     * 监听APPChain 确认CP提现申请的有效性
     *
     * @description 监听到 CP发起申请提现请求
     */
    confirmProviderWithdraw() {
        /*FIX
            regulator已经签名， 此时需要调用server.ts中的ProviderWithdraw方法，向ETH提交取现
            1. 查询providerWithdrawProofMap[token]获取相关参数
            2. 调用server.ts中的ProviderWithdraw方法
        */
    }

    /**
     * 监听APPChain
     *
     * @constructor
     */
    ProviderProposeWithdraw() {
        // 可以不做处理
    }

    /**
     * 监听APPChain 确认CP ReBalance申请的有效性
     *
     * @constructor
     */
    ConfirmReBalance() {

    }

    /**
     *
     * @constructor
     */
    SessionMessage() {

    }

    /**
     *
     * @constructor
     */
    Asset() {
        /*FIX
            收到Transfer事件后，需要提交相应的手续费证明

            1. 从Transfer事件中获取ChannelID等阐述
            2. 查询arrearBalanceProofMap[channelID], 获取相关参数
            3. 构造手续费签名, token/amount/nonce可从step2获取
                signature = sign(soliditySha3(ethPaymentContractAddress, token, amount, nonce), providerPrivateKey)
            4. 调用appchainPaymentContract.submitFee(), 参数从 step2 和 step3中获取
        */
        

    }

    
    SubmitFee() {
        // 手续费证明提交成功，Provider收到付款，此时可以向外部抛出事件

    }

    UserProposeWithdraw() {
        // 需要审核用户的取现申请
        // 获取数据
        // 签名
        // 提交数据

    }

    UserProposeCooperativeSettle() {
        // 需要审核用户的协商关申请
        // 获取数据
        // 签名
        // 提交数据
    }

    
    Start() {
        const filter = {
            address: '',
            fromBlock: '0x0',
        };

        /*FIX
        使用http事件监听appchain的方法可以参考：https://gitlab.f3m.club/l2/l2reviewer/blob/master/eventWatcher.js
        */

        this.cita.base.getLogs(filter, this.abi).then(

        );
    }


}