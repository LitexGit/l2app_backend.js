import {
  cpPrivateKey,
  ethPaymentNetwork,
  appPaymentNetwork,
  sessionPayNetwork,
  appRpcUrl,
  ethRpcUrl
} from "../src/conf/config.dev";
import { L2 } from "../src/sdk/sdk";
import { ethPN, cpProvider, web3 } from "../src/lib/server";
import { ADDRESS_ZERO } from "../src/conf/contract";
const TX = require("ethereumjs-tx");

export async function initL2(): Promise<L2> {
  let l2 = L2.GetInstance();
  await l2.Init(
    cpPrivateKey,
    ethRpcUrl,
    ethPaymentNetwork,
    appRpcUrl,
    appPaymentNetwork,
    sessionPayNetwork
  );
  return l2;
}

export async function userOpenChannel(from, userPrivateKey, amount) {
  let puppet = from;
  let settleWindow = 3;
  let token = ADDRESS_ZERO;
  let data = ethPN.methods
    .openChannel(from, puppet, settleWindow, token, amount + "")
    .encodeABI();

  let to = ethPN.options.address;
  let value = amount;

  let nonce = await web3.eth.getTransactionCount(from);

  let rawTx = {
    from: from,
    nonce: "0x" + nonce.toString(16),
    chainId: await web3.eth.net.getId(),
    to: to,
    data: data,
    value: web3.utils.toHex(value),
    gasPrice: web3.utils.toHex(8 * 1e9),
    // gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    gasLimit: web3.utils.toHex(300000)
  };

  let tx = new TX(rawTx);

  let priKey = userPrivateKey;

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

export async function userCloseChannel(from, privateKey) {}

export async function userTransfer(from, privateKey) {}
