import {Session} from "../lib/session";
import {ADDRESS_ZERO, SESSION_MESSAGE_EVENT} from "../conf/contract";
import { cpProvider, callbacks, CITA, web3, appPN } from "../lib/server";
import { Contract } from 'web3/node_modules/web3-eth-contract';

export const SESSION_EVENTS = {
    'InitSession': {
        filter: () => { return {  } },
        handler: async (event: any) => {
            console.log("InitSession event", event);

        }
    },

    'JoinSession': {
        filter: () => { return {  } },
        handler: async (event: any) => {
            console.log("JoinSession event", event);
        }
    },

    'SendMessage': {
        filter: () => { return { to: cpProvider.address } },
        handler: async (event: any) => {
            console.log("SendMessage event", event);

            let { returnValues: { from, to, sessionID, mType: type, content, balance, nonce }, transactionHash } = event;
            let amount = '0';
            let token = ADDRESS_ZERO;

            // TODO fetch amount & token
            if (Number(balance) !== 0 && Number(nonce) !== 0) {
                let receipt = await CITA.listeners.listenToTransactionReceipt(transactionHash);
                // console.log('receipt', receipt);
                let transferEvent = extractEventFromReceipt(receipt, appPN, 'Transfer');
                console.log('extract TransferEvent is ', transferEvent);

                if(transferEvent !== null){
                    let channel = await appPN.methods.channelMap(transferEvent.channelID).call();
                    token = channel.token;
                    amount = transferEvent.transferAmount;
                }
            }

            let message: SESSION_MESSAGE_EVENT = {from, sessionID, type, content, amount, token};
            callbacks.get('Message') && callbacks.get('Message')(null, message);

        }
    },

    'CloseSession': {
        filter: () => { return {  } },
        handler: async (event: any) => {
            console.log("CloseSession event", event);
            // TODO
        }
    },
};

function extractEventFromReceipt(receipt: any, contract: Contract, name: string ){
    let abiItems = contract.options.jsonInterface;

    let eventDefinition = null;
    for(let abiItem of abiItems){
        if(abiItem.type === 'event' && abiItem.name === name){
            eventDefinition = abiItem;
            break;
        }
    }

    if(eventDefinition === null){
        return null;
    }

    let eventSignature = web3.eth.abi.encodeEventSignature(eventDefinition);

    for(let log of receipt.logs){
        if(log.topics[0] === eventSignature){
            return web3.eth.abi.decodeLog(eventDefinition.inputs, log.data, log.topics.slice(1));
        }
    }

    return null;

}