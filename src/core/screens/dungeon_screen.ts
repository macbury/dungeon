import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE, TILE_SIZE } from '../consts';
import FSM from '../fsm/fsm';
import PathFinderPlugin from '../../lib/path_finder_plugin';
import TurnStates from '../states/turn_states';

import Level from '../level';

import Player from '../objects/player';

import PlayerChooseActionState from '../states/player_choose_action_state';
import PlayerMoveActionState from '../states/player_move_action_state';

export default class DungeonScreen extends Phaser.State {
  public level        : Level;

  public player          : Player;
  public pathFinding     : PathFinderPlugin;
  protected sceneFSM     : FSM<DungeonScreen>;

  public preload() : void {
    this.load.image('dwarf', require('dwarf.png'));
    this.load.image('knight', require('knight2.png'));
    this.load.image('dungeon-tileset', require('tileset.png'));
  }

  public create() : void {
    this.input.mouse.capture = true;
    this.prepareStateMachine();

    this.pathFinding         = this.game.plugins.add(PathFinderPlugin);

    this.level               = new Level(this.game, 'dungeon-tileset', 10, 10);
    this.level.generate();



    //this.input.onTap.add(this.onTap, this);

    var x = 1;
    var y = 1;

    this.player = new Player(this.game, 'knight');
    this.player.position.set(0,0);
    //this.playerSprite = this.add.sprite(8 + x * 16, 8 + y * 16, 'knight');
    //this.playerSprite.anchor.set(0.5,0.5);

    //this.camera.follow(this.playerSprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    //this.worldLayer.add(this.playerSprite);
  }

  private prepareStateMachine() : void {
    this.sceneFSM = new FSM<DungeonScreen>(this);
    this.sceneFSM.register(TurnStates.PLAYER_CHOOSE_ACTION, new PlayerChooseActionState());
    this.sceneFSM.register(TurnStates.PLAYER_MOVE, new PlayerMoveActionState());
    this.sceneFSM.enter(TurnStates.PLAYER_CHOOSE_ACTION);
  }

  public update() : void {
    if (this.sceneFSM != null)
      this.sceneFSM.update(this.time.elapsedMS);
  }

  public shutdown() : void {
    this.game.plugins.remove(this.pathFinding);
  }

  private onTap(pointer : Phaser.Pointer, doubleTap : boolean) : void {
    /*console.log(this.groundLayer.getTileX(pointer.worldX) + "x" + this.groundLayer.getTileY(pointer.worldY));
    var targetPos : Phaser.Point = new Phaser.Point();
    this.groundLayer.getTileXY(pointer.worldX, pointer.worldY, targetPos);
    this.pathFinding.findPath(new Phaser.Point(1,1), targetPos).addOnce((path : Phaser.Point[]) => {
      if (path != null) {
        console.log("Found: ", path.length);

        this.add.tween(this.playerSprite).to({
          x: this.groundLayer.getTileX(pointer.worldX) * this.map.tileWidth + 8,
          y: this.groundLayer.getTileY(pointer.worldY) * this.map.tileHeight + 8
        }).start();
      }
    });*/
  }
}
