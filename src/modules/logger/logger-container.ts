import log4js, {Level} from 'log4js';

const INSTANCE = Symbol('Logger');
export class LoggerContainer {
  private _defaultLevel = log4js.levels.ALL;

  static get instance() {
    if (!this[INSTANCE]) {
      this[INSTANCE] = new LoggerContainer();
    }
    return this[INSTANCE];
  }

  static get levels(){
    return log4js.levels;
  }

  setDefaultLevel(level: Level){
    this._defaultLevel = level;
    return this;
  }

  getLogger(categoryName: string, level?: string) {
    const logger = log4js.getLogger(categoryName);
    logger.level = (level || this._defaultLevel) as string;
    return logger;
  }

  createLogger(categoryName: string, level?: string) {
    return this.getLogger(categoryName, level);
  }
}
