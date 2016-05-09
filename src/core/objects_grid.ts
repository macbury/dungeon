import ObjectItem from './objects/object_item';
import Level from './level';
/**
* Contains grid of all game objects like chest, plants or dropped item in level
*/
export default class CharactersGrid {
  private _grid : ObjectItem[][];
  private columns : number;
  private rows    : number;

  constructor(level : Level) {
    this.columns = level.width;
    this.rows    = level.height;

    this._grid   = [];

    for (let column = 0; column < this.columns; column++) {
      this._grid.push(new Array(this.rows));
    }
  }

  /**
  * Set character in grid
  */
  public set(x : number, y : number, gameObject : ObjectItem) {
    this._grid[x][y] = gameObject;
  }

  /**
  * Return character for passed tile position
  */
  public get(x : number, y : number) : ObjectItem {
    return this._grid[x][y];
  }
}
