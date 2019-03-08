import CITASDK from "@cryptape/cita-sdk"

/**
 */
export class AppChainContract {

    public static instance: AppChainContract;

    // 禁止 New 创建
    private constructor() {}

    // 获取 web3 对象
    static getInstance(): AppChainContract {

        if (!AppChainContract.instance) {
            let cita = CITASDK(appChainUrl);
            AppChainContract.instance = new cita.base.Contract(appChainContractAbi, appChainContractAddress);
        }

        return AppChainContract.instance;
    }
}