import { Session } from "../lib/session";
import { ADDRESS_ZERO, SESSION_MESSAGE_EVENT } from "../conf/contract";
import { cpProvider, callbacks, CITA, web3, appPN } from "../lib/server";
import { Contract } from "web3/node_modules/web3-eth-contract";
import { logger } from "../lib/mylog";

export const SESSION_EVENTS = {
  InitSession: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA InitSession--------------------"
      );
    }
  },

  JoinSession: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA JoinSession--------------------"
      );
    }
  },

  SendMessage: {
    filter: () => {
      return { to: cpProvider.address };
    },
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA SendMessage--------------------"
      );
      let {
        returnValues: {
          from,
          to,
          sessionID,
          mType: type,
          content,
          balance,
          nonce,
          amount,
          channelID
        },
        transactionHash: txhash
      } = event;

      logger.debug(
        " from: [%s], to: [%s], sessionID: [%s], type: [%s], content: [%s], balance: [%s], nonce: [%s], amount: [%s], channelID: [%s] ",
        from,
        to,
        sessionID,
        type,
        content,
        balance,
        nonce,
        amount,
        channelID
      );

      let { token } = await appPN.methods.channelMap(channelID).call();

      let message: SESSION_MESSAGE_EVENT = {
        from,
        sessionID,
        type,
        content,
        amount,
        token,
        txhash
      };
      callbacks.get("Message") && callbacks.get("Message")(null, message);
    }
  },

  CloseSession: {
    filter: () => {
      return {};
    },
    handler: async (event: any) => {
      logger.debug(
        "--------------------Handle CITA CloseSession--------------------"
      );
      // TODO
    }
  }
};
