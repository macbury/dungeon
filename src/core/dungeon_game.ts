import * as Phaser from 'phaser';
var MageImgUrl : String = require('../assets/mage.png');

/**
* Main game class that extends Phaser.Game
*/
export default class DungeonGame extends Phaser.Game {
  /**
  * Create game and insert it into container
  * @param container element to insert
  */
  constructor(width: number, height: number, container : Element) {
    super(width, height, Phaser.WEBGL, container, null, false, false);
  }
}
//http://opengameart.org/content/16x16-fantasy-tileset
