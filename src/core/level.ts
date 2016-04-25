import { TILE_SIZE } from './consts';
import GameObject from './objects/game_object';
import PathFinderPlugin from '../lib/path_finder_plugin';

export default class Level extends Phaser.Tilemap {
  /**
  * Elements on ground
  */
  public groundLayer  : Phaser.TilemapLayer;
  /**
  * Elements on wall
  */
  public wallLayer    : Phaser.TilemapLayer;

  constructor(game : Phaser.Game, tilesetKey : string, columns : number, rows : number) {
    super(game, null, TILE_SIZE, TILE_SIZE, columns, rows);
    this.setPreventRecalculate(true);
    this.addTilesetImage(tilesetKey);
    this.groundLayer = this.create('ground', columns, rows, TILE_SIZE, TILE_SIZE);
    this.wallLayer   = this.create('walls', columns, rows, TILE_SIZE, TILE_SIZE);
  }

  /**
  * Returns tile position for current pointer
  */
  public getTilePositionFor(pointer : Phaser.Pointer) : Phaser.Point {
    var targetPos : Phaser.Point = new Phaser.Point();
    this.groundLayer.getTileXY(pointer.worldX, pointer.worldY, targetPos);
    return targetPos;
  }

  /**
  * Returns {GameObject} position as tile position
  * @param gameObject
  * @param outPoint
  * @return outPoint with gameObject position as tile position
  */
  public getTilePositionForGameObject(gameObject : GameObject, outPoint : Phaser.Point) : Phaser.Point {
    this.groundLayer.getTileXY(gameObject.position.x, gameObject.position.y, outPoint);
    return outPoint;
  }

  /**
  * Generate whole level
  */
  public generate() : void {
    for (var x = 0; x < 100; x++) {
      for (var y = 0; y < 100; y++) {
        this.putTile(8, x, y, this.groundLayer);

        if (x == 0 || y == 0 || (x == 3 && y < 5)) {
          this.putTile(4, x, y, this.groundLayer);
        }
      }
    }

    this.groundLayer.resizeWorld();
  }


  /**
  * Configure {PathFinderPlugin}  with data from level
  */
  public setupPathFinding(pathFinding : PathFinderPlugin) : void {
    pathFinding.setGrid(
      this.layers[0].data,
      [19]
    );
  }
}
