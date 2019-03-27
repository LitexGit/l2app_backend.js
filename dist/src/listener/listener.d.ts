import { Contract } from 'web3/node_modules/web3-eth-contract';
export default class HttpWatcher {
    private enabled;
    private base;
    private blockInterval;
    private contract;
    private watchList;
    constructor(base: any, blockInterval: number, watchList: any);
    delay(duration: number): Promise<{}>;
    processEvent(fromBlockNumber: number, toBlockNumber: number, contract: Contract, eventName: string, eventSetting: any): Promise<void>;
    start(lastBlockNumber?: number): Promise<void>;
    stop(): Promise<void>;
}
