export class ETHListener {

    public web3;

    public ethPaymentNetwork;

    constructor(web3, ethPaymentNetwork) {
        this.web3 = web3;
        this.ethPaymentNetwork = ethPaymentNetwork;
    }

    /**
     * 监听Eth充值交易结果
     */
    async NewDeposit(error, event) {

    }

    /**
     * 监听Eth提现交易结果
     */
    ProviderWithdraw(error, event) {

    }

    UserJoin(error, event) {

    }

    UserDeposit(error, event) {

    }

    UserWithdraw(error, event) {

    }

    UserLeave(error, event) {

    }

    ChannelClosed(error, event) {

    }

    /*TODO
        强关事件检测，处理方法分两类
        1. 用户发起强关
        2. CP发起强关
    */

    Start() {
        this.ethPaymentNetwork.events.NewDeposit({}, this.NewDeposit.bind(this));
        this.ethPaymentNetwork.events.ProviderWithdraw({}, this.ProviderWithdraw.bind(this));
        this.ethPaymentNetwork.events.UserJoin({}, this.UserJoin.bind(this));
        this.ethPaymentNetwork.events.UserDeposit({}, this.UserDeposit.bind(this));
        this.ethPaymentNetwork.events.UserWithdraw({}, this.UserWithdraw.bind(this));
        this.ethPaymentNetwork.events.UserLeave({}, this.UserLeave.bind(this));
        this.ethPaymentNetwork.events.ChannelClosed({}, this.ChannelClosed.bind(this));
    }
}