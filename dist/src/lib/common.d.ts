import { AbiItem } from 'web3/node_modules/web3-utils';
export declare class Common {
    static Abi2JsonInterface(abi: string): AbiItem[] | AbiItem;
    static GetLastCommitBlock(chain?: string): Promise<any>;
    static SendEthTransaction(from: string, to: string, value: number | string, data: string): Promise<{}>;
    static BuildAppChainTX(): Promise<{
        privateKey: any;
        from: any;
        nonce: number;
        quota: number;
        chainId: number;
        version: number;
        validUntilBlock: number;
        value: string;
    }>;
    static CheckSignature(messageHash: string, signature: string, address: string): boolean;
    static SignatureToHex(messageHash: string): any;
    static RandomWord(randomFlag: boolean, min: number, max?: number): string;
    static GenerateSessionID(game: string): string;
    static Sleep(time: number): Promise<void>;
}
