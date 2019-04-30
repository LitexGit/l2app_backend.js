"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TX = require("ethereumjs-tx");
const ethUtil = require("ethereumjs-util");
let ethNonce = new Map();
function getEthNonce(address) {
    if (ethNonce.get(address) > 0) {
        return ethNonce.get(address);
    }
    else {
        return 0;
    }
}
const contract_1 = require("../conf/contract");
const server_1 = require("./server");
const mylog_1 = require("./mylog");
class Common {
    static Abi2JsonInterface(abi) {
        let abiItem = JSON.parse("{}");
        try {
            let abiArray = JSON.parse(abi);
            if (!Array.isArray(abiArray))
                return abiItem;
            return abiArray;
        }
        catch (e) {
            return abiItem;
        }
    }
    static async GetLastCommitBlock(chain = "eth") {
        return chain === "eth"
            ? (await server_1.web3.eth.getBlockNumber()) + contract_1.COMMIT_BLOCK_CONDITION
            : (await server_1.CITA.base.getBlockNumber()) + 88;
    }
    static async SendEthTransaction(from, to, value, data, privateKey) {
        let nonce = await server_1.web3.eth.getTransactionCount(from);
        if (nonce > getEthNonce(from)) {
            ethNonce.set(from, nonce);
        }
        else {
            nonce = getEthNonce(from) + 1;
            ethNonce.set(from, nonce);
        }
        let rawTx = {
            from: from,
            nonce: "0x" + nonce.toString(16),
            chainId: await server_1.web3.eth.net.getId(),
            to: to,
            data: data,
            value: server_1.web3.utils.toHex(value),
            gasPrice: server_1.web3.utils.toHex(await server_1.web3.eth.getGasPrice()),
            gasLimit: server_1.web3.utils.toHex(300000)
        };
        let tx = new TX(rawTx);
        let priKey = privateKey;
        if (priKey.substr(0, 2) === "0x") {
            tx.sign(Buffer.from(priKey.substr(2), "hex"));
        }
        else {
            tx.sign(Buffer.from(priKey, "hex"));
        }
        let serializedTx = tx.serialize();
        let txData = "0x" + serializedTx.toString("hex");
        mylog_1.logger.debug("SEND ETH TX", rawTx);
        return new Promise((resolve, reject) => {
            try {
                server_1.web3.eth
                    .sendSignedTransaction(txData)
                    .on("transactionHash", (value) => {
                    mylog_1.logger.debug("transactionHash: ", value);
                    resolve(value);
                })
                    .on("error", (error) => {
                    mylog_1.logger.error("transaction error", error);
                    reject(error);
                });
            }
            catch (e) {
                mylog_1.logger.error("transaction exception", e);
                reject(e);
            }
        });
    }
    static async BuildAppChainTX(from, privateKey) {
        let tx = {
            ...contract_1.TX_BASE,
            privateKey,
            from
        };
        tx.validUntilBlock = await Common.GetLastCommitBlock("cita");
        return tx;
    }
    static async SendAppChainTX(action, from, privateKey, name) {
        mylog_1.logger.debug("start send CITA tx", action.arguments);
        let tx = await this.BuildAppChainTX(from, privateKey);
        let rs = await action.send(tx);
        if (rs.hash) {
            let receipt = await server_1.CITA.listeners.listenToTransactionReceipt(rs.hash);
            if (!receipt.errorMessage) {
                mylog_1.logger.info(`CITATX ${name} success`, rs.hash);
                return rs.hash;
            }
            else {
                mylog_1.logger.error(`CITATX ${name} error ${receipt.errorMessage}`, rs.hash, action.arguments, tx);
                throw new Error(`CITATX ${name} fail ${receipt.errorMessage}`);
            }
        }
        else {
            mylog_1.logger.error(`CITATX ${name} fail`, rs.hash, action.arguments, tx);
            throw new Error("send CITA tx fail");
        }
    }
    static CheckSignature(messageHash, signature, address) {
        let messageHashBuffer = Buffer.from(messageHash.replace("0x", ""), "hex");
        let sigDecoded = ethUtil.fromRpcSig(Buffer.from(signature.replace("0x", ""), "hex"));
        let recoveredPub = ethUtil.ecrecover(messageHashBuffer, sigDecoded.v, sigDecoded.r, sigDecoded.s);
        let recoveredAddress = ethUtil.pubToAddress(recoveredPub).toString("hex");
        recoveredAddress = "0x" + recoveredAddress;
        return recoveredAddress.toLowerCase() == address.toLowerCase();
    }
    static SignatureToHex(messageHash, privateKey) {
        let messageHex = messageHash.substr(0, 2) == "0x" ? messageHash.substr(2) : messageHash;
        let privateKeyHex = privateKey.substr(0, 2) == "0x" ? privateKey.substr(2) : privateKey;
        let messageBuffer = Buffer.from(messageHex, "hex");
        let privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
        let signatureObj = ethUtil.ecsign(messageBuffer, privateKeyBuffer);
        return ethUtil
            .toRpcSig(signatureObj.v, signatureObj.r, signatureObj.s)
            .toString("hex");
    }
    static RandomWord(randomFlag, min, max = 12) {
        let str = "", range = min, arr = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z"
        ];
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        let pos;
        for (let i = 0; i < range; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }
    static GenerateSessionID(game) {
        let timestamp = new Date().getTime();
        let random = this.RandomWord(true, 6, 32);
        return server_1.web3.utils.soliditySha3({ v: game, t: "address" }, { v: timestamp, t: "uint256" }, { v: random, t: "bytes32" });
    }
    static async Sleep(time) {
        return new Promise((res, rej) => {
            setTimeout(res, time);
        });
    }
}
exports.Common = Common;
//# sourceMappingURL=common.js.map