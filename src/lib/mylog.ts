// export default () => {
//   let originalLog = console.log;
//   // Overwriting
//   console.log = function() {
//     var args = [].slice.call(arguments);
//     originalLog.apply(console.log, [getCurrentDateString()].concat(args));
//   };
//   // Returns current timestamp
//   function getCurrentDateString() {
//     return new Date().toISOString() + " ------";
//   }
// };

import { configure, getLogger } from "log4js";
// configure("./filename");

export declare let logger;

logger = getLogger();
logger.level = "debug";
logger.debug("Some debug messages");

configure({
  appenders: {
    cheese: { type: "file", filename: "cheese.log" },
    console: { type: "console" }
  },
  categories: { default: { appenders: ["cheese", "console"], level: "debug" } }
});
