import {Web3} from "../lib/web3";
import {Server} from "../lib/server";
import {Session} from "../lib/session";

export class SDK {
    public server;
    public session;
    public web3;

    constructor() {
        this.web3 = Web3.getInstance();
        this.server = new Server();
        this.session = new Session();
    }

    Deposit() {
        this.server.Deposit();
    }

    Withdraw() {
        this.server.ProposeWithdraw();
    }

    ReBalance() {
        this.server.ReBalance();
    }

    SendAsset() {
        this.server.SendAsset();
    }

    CloseChannel() {
        this.server.CloseChannel();
    }



    SendMessage() {
        this.server.SendMessage();
    }

    SessionStart() {
        this.session.SessionStart();
    }

    SessionEnd() {
        this.session.SessionEnd();
    }

}