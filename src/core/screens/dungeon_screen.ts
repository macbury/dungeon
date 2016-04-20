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

    this.player = new Player(this.game, 'knight');
    this.player.position.set(16,16);
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
}
