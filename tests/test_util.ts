import {
  cpPrivateKey,
  ethPaymentNetwork,
  appPaymentNetwork,
  sessionPayNetwork,
  appRpcUrl,
  ethRpcUrl
} from "../src/conf/config.dev";
import { L2 } from "../src/sdk/sdk";
import { ethPN, cpProvider, web3, appPN, ERC20, CITA } from "../src/lib/server";
import { ADDRESS_ZERO } from "../src/conf/contract";
import { signHash } from "../src/lib/sign";
import { Common } from "../src/lib/common";
import { logger } from "../src/lib/mylog";
const TX = require("ethereumjs-tx");

export async function initL2(): Promise<L2> {
  let l2 = L2.GetInstance();
  await l2.init(
    cpPrivateKey,
    ethRpcUrl,
    ethPaymentNetwork,
    appRpcUrl,
    appPaymentNetwork,
    sessionPayNetwork
  );
  return l2;
}

export async function userOpenChannel(from, userPrivateKey, amount, token) {
  let puppet = from;
  let settleWindow = 3;
  // let token = ADDRESS_ZERO;
  let data = ethPN.methods
    .openChannel(from, puppet, settleWindow, token, amount + "")
    .encodeABI();

  let to = ethPN.options.address;
  let value = amount;

  if (token === ADDRESS_ZERO) {
    return await Common.SendEthTransaction(
      from,
      to,
      value,
      data,
      userPrivateKey
    );
  } else {
    let erc20Data = ERC20.methods
      .approve(ethPN.options.address, amount)
      .encodeABI();

    // 发送ERC20交易
    await Common.SendEthTransaction(from, token, 0, erc20Data, userPrivateKey);

    // 发送ETH交易
    return await Common.SendEthTransaction(
      from,
      ethPN.options.address,
      0,
      data,
      userPrivateKey
    );
  }
}

export async function userCloseChannel(user, privateKey, token) {
  let l2 = L2.GetInstance();
  let { channelID } = await l2.getChannelInfo(user, token);

  let [
    { balance, nonce, additionalHash, signature: partnerSignature },
    { amount: inAmount, nonce: inNonce, regulatorSignature, providerSignature }
  ] = await Promise.all([
    appPN.methods.balanceProofMap(channelID, user).call(),
    appPN.methods.rebalanceProofMap(channelID).call()
  ]);

  partnerSignature = partnerSignature || "0x0";
  regulatorSignature = regulatorSignature || "0x0";
  providerSignature = providerSignature || "0x0";

  let data = ethPN.methods
    .closeChannel(
      channelID,
      balance,
      nonce,
      additionalHash,
      partnerSignature,
      inAmount,
      inNonce,
      regulatorSignature,
      providerSignature
    )
    .encodeABI();

  return await Common.SendEthTransaction(
    user,
    ethPN.options.address,
    0,
    data,
    privateKey
  );
}

export async function userTransfer(from, to, amount, token, privateKey) {
  let { toBN } = web3.utils;
  let l2 = L2.GetInstance();
  let { channelID } = await l2.getChannelInfo(from, token);

  // get balance proof from eth contract
  let { balance, nonce } = await appPN.methods
    .balanceProofMap(channelID, cpProvider.address)
    .call();
  balance = toBN(amount)
    .add(toBN(balance))
    .toString();
  nonce = toBN(nonce)
    .add(toBN(1))
    .toString();
  let additionalHash = "0x0";

  let messageHash = signHash({
    channelID,
    balance,
    nonce,
    additionalHash
  });

  let signature = Common.SignatureToHex(messageHash, privateKey);

  logger.info("start Submit Transfer");
  return await Common.SendAppChainTX(
    appPN.methods.transfer(
      to,
      channelID,
      balance,
      nonce,
      additionalHash,
      signature
    ),
    from,
    privateKey
  );
}

export async function setTokenFee(
  operatorContractAddress,
  token,
  feeRate,
  operatorPrivateKey
) {
  let operatorContract = new CITA.base.Contract(
    require("../src/conf/operatorContract.json"),
    operatorContractAddress
  );

  let hash = web3.utils.soliditySha3("setFee", new Date().toISOString());
  let blockNumber = await web3.eth.getBlockNumber();
  let data = appPN.methods.setFeeRate(token, feeRate).encodeABI();
  let action = operatorContract.methods.submitTransaction(
    hash,
    blockNumber,
    appPaymentNetwork.address,
    0,
    data
  );

  let operatorAccount = web3.eth.accounts.privateKeyToAccount(
    "0x" + operatorPrivateKey.replace("0x", "")
  );

  return await Common.SendAppChainTX(
    action,
    operatorAccount.address,
    operatorPrivateKey
  );
}

export async function regulatorWithdraw(token, privateKey) {
  let regualtorAccount = web3.eth.accounts.privateKeyToAccount(
    "0x" + privateKey.replace("0x", "")
  );
  let { amount, nonce, signature } = await appPN.methods
    .feeProofMap(token)
    .call();

  let data = ethPN.methods
    .regulatorWithdraw(token, amount, amount, nonce, signature)
    .encodeABI();

  return await Common.SendEthTransaction(
    regualtorAccount.address,
    ethPN.options.address,
    0,
    data,
    privateKey
  );

}
