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
        //
    }

    /**
     * 监听APPChain
     *
     * @constructor
     */
    ProviderProposeWithdraw() {

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

    }

    Start() {
        const filter = {
            address: '',
            fromBlock: '0x0',
        };

        this.cita.base.getLogs(filter, this.abi).then(

        );
    }


}