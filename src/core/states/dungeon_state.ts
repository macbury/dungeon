import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE } from '../consts';

export default class DungeonState extends Phaser.State {
  private worldLayer : Phaser.Group;

  public preload() : void {
    this.load.image('dwarf', require('dwarf.png'));
    this.load.image('knight', require('knight2.png'));
    this.load.image('debug-grid', require('debug-grid.png'));
  }

  public create() : void {
    this.world.setBounds(0, 0, 1920, 1920);
    this.worldLayer = this.add.group();

    var debugGrid    : Phaser.Sprite = this.add.sprite(0,0, 'debug-grid');
    this.worldLayer.add(debugGrid);

    var dwarfSprite : Phaser.Sprite = this.add.sprite(8, 8, 'dwarf');
    dwarfSprite.anchor.set(0.5,0.5);
    this.worldLayer.add(dwarfSprite);

    var x = 1;
    var y = 1;

    var playerSprite : Phaser.Sprite = this.add.sprite(8 + x * 16, 8 + y * 16, 'knight');
    playerSprite.anchor.set(0.5,0.5);

    this.camera.follow(playerSprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    this.worldLayer.add(playerSprite);

    this.resize();
    this.add.tween(playerSprite).to({ y: 300, x: 300 }, 5000).repeatAll(100).start();
  }

  public resize() : void {
    if (this.game.device.desktop) {
      this.worldLayer.scale.set(DESKTOP_SCALE);
    } else {
      this.worldLayer.scale.set(MOBILE_SCALE);
    }
  }
}
