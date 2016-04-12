import * as Phaser from 'phaser';

export default class DungeonState extends Phaser.State {

  public preload() : void {
    this.load.image('mage', require('mage.png'));
  }

  public create() : void {
    var mageSprite : Phaser.Sprite = this.add.sprite(0,0, 'mage');
    mageSprite.width  = 64;
    mageSprite.height = 64;
  }
}
