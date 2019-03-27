import { Contract } from 'web3/node_modules/web3-eth-contract';
import { provider } from 'web3-providers';
import { Session } from "./session";
export declare type PN = {
    address: string;
    abi: string;
};
export declare type SessionData = {
    sessionID: string;
    mType: string;
    content: string;
    signature: string;
};
export declare type PaymentData = {
    channelID: string;
    balance: string;
    nonce: string;
    additionalHash: string;
    paymentSignature: string;
};
export declare type L2_EVENT = 'Message' | 'UserDeposit' | 'UserWithdraw' | 'UserForceWithdraw' | 'ProviderWithdraw' | 'Transfer';
export declare type L2_CB = (err: any, res: any) => void;
export declare let CITA: any;
export declare let cpProvider: any;
export declare let web3: any;
export declare let ethPN: Contract;
export declare let appPN: Contract;
export declare let ERC20: Contract;
export declare let sessionPN: Contract;
export declare let callbacks: Map<L2_EVENT, L2_CB>;
export declare class SDK {
    static instance: SDK;
    private constructor();
    static GetInstance(): SDK;
    private ethWatcher;
    private appWatcher;
    Init(cpPrivateKey: string, ethProvider: provider, ethPaymentNetwork: PN, appRpcUrl: string, appPaymentNetwork: PN): Promise<void>;
    Deposit(amount: number | string, token?: string): Promise<{}>;
    Withdraw(amount: number | string, token?: string): Promise<false | "confirm success" | "confirm fail" | "send CITA tx fail">;
    Rebalance(userAddress: string, amount: number | string, token?: string): Promise<false | "confirm success" | "confirm fail" | "send CITA tx fail">;
    KickUser(userAddress: string, token?: string): Promise<void>;
    Transfer(to: string, amount: number | string, token?: string): Promise<"confirm success" | "confirm fail" | "send CITA tx fail">;
    StartSession(sessionID: string, game: string, customData: any): Promise<boolean>;
    GetSession(sessionID: string): Promise<Session>;
    SendMessage(sessionID: string, to: string, type: string, content: string, amount?: string, token?: string): Promise<string>;
    CloseSession(sessionID: string): Promise<void>;
    on(event: L2_EVENT, callback: L2_CB): void;
    GetPaymentNetwork(token?: string): Promise<{
        userCount: any;
        userTotalDeposit: any;
        userTotalWithdraw: any;
        providerDeposit: any;
        providerWithdraw: any;
        providerBalance: any;
        providerOnChainBalance: any;
    }>;
    GetChannelInfo(userAddress: string, token?: string): Promise<any>;
    GetAllTXs(token?: string): Promise<any>;
    GetMessagesBySessionId(sessionID: string): Promise<any>;
    GetPlayersBySessionId(sessionID: string): Promise<any>;
    private initListeners;
}
