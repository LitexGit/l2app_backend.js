"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../lib/common");
const mylog_1 = require("../lib/mylog");
class HttpWatcher {
    constructor(base, provider, blockInterval, watchList) {
        this.base = base;
        this.provider = provider;
        this.blockInterval = blockInterval;
        this.watchList = watchList;
        this.enabled = true;
    }
    async processEvent(fromBlockNumber, toBlockNumber, contract, eventName, eventSetting) {
        let events = await contract.getPastEvents(eventName, {
            filter: eventSetting.filter(),
            fromBlock: fromBlockNumber,
            toBlock: toBlockNumber
        });
        for (let event of events) {
            try {
                eventSetting.handler(event);
            }
            catch (err) {
            }
        }
    }
    async processAllEvent(fromBlockNumber, toBlockNumber, watchItem) {
        let events = await watchItem.contract.getPastEvents("allEvents", {
            fromBlock: fromBlockNumber,
            toBlock: toBlockNumber
        });
        for (let event of events) {
            let { event: eventName, returnValues } = event;
            if (watchItem.listener[eventName]) {
                let filter = watchItem.listener[eventName].filter();
                let filterResult = true;
                for (let k in filter) {
                    if (!returnValues[k] ||
                        returnValues[k].toLowerCase() !== filter[k].toLowerCase()) {
                        filterResult = false;
                        break;
                    }
                }
                if (filterResult) {
                    await watchItem.listener[eventName].handler(event);
                }
            }
        }
    }
    async start(lastBlockNumber = 0) {
        let currentBlockNumber = await this.base.getBlockNumber();
        lastBlockNumber = lastBlockNumber || currentBlockNumber - 10;
        mylog_1.logger.debug("start syncing process", lastBlockNumber, currentBlockNumber);
        while (lastBlockNumber <= currentBlockNumber) {
            for (let watchItem of this.watchList) {
                this.processAllEvent(lastBlockNumber, currentBlockNumber, watchItem);
                if (this.enabled == false) {
                    return;
                }
            }
            lastBlockNumber = currentBlockNumber + 1;
            currentBlockNumber = await this.base.getBlockNumber();
        }
        mylog_1.logger.debug("finish syncing process", currentBlockNumber);
        while (true) {
            await common_1.Common.Sleep(this.blockInterval);
            try {
                lastBlockNumber = currentBlockNumber + 1;
                currentBlockNumber = await this.base.getBlockNumber();
                if (lastBlockNumber > currentBlockNumber) {
                    continue;
                }
                for (let watchItem of this.watchList) {
                    this.processAllEvent(lastBlockNumber, currentBlockNumber, watchItem);
                    if (this.enabled == false) {
                        return;
                    }
                }
            }
            catch (err) {
                mylog_1.logger.error("watching error: ", err);
            }
        }
    }
    async stop() {
        this.enabled = false;
    }
}
exports.default = HttpWatcher;
//# sourceMappingURL=listener.js.map