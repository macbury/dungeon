import * as Phaser from 'phaser';

/**
* This state is only used to load loading screen assets :P
**/
export default class BootScreen extends Phaser.State {

  public preload() {

  }

  public create() {
    this.scale.refresh();
  }

  public update() {
    this.game.state.start('Loading', true);
  }
}
