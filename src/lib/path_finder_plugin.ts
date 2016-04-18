import { Plugin, Game } from 'phaser';
var EasyStar = require("easystarjs");

export default class PathFinderPlugin extends Plugin {
  private _easyStar : any;
  private _grid     : number[][];
  private _prepared : boolean;
  private _walkables : number[];

  /**
  * Constructor.
  * @param parent
  * @constructor
  */
  constructor(game : Game, parent : PIXI.DisplayObject) {
    super(game, parent);
    this._easyStar = new EasyStar.js();
    this._easyStar.setIterationsPerCalculation(1000);

    this._grid      = null;
    this._walkables = [0];
  }

  /**
  * Set Grid for Pathfinding.
  * @param grid          Mapdata as a two dimensional array.
  * @param walkables     Tiles which are walkable. Every other tile is marked as blocked.
  */
  public setGrid(grid: Phaser.Tile[][], walkables : number[]) {
    this._walkables = walkables;
    this._grid      = [];
    for (var i = 0; i < grid.length; i++) {
      this._grid[i] = [];
      for (var j = 0; j < grid[i].length; j++) {
        if (grid[i][j])
          this._grid[i][j] = grid[i][j].index;
        else
          this._grid[i][j] = 0
      }
    }

    this._easyStar.setGrid(this._grid);
    this._easyStar.setAcceptableTiles(this._walkables);

    // initiate all walkable tiles with cost 1 so they will be walkable even if they are not on the grid map, jet.
    for (i = 0; i < walkables.length; i++) {
      this.setTileCost(walkables[i], 1);
    }
  }

  /**
  * Sets the tile cost for a particular tile type.
  * @param tileType {Number} The tile type to set the cost for.
  * @param cost {Number} The multiplicative cost associated with the given tile.
  */
  public setTileCost(tileType : number, cost : number) {
    this._easyStar.setTileCost(tileType, cost);
  }

  /**
  * Prepare pathcalculation for easystar.
  * @param from  {Phaser.Point}
  * @param to    {Phaser.Point}
  * @return callback - Phaser.Signal with path
  */
  public findPath(from : Phaser.Point, to : Phaser.Point) : Phaser.Signal {
    var callback = new Phaser.Signal();
    this._easyStar.findPath(from.x, from.y, to.x, to.y, function(path) {
      callback.dispatch(path);
    });
    return callback;
  }

  public update() : void {
    this._easyStar.calculate();
  }
}
