import Character from './objects/character';
import Map from './map';
/**
* Contains grid of all characters in level
*/
export default class CharactersGrid {
  private _grid : Character[][];
  private columns : number;
  private rows    : number;

  constructor(map : Map) {
    this.columns = map.width;
    this.rows    = map.height;

    this._grid   = [];

    for (let column = 0; column < this.columns; column++) {
      this._grid.push(new Array(this.rows));
    }
  }

  /**
  * Set character in grid
  */
  public set(x : number, y : number, character : Character) {
    this._grid[x][y] = character;
  }

  /**
  * Return character for passed tile position
  */
  public get(x : number, y : number) : Character {
    return this._grid[x][y];
  }

  /**
  * Return true if there is no object at positions
  */
  public isEmpty(x : number, y : number) : boolean {
    return this.get(x,y) == null;
  }
}
