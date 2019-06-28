import { debug } from "./server";

export declare let logger;

logger = {
  info: debug ? console.log : () => {},
  error: debug ? console.error : () => {},
  debug: debug ? console.debug : () => {}
};

export async function setLogger(newlogger?) {
  if (!newlogger) {
    logger = {
      info: debug ? console.info : () => {},
      error: debug ? console.error : () => {},
      debug: debug ? console.log : () => {}
    };
  } else {
    logger.info = (...params) => {
      newlogger.info("[L2-SERVER]: " + params[0], ...params.slice(1));
    };

    logger.debug = (...params) => {
      newlogger.debug("[L2-SERVER]: " + params[0], ...params.slice(1));
    };

    logger.error = (...params) => {
      newlogger.error("[L2-SERVER]: " + params[0], ...params.slice(1));
    };
  }
}
