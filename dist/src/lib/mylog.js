"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js_1 = require("log4js");
exports.logger = log4js_1.getLogger();
exports.logger.level = "debug";
exports.logger.debug("Some debug messages");
log4js_1.configure({
    appenders: {
        cheese: { type: "file", filename: "cheese.log" },
        console: { type: "console" }
    },
    categories: { default: { appenders: ["cheese", "console"], level: "debug" } }
});
//# sourceMappingURL=mylog.js.map