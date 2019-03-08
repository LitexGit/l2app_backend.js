import {EthWeb3} from "./web3";

/**
 */
export class ETHContract {

    public static instance: ETHContract;

    // 禁止 New 创建
    private constructor() {}

    // 获取 web3 对象
    static getInstance(): ETHContract {

        if (!ETHContract.instance) {
            let web3 = EthWeb3.getInstance();
            ETHContract.instance = new web3.eth.Contract(paymentContractAbi, paymentContractAddress);
        }

        return ETHContract.instance;
    }
}