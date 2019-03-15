import { AbiItem } from 'web3/node_modules/web3-utils';
import { BN } from 'web3-utils';
const TX = require('ethereumjs-tx');
const ethUtil = require('ethereumjs-util');

import {COMMIT_BLOCK_CONDITION, TX_BASE} from "../conf/contract";

import {CITA, web3, cpProvider} from "./server";

export class Common {

    static Abi2JsonInterface(abi: string): AbiItem[] | AbiItem {
        let abiItem: AbiItem = JSON.parse('{}');

        try {
            let abiArray: AbiItem[] = JSON.parse(abi);
            if (!Array.isArray(abiArray)) return abiItem;
            return abiArray;
        } catch(e) {
            return abiItem;
        }
    }

    static async GetLastCommitBlock(chain: string = 'eth') {
        return chain === 'eth' ? await web3.eth.getBlockNumber() + COMMIT_BLOCK_CONDITION : await CITA.base.getBlockNumber() + 88;
    }

    static async SendEthTransaction(from: string, to: string, value: number | string | BN, data: string) {
        let nonce = await web3.eth.getTransactionCount(from);

        let rawTx = {
            from: from,
            nonce: "0x" + nonce.toString(16),
            chainId: await web3.eth.net.getId(),
            to: to,
            data: data,
            value: web3.utils.toHex(value),
            // gasPrice: web3.utils.toHex(8 * 1e9),
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
            gasLimit: web3.utils.toHex(30000),
        };

        let tx = new TX(rawTx);

        let priKey = cpProvider.privateKey;

        if (priKey.substr(0, 2) === '0x') {
            tx.sign(Buffer.from(priKey.substr(2), 'hex'));
        } else {
            tx.sign(Buffer.from(priKey, 'hex'));
        }

        let serializedTx = tx.serialize();

        let txData = "0x" + serializedTx.toString("hex");

        return new Promise((resolve, reject) => {
            web3.eth.sendSignedTransaction(txData).on("transactionHash", (value)=>{
                resolve(value);
            }).on('error', (error)=>{
                reject(error);
            });
        });
    }

    static async BuildAppChainTX() {
        let tx = {
            ...TX_BASE,
            privateKey: cpProvider.privateKey,
            from: cpProvider.address,
        };

        tx.validUntilBlock = await Common.GetLastCommitBlock('cita');

        return tx;
    }

    static CheckSignature(messageHash: string, signature: string, address: string) {
        let messageHashBuffer = Buffer.from(messageHash.replace("0x", ""), 'hex');
        let sigDecoded = ethUtil.fromRpcSig(Buffer.from(signature.replace("0x", ""), 'hex'));
        let recoveredPub = ethUtil.ecrecover(messageHashBuffer, sigDecoded.v, sigDecoded.r, sigDecoded.s);
        let recoveredAddress = ethUtil.pubToAddress(recoveredPub).toString("hex");
        recoveredAddress = "0x" + recoveredAddress;

        return recoveredAddress.toLowerCase() == address.toLowerCase();
    }

    static SignatureToHex(messageHash: string) {
        let privateKey = cpProvider.privateKey;

        let messageHex = messageHash.substr(0, 2) == '0x' ? messageHash.substr(2) : messageHash;
        let privateKeyHex  = privateKey.substr(0, 2) == '0x' ? privateKey.substr(2) : privateKey;

        let messageBuffer = Buffer.from(messageHex, 'hex');
        let privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
        let signatureObj = ethUtil.ecsign(messageBuffer, privateKeyBuffer);

        return ethUtil.toRpcSig(signatureObj.v, signatureObj.r, signatureObj.s).toString('hex');
    }

}