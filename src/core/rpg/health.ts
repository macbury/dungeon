import { StatsManager } from './stats';

/**
* This class helps calculation of health
*/
export default class Health {
  private stats : StatsManager;
  private _current : number;

  constructor(statsManager : StatsManager) {
    this.stats    = statsManager;
    this._current = this.max;
  }

  /**
  * Current health
  */
  public get current() {
    return this._current;
  }

  /**
  * Maximum health
  */
  public get max() {
    return this.stats.health;
  }
}
