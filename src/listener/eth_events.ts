import { appPN, ethPN, cpProvider, web3 } from "../lib/server";
import { CHANNEL_STATUS } from "../conf/contract";
import { Common } from "../lib/common";

// let cp = cpProvider.address;

export const ETH_EVENTS = {
  ProviderNewDeposit: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {}
  },

  ProviderWithdraw: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH ProviderWithdraw--------------------"
      );
      // 获取事件内容
    }
  },

  UserNewDeposit: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH UserNewDeposit--------------------"
      );
    }
  },

  UserWithdraw: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH UserWithdraw--------------------"
      );
    }
  },

  ChannelOpened: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH ChannelOpened--------------------"
      );
    }
  },

  ChannelClosed: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH ChannelClosed--------------------"
      );

      // 获取事件内容
      let {
        returnValues: { channelID, balance, nonce, inAmount, inNonce }
      } = event;

      console.log(
        "channelID: [%s], balance: [%s], nonce: [%s], inAmount: [%s], inNonce: [%s]",
        channelID,
        balance,
        nonce,
        inAmount,
        inNonce
      );
      // 获取通道信息
      let channel = await ethPN.methods.channels(channelID).call();

      let data;

      if (Number(channel.status) !== CHANNEL_STATUS.CHANNEL_STATUS_CLOSE) {
        return;
      }

      let current = await web3.eth.getBlockNumber();

      if (current < channel.settleBlock) {
        // 强关发起方是用户
        if (channel.isCloser) {
          // 获取通道证据
          let [
            { balance, nonce, additionalHash, signature: partnerSignature }
          ] = await Promise.all([
            appPN.methods.balanceProofMap(channelID, cpProvider.address).call()
          ]);

          if (Number(nonce) === 0) {
            console.log("no transfer data, will not submit proof");
          } else {
            // CP 签名
            let messageHash = web3.utils.soliditySha3(
              { v: ethPN.options.address, t: "address" },
              { v: channelID, t: "bytes32" },
              { v: balance, t: "uint256" },
              { v: nonce, t: "uint256" },
              { v: additionalHash, t: "bytes32" },
              { v: partnerSignature, t: "bytes" }
            );

            // 进行签名
            let consignorSignature = Common.SignatureToHex(
              messageHash,
              cpProvider.privateKey
            );

            console.log("user close the channel, provider will submit proof");
            console.log(
              "proof data: channelID: [%s], balance: [%s], nonce: [%s], additionalHash: [%s], partnerSignature: [%s], consignorSignature: [%s]",
              channelID,
              balance,
              nonce,
              additionalHash,
              partnerSignature,
              consignorSignature
            );
            // 获取 user数据
            data = ethPN.methods
              .partnerUpdateProof(
                channelID,
                balance,
                nonce,
                additionalHash,
                partnerSignature,
                consignorSignature
              )
              .encodeABI();

            // 发送ETH交易
            await Common.SendEthTransaction(
              cpProvider.address,
              ethPN.options.address,
              0,
              data,
              cpProvider.privateKey
            );
          }
        } else {
          // 发起方为 cp
          // 获取通道证据
          let [
            {
              balance,
              nonce,
              additionalHash,
              signature: partnerSignature,
              consignorSignature
            }
          ] = await Promise.all([
            appPN.methods.balanceProofMap(channelID, channel.user).call()
          ]);

          if (Number(nonce) === 0) {
            console.log("no transfer data, will not submit proof");
          } else {
            // 获取 cp数据

            console.log("provider close the channel, will submit user's proof");
            console.log(
              "proof data: channelID: [%s], balance: [%s], nonce: [%s], additionalHash: [%s], partnerSignature: [%s], consignorSignature: [%s]",
              channelID,
              balance,
              nonce,
              additionalHash,
              partnerSignature,
              consignorSignature
            );

            if (consignorSignature == null || consignorSignature == "") {
              console.log("no user proof signature, will not submit proof");
            } else {
              data = ethPN.methods
                .partnerUpdateProof(
                  channelID,
                  balance,
                  nonce,
                  additionalHash,
                  partnerSignature,
                  consignorSignature
                )
                .encodeABI();

              // 发送ETH交易
              await Common.SendEthTransaction(
                cpProvider.address,
                ethPN.options.address,
                0,
                data,
                cpProvider.privateKey
              );
            }
          }
        }
      }

      let settle = channel.settleBlock;

      // settle 定时器
      while (true) {
        let current = await web3.eth.getBlockNumber();

        // console.log("current:", current);
        // console.log("settle", settle);

        if (current >= settle) {
          console.log("settle time is up, channelID: ", channelID);
          let settleData = ethPN.methods.settleChannel(channelID).encodeABI();

          // 发送ETH交易
          let hash = await Common.SendEthTransaction(
            cpProvider.address,
            ethPN.options.address,
            0,
            settleData,
            cpProvider.privateKey
          );

          console.log("Settle Channel HASH:", hash);
          break;
        }

        // 休眠15s
        await Common.Sleep(15000);

        console.log("settle count down. current:", current, "target:", settle);
      }
    }
  },

  CooperativeSettled: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH CooperativeSettled--------------------"
      );
    }
  },

  ChannelSettled: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      console.log(
        "--------------------Handle ETH ChannelSettled--------------------"
      );
    }
  }
};
