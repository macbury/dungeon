import { StatsManager } from './stats';

const REGENERATION_FACTOR = 0.05;

/**
* This class helps calculation of health
*/
export default class Health {
  private stats : StatsManager;
  /**
  * Current health always up to date
  */
  private _current : number;
  /*
  * value used for value displayed on screen
  */
  private _visual  : number;
  public onUpdate : Phaser.Signal;

  constructor(statsManager : StatsManager) {
    this.stats    = statsManager;
    this._current = this.max;
    this._visual  = this._current;
    this.onUpdate = new Phaser.Signal();
  }

  /**
  * Current health of player always up to date
  */
  public get current()  : number {
    return this._current;
  }

  /**
  * Health currently displayed in gui. After turn is finished it should equal current
  */
  public get visual() : number {
    return this._visual;
  }

  /**
  * Send update event
  */
  public refresh() {
    this.onUpdate.dispatch();
  }

  public isNotMax() : boolean {
    return this._current != this.max;
  }

  /**
  * Set current visual health without moving current health
  */
  public set visual(newHealth : number) {
    this._visual = newHealth;
    this.onUpdate.dispatch();
  }

  public get percent() : number {
    return this.current / this.stats.health;
  }

  public get visualPercent() : number {
    return this._visual / this.stats.health;
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

    this.onUpdate.dispatch();
  }

  /*
  * @return true if health is zero
  */
  public isZero() : boolean {
    return this.current <= 0;
  }

  public isDead() : boolean {
    return this.isZero();
  }

  public isAlive() : boolean {
    return !this.isDead();
  }

  /**
  * Substract health
  */
  public sub(damage : number) : Health {
    this._current -= damage;
    this.clamp();
    this.onUpdate.dispatch();
    return this;
  }

  /**
  * Regenerate 5% of max hp now
  */
  public regenerate() {
    this._current += Math.round(REGENERATION_FACTOR * this.max);
    this.clamp();
    this.onUpdate.dispatch();
  }

  public setToMax() : void {
    this._current = this.max;
    this.onUpdate.dispatch();
  }

  public setZero() : void {
    this._current = 0;
    this.onUpdate.dispatch();
  }

}
