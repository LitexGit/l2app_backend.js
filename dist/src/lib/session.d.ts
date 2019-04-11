import { SESSION_STATUS, SessionData } from "../conf/contract";
export declare class Session {
    id: string;
    status: SESSION_STATUS;
    game: string;
    customData: string;
    static sessionList: Map<string, Session>;
    private constructor();
    static InitSession(sessionID: string, game: string, userList: string[], customData: any): Promise<any>;
    static JoinSession(sessionID: string, user: string): Promise<any>;
    static SendSessionMessage(from: string, to: string, sessionData: SessionData, paymentData: string): Promise<any>;
    static CloseSession(sessionID: string): Promise<any>;
    static GetSession(sessionID: string, fromLine?: boolean): Promise<any>;
    static isExists(sessionID: string): Promise<boolean>;
    private initialize;
}
