"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
exports.logger = {
    info: server_1.debug ? console.log : () => { },
    error: server_1.debug ? console.error : () => { },
    debug: server_1.debug ? console.debug : () => { }
};
async function setLogger(newlogger) {
    if (!newlogger) {
        exports.logger = {
            info: server_1.debug ? console.info : () => { },
            error: server_1.debug ? console.error : () => { },
            debug: server_1.debug ? console.log : () => { }
        };
    }
    else {
        exports.logger.info = (...params) => {
            newlogger.info("[L2-SERVER]: " + params[0], ...params.slice(1));
        };
        exports.logger.debug = (...params) => {
            newlogger.debug("[L2-SERVER]: " + params[0], ...params.slice(1));
        };
        exports.logger.error = (...params) => {
            newlogger.error("[L2-SERVER]: " + params[0], ...params.slice(1));
        };
    }
}
exports.setLogger = setLogger;
//# sourceMappingURL=mylog.js.map