import Mob from '../mob';

export default class Slime extends Mob {
  constructor(game : Phaser.Game) {
    super(game, 'slime');
  }

  public static preload(load : Phaser.Loader) {
    load.image('slime', require('slime.png'));
  }
}
