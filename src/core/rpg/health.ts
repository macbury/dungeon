import { StatsManager } from './stats';

const REGENERATION_FACTOR = 0.05;

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

  public get percent() {
    return this.current / this.stats.health; 
  }

  /**
  * Maximum health
  */
  public get max() {
    return this.stats.health;
  }

  /**
  * Clamp current health in range from 0 to max health
  */
  private clamp() {
    if (this._current > this.max) {
      this._current = this.max;
    }

    if (this._current < 0) {
      this._current = 0;
    }
  }

  /**
  * Substract health
  */
  public sub(damage : number) : Health {
    this._current -= damage;
    this.clamp();
    return this;
  }

  /**
  * Regenerate 5% of max hp now
  */
  public regenerate() {
    this._current += Math.round(REGENERATION_FACTOR * this.max);
    this.clamp();
  }

  public setToMax() : void {
    this._current = this.max;
  }

}
