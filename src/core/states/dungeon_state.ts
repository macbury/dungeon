import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE, TILE_SIZE } from '../consts';
import PathFinderPlugin from '../../lib/path_finder_plugin';

export default class DungeonState extends Phaser.State {
  /**
  * Main world layer
  */
  protected worldLayer   : Phaser.Group;
  protected map          : Phaser.Tilemap;
  protected groundLayer  : Phaser.TilemapLayer;
  protected playerSprite : Phaser.Sprite;
  protected pathFinding  : PathFinderPlugin;

  public preload() : void {
    this.load.image('dwarf', require('dwarf.png'));
    this.load.image('knight', require('knight2.png'));
    this.load.image('dungeon-tileset', require('tileset.png'));
  }

  public create() : void {
    this.pathFinding = this.game.plugins.add(PathFinderPlugin);
    this.worldLayer  = this.add.group();

    this.map        = this.add.tilemap();
    this.map.setTileSize(TILE_SIZE, TILE_SIZE);
    this.map.addTilesetImage('dungeon-tileset');

    this.groundLayer = this.map.create('ground', 100, 100, TILE_SIZE, TILE_SIZE, this.worldLayer);
    this.map.setPreventRecalculate(true);
    for (var x = 0; x < 50; x++) {
      for (var y = 0; y < 50; y++) {

        this.map.putTile(19, x, y, this.groundLayer);
      }
    }
    this.map.setPreventRecalculate(false);
    this.groundLayer.resizeWorld();

    this.input.mouse.capture = true;
    this.input.onTap.add(this.onTap, this);

    var dwarfSprite : Phaser.Sprite = this.add.sprite(8, 8, 'dwarf');
    dwarfSprite.anchor.set(0.5,0.5);
    this.worldLayer.add(dwarfSprite);

    var x = 1;
    var y = 1;

    this.playerSprite = this.add.sprite(8 + x * 16, 8 + y * 16, 'knight');
    this.playerSprite.anchor.set(0.5,0.5);

    this.camera.follow(this.playerSprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    this.worldLayer.add(this.playerSprite);

  }

  public shutdown() : void {
    this.game.plugins.remove(this.pathFinding);
  }

  private onTap(pointer : Phaser.Pointer, doubleTap : boolean) : void {
    this.add.tween(this.playerSprite).to({
      x: this.groundLayer.getTileX(pointer.worldX) * this.map.tileWidth + 8,
      y: this.groundLayer.getTileY(pointer.worldY) * this.map.tileHeight + 8
    }).start();
    console.log(this.groundLayer.getTileX(pointer.worldX) + "x" + this.groundLayer.getTileY(pointer.worldY));
  }

  public resize() : void {
    if (this.game.device.desktop) {
      //this.worldLayer.scale.set(DESKTOP_SCALE);
    } else {
      //this.worldLayer.scale.set(MOBILE_SCALE);
    }
  }
}
