export class Server {
    private web3;
    private contract;

    /**
     *
     *
     * @param web3
     */
    constructor (web3) {
        this.web3 = web3;
        this.contract = new this.web3.eth.Contract('', '');
    }

    /**
     * CP充值
     *
     * @description 调用Eth支付合约的充值接口
     *
     * @param address  string token地址
     * @param amount   number 存入金额
     *
     * @returns string 返回交易hash
     */
    Deposit(address: string, amount: number):string {
        this.contract.methods.

        let hash: string;

        hash = '';

        return hash;
    }

    /**
     * CP发起提现申请
     *
     * @description 发送提现请求到AppChain上
     *
     * @param address           string  token地址
     * @param amount            bigint  提现金额
     * @param lastCommitBlock   number  最后区块高度
     *
     * @returns string 返回交易hash
     */
    ProposeWithdraw(address: string, amount: bigint, lastCommitBlock: number) {

    }

    /**
     * 提交提现数据
     *
     * @description 构造Eth交易，将提现请求提交到Eth的支付合约中
     *
     * @param address           string  token地址
     * @param amount            bigint  提现金额
     * @param lastCommitBlock   number  最后区块高度
     * @param signature         bytes   多方联合签名
     *
     * @return
     */
    Withdraw(address: string, amount: bigint, lastCommitBlock: number, signature: Array<bigint>) {

    }

    /**
     * CP ReBalance 操作
     *
     * @description 提交到AppChain的支付合约
     *
     * @param channelId bytes  通道ID
     * @param amount    bigint 挪进通道的总金额
     * @param nonce     number Nonce
     * @param signature bytes  CP签名
     *
     * @return
     */
    ReBalance(channelId: Array<bigint>, amount: bigint, nonce: number, signature: Array<bigint>) {

    }

    /**
     *
     * @description
     *
     * @param channelId bytes  通道ID
     * @param amount    bigint 挪进通道的总金额
     * @param nonce     number Nonce
     * @param hash      bytes   Hash
     */
    CloseChannel(channelId: Array<bigint>, amount: bigint, nonce: number, hash: Array<bigint>, ) {
        // TODO
    }

    /**
     * CP发送资产
     *
     * @description 提交到AppChain的支付合约
     *
     * @param from              string  发送方地址
     * @param to                string  接收方地址
     * @param contractAddress   string  ETH合约地址
     * @param channelId         bytes   通道ID
     * @param amount            bigint  发送金额
     * @param nonce             number  Nonce
     * @param hash              bytes   Hash
     * @param signature         bytes   CP签名
     *
     * @return
     */
    SendAsset (from: string, to: string, contractAddress: string, channelId: Array<bigint>, amount: bigint, nonce: number, hash: Array<bigint>, signature: Array<bigint>) {

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
     *
     * @param channelId             bytes   通道ID
     * @param amount                bigint  用户给CP转账的累计金额
     * @param nonce                 number  Nonce
     * @param hash                  bytes   Hash
     * @param userSignature         bytes   用户签名
     * @param consignorSignature    bytes   CP签名
     */
    UpdateProof(channelId: Array<bigint>, amount: bigint, nonce: number, hash: Array<bigint>, userSignature: Array<bigint>, consignorSignature: Array<bigint>) {

    }

    /**
     *
     * @constructor
     */
    SettleChannel() {

    }



}