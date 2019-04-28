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
    logger = newlogger;
    newlogger.error('server error');
    // newlogger.info('server info');
    newlogger.debug('server debug');
  }
}
