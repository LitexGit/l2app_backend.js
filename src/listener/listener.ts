import { Contract } from "web3/node_modules/web3-eth-contract";
import { Common } from "../lib/common";
import { logger } from "../lib/mylog";

export default class HttpWatcher {
  private enabled: boolean;

  private provider: string;
  private base: any;
  private blockInterval: number;
  private contract: Contract;
  private watchList: any;
  private delayBlock;

  constructor(base: any, provider: string, blockInterval: number, watchList: any, delayBlock: number = 0) {
    //   this.contract = contract;
    this.base = base;
    this.provider = provider;
    this.blockInterval = blockInterval;
    this.watchList = watchList;
    this.delayBlock = delayBlock;

    this.enabled = true;
  }

  async processEvent(fromBlockNumber: number, toBlockNumber: number, contract: Contract, eventName: string, eventSetting: any) {
    // logger.info('eventName is ', eventName, eventSetting.filter());

    let events = await contract.getPastEvents(eventName, {
      filter: eventSetting.filter(),
      fromBlock: fromBlockNumber,
      toBlock: toBlockNumber
    });

    for (let event of events) {
      try {
        eventSetting.handler(event);
      } catch (err) {
        // logger.error("process event: ", eventName, err);
      }
      // process event
      // logger.info('eventName is ', eventName, event.transactionHash);
    }
    // logger.info("get events ", events.length);
  }

  /**
   * watch all event of a contract, and handle them
   *
   * @param fromBlockNumber start blockNumber
   * @param toBlockNumber end blockNumber
   * @param watchItem watch event list and settings
   */
  async processAllEvent(fromBlockNumber: number, toBlockNumber: number, watchItem: any) {
    let events = await watchItem.contract.getPastEvents("allEvents", {
      // filter: {},
      fromBlock: fromBlockNumber,
      toBlock: toBlockNumber
    });

    if (events.length > 0) {
      logger.debug(
        `[L2-LISTENER]: [${fromBlockNumber}--->${toBlockNumber}] [${watchItem.contract.options.address}] eventsNum: ${events.length},` +
          `eventNames: [${events.map(item => item.event).join(",")}]`
      );
    }

    for (let event of events) {
      let { event: eventName, returnValues } = event;

      if (watchItem.listener[eventName]) {
        let filter = watchItem.listener[eventName].filter();
        let filterResult = true;
        for (let k in filter) {
          if (!returnValues[k] || returnValues[k].toLowerCase() !== filter[k].toLowerCase()) {
            filterResult = false;
            logger.debug(`[L2-LISTENER]: filter failed for event ${eventName}, ${event.transactionHash}, ${event.transactionIndex}`);
            break;
          }
        }

        if (filterResult) {
          watchItem.listener[eventName].handler(event);
        }
      } else {
        logger.debug(`[L2-LISTENER]: eventName[${eventName}] not exist in listeners`);
      }
    }
  }

  async start(lastBlockNumber: number = 0) {
    let currentBlockNumber = (await this.base.getBlockNumber()) - this.delayBlock;
    lastBlockNumber = lastBlockNumber || currentBlockNumber - 10;

    logger.debug("[L2-LISTENER]: start syncing process", lastBlockNumber, currentBlockNumber);
    while (lastBlockNumber <= currentBlockNumber) {
      for (let watchItem of this.watchList) {
        this.processAllEvent(lastBlockNumber, currentBlockNumber, watchItem);

        if (this.enabled == false) {
          return;
        }
      }

      lastBlockNumber = currentBlockNumber + 1;
      currentBlockNumber = (await this.base.getBlockNumber()) - this.delayBlock;
    }

    // finish sync process;
    logger.debug("[L2-LISTENER]: finish syncing process", currentBlockNumber);

    while (true) {
      await Common.Sleep(this.blockInterval);

      try {
        lastBlockNumber = currentBlockNumber + 1;
        currentBlockNumber = (await this.base.getBlockNumber()) - this.delayBlock;
        if (lastBlockNumber > currentBlockNumber) {
          continue;
        }

        for (let watchItem of this.watchList) {
          this.processAllEvent(lastBlockNumber, currentBlockNumber, watchItem);

          if (this.enabled == false) {
            return;
          }
        }
      } catch (err) {
        logger.error("[L2-LISTENER]: watching error: ", err);
        // this.base.setProvider(this.provider);
      }
    }
  }

  async stop() {
    this.enabled = false;
  }
}
