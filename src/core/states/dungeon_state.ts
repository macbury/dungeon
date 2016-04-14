import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE } from '../consts';

export default class DungeonState extends Phaser.State {
  private worldLayer : Phaser.Group;

  public preload() : void {
    this.load.image('dwarf', require('dwarf.png'));
    this.load.image('knight', require('knight2.png'));
  }

  public create() : void {
    console.log("Create!");
    this.worldLayer = this.add.group();
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        var mageSprite : Phaser.Sprite = this.add.sprite(8 + x * 16, 8 + y * 16, 'knight');
        mageSprite.anchor.set(0.5,0.5);
        this.worldLayer.add(mageSprite);
      }
    }

    this.input.onDown.add(this.gofull, this);
    this.resize();
  }

  public resize() : void {
    if (this.game.device.desktop) {
      this.worldLayer.scale.set(DESKTOP_SCALE * window.devicePixelRatio);
    } else {
      this.worldLayer.scale.set(MOBILE_SCALE * window.devicePixelRatio);
    }
  }

  private gofull() : void {
    if (this.scale.isFullScreen)
    {
        //this.scale.stopFullScreen();
    }
    else
    {
        //this.scale.startFullScreen(false);
    }
  }
}
