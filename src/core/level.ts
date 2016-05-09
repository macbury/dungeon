import { TILE_SIZE } from './consts';
import GameObject from './objects/game_object';
import PathFinderPlugin from '../lib/path_finder_plugin';
import DungeonScreen from './screens/dungeon_screen';
import Character from './objects/character';
const PASSABLE_TILES = [8];

export default class Level extends Phaser.Tilemap {
  /**
  * Elements on ground
  */
  public groundLayer  : Phaser.TilemapLayer;
  /**
  * Elements on wall
  */
  public wallLayer    : Phaser.TilemapLayer;

  public tilemapLayers : Array<Phaser.TilemapLayer>;

  /**
  * If true we need to resize tilemap layers. Triggered by resize event
  */
  private dirtySize : boolean;

  constructor(screen : DungeonScreen, tilesetKey : string, columns : number, rows : number) {
    super(screen.game, null, TILE_SIZE, TILE_SIZE, columns, rows);
    this.setPreventRecalculate(true);
    this.addTilesetImage(tilesetKey);
    /**
    * Add each created layer to  tilemapLayers. This will ensure that they will be resized
    */
    this.tilemapLayers = [];
    this.groundLayer = this.create('ground', columns, rows, TILE_SIZE, TILE_SIZE);
    this.wallLayer   = this.create('walls', columns, rows, TILE_SIZE, TILE_SIZE);
    this.tilemapLayers.push(this.groundLayer);
    this.tilemapLayers.push(this.wallLayer);

  }

  /**
  * Returns tile position for current pointer
  */
  public getTilePositionFor(pointer : Phaser.Pointer) : Phaser.Point {
    var targetPos : Phaser.Point = new Phaser.Point();
    this.groundLayer.getTileXY(pointer.worldX, pointer.worldY, targetPos);
    return targetPos;
  }

  public resize() {
    this.dirtySize = true;
  }

  /**
  * Recalculate field of view
  */
  public update() : void {
    if (this.dirtySize) {
      for (let i = 0; i < this.tilemapLayers.length; i++) {
        this.tilemapLayers[i].resize(this.game.width, this.game.height);
      }
      this.dirtySize = false;
    }

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
          let wallTile : Phaser.Tile = this.putTile(4, x, y, this.groundLayer);
        }
      }
    }

    this.groundLayer.resizeWorld();

  }

  /**
  * Return true if passed tilePos is passable
  */
  public isPassable(tilePos : Phaser.Point) : boolean {
    var tile : Phaser.Tile = this.getTile(tilePos.x, tilePos.y);
    return tile != null && PASSABLE_TILES.indexOf(tile.index) != -1;
  }

  /**
  * Configure {PathFinderPlugin}  with data from level
  */
  public setupPathFinding(pathFinding : PathFinderPlugin) : void {
    console.warn("Check which Phaser.Tile is not collides and pass its gids here");
    pathFinding.setGrid(
      this.layers[0].data,
      PASSABLE_TILES
    );
  }
}
