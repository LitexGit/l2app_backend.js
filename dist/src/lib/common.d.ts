import { AbiItem } from "web3/node_modules/web3-utils";
export declare class Common {
    static Abi2JsonInterface(abi: string): AbiItem[] | AbiItem;
    static GetLastCommitBlock(chain?: string): Promise<any>;
    static SendEthTransaction(from: string, to: string, value: number | string, data: string, privateKey: string): Promise<{}>;
    static BuildAppChainTX(from: string, privateKey: string): Promise<{
        privateKey: string;
        from: string;
        nonce: number;
        quota: number;
        chainId: number;
        version: number;
        validUntilBlock: number;
        value: string;
    }>;
    static SendAppChainTX(action: any, from: string, privateKey: string, name: string): Promise<any>;
    static CheckSignature(messageHash: string, signature: string, address: string): boolean;
    static SignatureToHex(messageHash: string, privateKey: string): any;
    static RandomWord(randomFlag: boolean, min: number, max?: number): string;
    static GenerateSessionID(game: string): string;
    static Sleep(time: number): Promise<void>;
}
