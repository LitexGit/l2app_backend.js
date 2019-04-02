import { AbiItem } from "web3/node_modules/web3-utils";
const TX = require("ethereumjs-tx");
const ethUtil = require("ethereumjs-util");

let ethNonce = new Map<string, number>();
function getEthNonce(address) {
  if (ethNonce.get(address) > 0) {
    return ethNonce.get(address);
  } else {
    return 0;
  }
}

import { COMMIT_BLOCK_CONDITION, TX_BASE } from "../conf/contract";

import { CITA, web3, ethPN } from "./server";

export class Common {
  static Abi2JsonInterface(abi: string): AbiItem[] | AbiItem {
    let abiItem: AbiItem = JSON.parse("{}");

    try {
      let abiArray: AbiItem[] = JSON.parse(abi);
      if (!Array.isArray(abiArray)) return abiItem;
      return abiArray;
    } catch (e) {
      return abiItem;
    }
  }

  static async GetLastCommitBlock(chain: string = "eth") {
    return chain === "eth"
      ? (await web3.eth.getBlockNumber()) + COMMIT_BLOCK_CONDITION
      : (await CITA.base.getBlockNumber()) + 88;
  }

  static async SendEthTransaction(
    from: string,
    to: string,
    value: number | string,
    data: string,
    privateKey: string
  ) {

    //TODO: fetch nonce from persist storage
    let nonce = await web3.eth.getTransactionCount(from);
    if (nonce > getEthNonce(from)) {
      ethNonce.set(from, nonce);
    } else {
      nonce = getEthNonce(from) + 1;
      ethNonce.set(from, nonce);
    }

    let rawTx = {
      from: from,
      nonce: "0x" + nonce.toString(16),
      chainId: await web3.eth.net.getId(),
      to: to,
      data: data,
      value: web3.utils.toHex(value),
      // gasPrice: web3.utils.toHex(8 * 1e9),
      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      gasLimit: web3.utils.toHex(300000)
    };

    let tx = new TX(rawTx);

    let priKey = privateKey;

    if (priKey.substr(0, 2) === "0x") {
      tx.sign(Buffer.from(priKey.substr(2), "hex"));
    } else {
      tx.sign(Buffer.from(priKey, "hex"));
    }

    let serializedTx = tx.serialize();

    let txData = "0x" + serializedTx.toString("hex");

    console.log("SEND TX", rawTx);

    return new Promise((resolve, reject) => {
      try {
        web3.eth
          .sendSignedTransaction(txData)
          .on("transactionHash", (value: {} | PromiseLike<{}>) => {
            console.log("transactionHash: ", value);
            resolve(value);
          })
          .on("error", (error: any) => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  static async BuildAppChainTX(from: string, privateKey: string) {
    let tx = {
      ...TX_BASE,
      privateKey,
      from
    };

    tx.validUntilBlock = await Common.GetLastCommitBlock("cita");

    return tx;
  }

  static async SendAppChainTX(action: any, from: string, privateKey: string) {
    let tx = await this.BuildAppChainTX(from, privateKey);
    let rs = await action.send(tx);

    if (rs.hash) {
      let receipt = await CITA.listeners.listenToTransactionReceipt(rs.hash);

      if (!receipt.errorMessage) {
        //确认成功
        console.log("send CITA tx success");
        return rs.hash;
      } else {
        //确认失败
        throw new Error(`confirm fail ${receipt.errorMessage}`);
      }
    } else {
      // 提交失败
      throw new Error("send CITA tx fail");
    }
  }

  static CheckSignature(
    messageHash: string,
    signature: string,
    address: string
  ) {
    let messageHashBuffer = Buffer.from(messageHash.replace("0x", ""), "hex");
    let sigDecoded = ethUtil.fromRpcSig(
      Buffer.from(signature.replace("0x", ""), "hex")
    );
    let recoveredPub = ethUtil.ecrecover(
      messageHashBuffer,
      sigDecoded.v,
      sigDecoded.r,
      sigDecoded.s
    );
    let recoveredAddress = ethUtil.pubToAddress(recoveredPub).toString("hex");
    recoveredAddress = "0x" + recoveredAddress;

    return recoveredAddress.toLowerCase() == address.toLowerCase();
  }

  static SignatureToHex(messageHash: string, privateKey: string) {
    let messageHex =
      messageHash.substr(0, 2) == "0x" ? messageHash.substr(2) : messageHash;
    let privateKeyHex =
      privateKey.substr(0, 2) == "0x" ? privateKey.substr(2) : privateKey;

    let messageBuffer = Buffer.from(messageHex, "hex");
    let privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
    let signatureObj = ethUtil.ecsign(messageBuffer, privateKeyBuffer);

    return ethUtil
      .toRpcSig(signatureObj.v, signatureObj.r, signatureObj.s)
      .toString("hex");
  }

  static RandomWord(
    randomFlag: boolean,
    min: number,
    max: number = 12
  ): string {
    let str = "",
      range = min,
      arr = [
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

    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }

    let pos: any;

    for (let i = 0; i < range; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }

    return str;
  }

  /**
   * 生成sessionID
   *
   * @param game 游戏标识
   *
   * @constructor
   */
  static GenerateSessionID(game: string): string {
    // 毫秒 时间戳
    let timestamp = new Date().getTime();

    // 生成32位随机数
    let random = this.RandomWord(true, 6, 32);

    // 计算hash 作为sessionID
    return web3.utils.soliditySha3(
      { v: game, t: "address" },
      { v: timestamp, t: "uint256" },
      { v: random, t: "bytes32" }
    );
  }

  static async Sleep(time: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      setTimeout(res, time);
    });
  }
}
