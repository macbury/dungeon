import { StatsProvider, Stats } from './stats';
import { LevelTable } from './level_table';
/**
* This class defines Level for Character. It contains current level, max level that character can get, how many experience points it currently has,
* and how many he needs to get to next level
*/
export default class Level implements StatsProvider {
  private _current : number;

  private _exp : number;
  private _nextLevel : number;
  private _levelTable : LevelTable;
  constructor(levelTable : LevelTable) {
    this._exp = 0;
    this._current = 1;
    this._levelTable = levelTable;
  }

  /**
  * Return max level that player can reach
  */
  public get max() : number {
    return this._levelTable.getMaxLevel();
  }

  /**
  * current level
  */
  public get current() : number {
    return this._current;
  }

  /**
  * Current experience
  */
  public get experience() : number {
    return this._exp;
  }

  public get maxRequiredExperience() : number {
    return this._levelTable.getMaxExp(this._current);
  }

  /**
  * @return true if reached next level
  */
  public gain(experience : number) : boolean {
    this._exp += experience;

    if (this.experience >= this.maxRequiredExperience) {
      let diffExp = this.experience - this.maxRequiredExperience;
      if (diffExp > 0) {
        this._exp = diffExp;
      }
      this._current += 1;
      return true;
    } else {
      return false;
    }
  }

  /**
  * Return stats for current level
  */
  public provideStats(stats : Array<Stats>) : void {
    stats.push(this._levelTable.forLevel(this._current));
  }
}
