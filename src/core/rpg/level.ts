/**
* This class defines Level for Character. It contains current level, max level that character can get, how many experience points it currently has,
* and how many he needs to get to next level
*/
export default class Level {
  private _current : number;
  private _max     : number;

  private _exp : number;
  private _nextLevel : number;

  constructor() {
    this._exp = 0;
    this._current = 1;
  }

  /**
  * @return true if reached next level
  */
  public gain(experience : number) : boolean {
    this._exp += experience;
    console.warn("Experience: ", this._exp);
    return false;
  }
}
