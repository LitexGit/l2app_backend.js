import { appPN, ethPN, cpProvider, callbacks, web3 } from "../lib/server";
import { Common } from "../lib/common";
import {
  TRANSFER_EVENT,
  PROVIDER_WITHDRAW_EVENT,
  USER_DEPOSIT_EVENT,
  USER_WITHDRAW_EVENT,
  USER_FORCEWITHDRAW_EVENT,
  PROVIDER_DEPOSIT_EVENT
} from "../conf/contract";
import { logger } from "../lib/mylog";

export const CITA_EVENTS = {
  Transfer: {
    filter: () => ({ to: cpProvider.address }),
    handler: async (event: any) => {
      // 获取event事件内容
      let {
        returnValues: {
          from,
          to,
          channelID,
          balance,
          transferAmount,
          additionalHash
        }
      } = event;

      logger.debug(
        "--------------------Handle CITA Transfer--------------------"
      );
      logger.debug(
        "from :[%s], to :[%s], channelID :[%s], balance :[%s], transferAmount :[%s], additionalHash :[%s]",
        from,
        to,
        channelID,
        balance,
        transferAmount,
        additionalHash
      );

      // 查询通道信息
      let channel = await appPN.methods.channelMap(channelID).call();
      let token = channel.token;

      logger.debug("channel", channel);
      let assetEvent: TRANSFER_EVENT = {
        from: from,
        to: to,
        token,
        amount: transferAmount,
        additionalHash,
        totalTransferredAmount: balance
      };

      // will not emit Asset event when transfer is attached with sessionMessage
      if (
        callbacks.get("Transfer")
        // &&
        // additionalHash ===
        //   "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        let { toBN } = web3.utils;
        let time = 0;
        while (time < 15) {
          let channelInfo = await appPN.methods
            .balanceProofMap(channelID, to)
            .call();
          if (toBN(channelInfo.balance).gte(toBN(balance))) {
            break;
          }
          await Common.Sleep(1000);
          time++;
        }
        // @ts-ignore
        callbacks.get("Transfer")(null, assetEvent);
      }

      // 查询费率
      let {
        amount: feeProofAmount,
        nonce: road
      } = await appPN.methods.feeProofMap(token).call();

      //
      let feeRate = await appPN.methods.feeRateMap(token).call();
      if (Number(feeRate) === 0) {
        logger.debug("feeRate is 0, will do nothing");
        return;
      }

      logger.debug(
        "start to submit feeProof, old feeProofAmount :[%s], feeRate :[%s]",
        feeProofAmount,
        feeRate
      );
      // 查询通道证据
      let [{ balance: amount }] = await Promise.all([
        appPN.methods.balanceProofMap(channelID, cpProvider.address).call()
      ]);

      // let { balance: arrearBalance } = await appPN.methods.arrearBalanceProofMap(channelID).call();
      // logger.debug("arrearBalance", arrearBalance);

      let bn = web3.utils.toBN;
      let feeAmount = bn(feeProofAmount)
        .add(
          bn(feeRate)
            .mul(bn(balance).sub(bn(amount)))
            .div(bn(10000))
        )
        .toString();

      logger.debug(
        "provider balance :[%s], provider nonce :[%s], event Balance :[%s], feeAmount :[%s]",
        amount,
        road,
        balance,
        feeAmount
      );

      let feeNonce = Number(road) + 1;

      // 签署消息
      let messageHash = web3.utils.soliditySha3(
        { v: ethPN.options.address, t: "address" },
        { v: token, t: "address" },
        { v: feeAmount, t: "uint256" },
        { v: feeNonce, t: "uint256" }
      );

      // 进行签名
      let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);

      logger.debug(
        "infos:  channelID :[%s], token :[%s], feeAmount :[%s], feeNonce :[%s], signature :[%s]",
        channelID,
        token,
        feeAmount,
        feeNonce,
        signature
      );

      Common.SendAppChainTX(
        appPN.methods.submitFee(
          channelID,
          token,
          feeAmount,
          feeNonce,
          signature
        ),
        cpProvider.address,
        cpProvider.privateKey,
        "appPN.methods.submitFee"
      );
    }
  },
  SubmitFee: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA SubmitFee--------------------"
      );
      let { token, amount, nonce } = event.returnValues;
      logger.debug("token:[%s], amount:[%s], nonce:[%s]", token, amount, nonce);
    }
  },
  UserProposeWithdraw: {
    filter: () => ({}),
    handler: async (event: any) => {
      // 获取event事件内容
      let {
        returnValues: {
          user,
          channelID,
          amount,
          balance,
          receiver,
          lastCommitBlock
        }
      } = event;

      logger.debug(
        "--------------------Handle CITA UserProposeWithdraw--------------------"
      );
      logger.debug(
        "user :[%s], channelID :[%s], amount :[%s], balance :[%s], receiver :[%s], lastCommitBlock :[%s] ",
        user,
        channelID,
        amount,
        balance,
        receiver,
        lastCommitBlock
      );

      // 签署消息
      let messageHash = web3.utils.soliditySha3(
        { v: ethPN.options.address, t: "address" },
        { v: channelID, t: "bytes32" },
        { v: balance, t: "uint256" },
        { v: lastCommitBlock, t: "uint256" }
      );

      // 进行签名
      let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);

      // 提交到合约
      Common.SendAppChainTX(
        appPN.methods.confirmUserWithdraw(channelID, signature),
        cpProvider.address,
        cpProvider.privateKey,
        "appPN.methods.confirmUserWithdraw"
      );
    }
  },

  ProposeCooperativeSettle: {
    filter: () => ({}),
    handler: async (event: any) => {
      // 获取event事件内容
      let {
        returnValues: { channelID, balance, lastCommitBlock }
      } = event;

      logger.debug(
        "--------------------Handle CITA ProposeCooperativeSettle--------------------"
      );
      logger.debug(
        " channelID: [%s], balance:[%s], lastCommitBlock:[%s] ",
        channelID,
        balance,
        lastCommitBlock
      );
      // 签署消息
      let messageHash = web3.utils.soliditySha3(
        { v: ethPN.options.address, t: "address" },
        { v: channelID, t: "bytes32" },
        { v: balance, t: "uint256" },
        { v: lastCommitBlock, t: "uint256" }
      );

      // 进行签名
      let signature = Common.SignatureToHex(messageHash, cpProvider.privateKey);

      // 提交到合约
      Common.SendAppChainTX(
        appPN.methods.confirmCooperativeSettle(channelID, signature),
        cpProvider.address,
        cpProvider.privateKey,
        "appPN.methods.confirmCooperativeSettle"
      );
    }
  },

  ConfirmProviderWithdraw: {
    filter: () => ({}),
    handler: async (event: any) => {
      // 获取event事件内容
      let {
        returnValues: { token, amount: balance, lastCommitBlock, signature }
      } = event;

      logger.debug(
        "--------------------Handle CITA ConfirmProviderWithdraw--------------------"
      );
      logger.debug(
        " token: [%s], balance: [%s], lastCommitBlock: [%s], signature: [%s]",
        token,
        balance,
        lastCommitBlock,
        signature
      );

      // 获取数据
      let data = await ethPN.methods
        .providerWithdraw(token, balance, lastCommitBlock, signature)
        .encodeABI();

      // 提交数据到 ETH
      Common.SendEthTransaction(
        cpProvider.address,
        ethPN.options.address,
        0,
        data,
        cpProvider.privateKey
      );
    }
  },
  /***************************Operator Related Onchain Event*********************************/

  OnchainProviderWithdraw: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainProviderWithdraw--------------------"
      );
      let { returnValues, transactionHash: txhash } = event;
      let { token, amount, balance } = returnValues;

      logger.debug(
        "token:[%s], amount:[%s], balance:[%s]",
        token,
        amount,
        balance
      );

      let providerWithdrawEvent: PROVIDER_WITHDRAW_EVENT = {
        token,
        amount: amount,
        totalWithdraw: amount,
        txhash
      };
      if (callbacks.get("ProviderWithdraw")) {
        // @ts-ignore
        callbacks.get("ProviderWithdraw")(null, providerWithdrawEvent);
      }
    }
  },
  OnchainProviderDeposit: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainProviderDeposit--------------------"
      );
      let { returnValues, transactionHash: txhash } = event;
      let { token, amount } = returnValues;
      logger.debug("token:[%s], amount:[%s]", token, amount);
      let providerDepositEvent: PROVIDER_DEPOSIT_EVENT = {
        token,
        amount,
        totalDeposit: amount,
        txhash
      };
      if (callbacks.get("ProviderDeposit")) {
        callbacks.get("ProviderDeposit")(null, providerDepositEvent);
      }
    }
  },
  OnchainUserDeposit: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainUserDeposit--------------------"
      );
      // 获取事件内容
      let {
        returnValues: { channelID, user, deposit: newDeposit, totalDeposit },
        transactionHash: txhash
      } = event;

      logger.debug(
        " channelID: [%s], user: [%s], newDeposit: [%s], totalDeposit: [%s] ",
        channelID,
        user,
        newDeposit,
        totalDeposit
      );
      let { token } = await appPN.methods.channelMap(channelID).call();

      // TODO get real sender
      let userNewDepositEvent: USER_DEPOSIT_EVENT = {
        sender: user,
        user,
        type: 2,
        token,
        amount: newDeposit,
        totalDeposit,
        txhash
      };
      if (callbacks.get("UserDeposit")) {
        // @ts-ignore
        callbacks.get("UserDeposit")(null, userNewDepositEvent);
      }
    }
  },
  OnchainUserWithdraw: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainUserWithdraw--------------------"
      );
      // 获取event事件内容
      let {
        returnValues: { channelID, user, amount, withdraw: totalWithdraw },
        transactionHash: txhash
      } = event;
      logger.debug(
        " channelID: [%s], user: [%s], amount: [%s], totalWithdraw: [%s] ",
        channelID,
        user,
        amount,
        totalWithdraw
      );

      let { token } = await appPN.methods.channelMap(channelID).call();

      let userWithdrawEvent: USER_WITHDRAW_EVENT = {
        user,
        type: 1,
        token,
        amount,
        totalWithdraw,
        txhash
      };
      if (callbacks.get("UserWithdraw")) {
        callbacks.get("UserWithdraw")(null, userWithdrawEvent);
      }
    }
  },
  OnchainOpenChannel: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainOpenChannel--------------------"
      );
      // 获取事件内容
      let {
        returnValues: { user, token, amount, channelID },
        transactionHash: txhash
      } = event;

      logger.debug(
        " sender: [%s], user: [%s], token: [%s], amount: [%s], channelID: [%s] ",
        user,
        user,
        token,
        amount,
        channelID
      );

      let userJoinEvent: USER_DEPOSIT_EVENT = {
        sender: user,
        user,
        type: 1,
        token,
        amount,
        totalDeposit: amount,
        txhash
      };
      if (callbacks.get("UserDeposit")) {
        callbacks.get("UserDeposit")(null, userJoinEvent);
      }
    }
  },
  OnchainCooperativeSettleChannel: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainCooperativeSettleChannel--------------------"
      );
      // 获取event事件内容
      let {
        returnValues: { channelID, user, token, balance },
        transactionHash: txhash
      } = event;

      logger.debug(
        " channelID: [%s], user: [%s], token: [%s], balance: [%s] ",
        channelID,
        user,
        token,
        balance
      );

      let userLeaveEvent: USER_WITHDRAW_EVENT = {
        user,
        type: 2,
        token,
        amount: balance,
        totalWithdraw: "",
        txhash
      };
      if (callbacks.get("UserWithdraw")) {
        callbacks.get("UserWithdraw")(null, userLeaveEvent);
      }
    }
  },
  OnchainSettleChannel: {
    filter: () => ({}),
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA OnchainSettleChannel--------------------"
      );
      // 获取event事件内容
      let {
        returnValues: {
          channelID,
          user,
          token,
          userSettleAmount: transferTouserAmount,
          providerSettleAmount: transferToProviderAmount
        },
        transactionHash: txhash
      } = event;

      logger.debug(
        " channelID: [%s], user: [%s], token: [%s], transferTouserAmount: [%s], transferToProviderAmount: [%s] ",
        channelID,
        user,
        token,
        transferTouserAmount,
        transferToProviderAmount
      );

      // 获取通道信息
      //   let channel = await ethPN.methods.channels(channelID).call();

      let { closer } = await appPN.methods.closingChannelMap(channelID).call();

      let userLeaveEvent: USER_FORCEWITHDRAW_EVENT = {
        closer,
        user,
        token,
        userSettleAmount: transferTouserAmount,
        providerSettleAmount: transferToProviderAmount,
        txhash
      };
      if (callbacks.get("UserForceWithdraw")) {
        callbacks.get("UserForceWithdraw")(null, userLeaveEvent);
      }
    }
  }
};
