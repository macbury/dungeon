import ObjectItem from './objects/object_item';
import Map from './map';
import CollectableItem from './objects/collectable_item';
/**
* Contains grid of all game objects like chest, plants or dropped item in level
*/
export default class CharactersGrid {
  private _grid : ObjectItem[][];
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
  public set(x : number, y : number, gameObject : ObjectItem) {
    this._grid[x][y] = gameObject;
  }

  /**
  * Return character for passed tile position
  */
  public get(x : number, y : number) : ObjectItem {
    return this._grid[x][y];
  }

  /**
  * Return true if there is no object at positions
  */
  public isEmpty(x : number, y : number) : boolean {
    return this.get(x,y) == null;
  }

  /**
  * Return true if item on this tile can be picked
  */
  public isCollectable(x : number, y : number) : boolean {
    return this.get(x,y) instanceof CollectableItem;
  }
}
