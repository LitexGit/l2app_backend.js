import { SessionData, PaymentData } from "./server";
import { SESSION_STATUS } from "../conf/contract";
export declare class Session {
    id: string;
    status: SESSION_STATUS;
    game: string;
    customData: string;
    static sessionList: Map<string, Session>;
    private constructor();
    static InitSession(sessionID: string, game: string, customData: any): Promise<"confirm success" | "confirm fail" | "send CITA tx fail">;
    static JoinSession(sessionID: string, user: string): Promise<"confirm success" | "confirm fail" | "send CITA tx fail">;
    static SendSessionMessage(from: string, to: string, sessionData: SessionData, paymentData: PaymentData): Promise<any>;
    static CloseSession(sessionID: string): Promise<"confirm success" | "confirm fail" | "send CITA tx fail">;
    static GetSession(sessionID: string, fromLine?: boolean): Promise<any>;
    static isExists(sessionID: string): Promise<boolean>;
    private initialize;
}
