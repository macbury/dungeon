import { TILE_SIZE } from './consts';

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
  * Generate whole level
  */
  public generate() : void {
    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        this.putTile(19, x, y, this.groundLayer);

        if (x == 0 || y == 0 || x == 9 || y == 9  || (x == 3 && y < 5)) {
          this.putTile(0, x, y, this.groundLayer);
        }
      }
    }

    this.groundLayer.resizeWorld();
  }
}
