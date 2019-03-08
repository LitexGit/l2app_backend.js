import Web3 from "web3";

/**
 *  单例模式 返回 web3 对象
 */
export class EthWeb3 {

    public static instance: Web3;

    // 禁止 New 创建
    private constructor() {}

    // 获取 web3 对象
    static getInstance(): Web3 {
        if (!EthWeb3.instance) {
            EthWeb3.instance = new Web3(ethWSUrl);
        }

        return EthWeb3.instance;
    }
}