import { Contract } from "web3/node_modules/web3-eth-contract";
export default class HttpWatcher {
    private enabled;
    private provider;
    private base;
    private blockInterval;
    private contract;
    private watchList;
    constructor(base: any, provider: string, blockInterval: number, watchList: any);
    processEvent(fromBlockNumber: number, toBlockNumber: number, contract: Contract, eventName: string, eventSetting: any): Promise<void>;
    processAllEvent(fromBlockNumber: number, toBlockNumber: number, watchItem: any): Promise<void>;
    start(lastBlockNumber?: number): Promise<void>;
    stop(): Promise<void>;
}
