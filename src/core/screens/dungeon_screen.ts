import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE, TILE_SIZE } from '../consts';
import FSM from '../fsm/fsm';
import PathFinderPlugin from '../../lib/path_finder_plugin';
import TurnStates from '../states/turn_states';

import Cursor from '../ui/cursor';
import Level from '../level';

import MonstersManager from '../monsters_manager';

import Player from '../objects/player';
import Slime from '../objects/monsters/slime';

import PlayerChooseActionState from '../states/player_choose_action_state';
import PerformTurnActionsState from '../states/perform_turn_actions_state';

export default class DungeonScreen extends Phaser.State {
  public level        : Level;

  public cursor          : Cursor;
  public monstersLayer   : Phaser.Group;
  public uiLayer         : Phaser.Group;
  public player          : Player;
  public pathFinding     : PathFinderPlugin;
  protected sceneFSM     : FSM<DungeonScreen>;
  public monsters        : MonstersManager;

  public preload() : void {
    Slime.preload(this.load);
    Player.preload(this.load);
    this.load.image('cursor', require('cursor.png'));
    this.load.image('tileset', require('tileset.png'));
  }

  public create() : void {
    this.input.mouse.capture = true;
    this.prepareStateMachine();
    this.pathFinding         = this.game.plugins.add(PathFinderPlugin);

    this.level               = new Level(this, 'tileset', 100, 100);
    this.level.generate();
    this.level.setupPathFinding(this.pathFinding);

    this.player = new Player(this);
    this.player.position.set(16,16);
    this.player.follow(this.camera);

    this.monstersLayer       = this.add.group();
    this.monsters            = new MonstersManager(this, this.monstersLayer);

    for (let i = 0; i < 10; i++) {
      this.monsters.spawn(Slime, 5,2*i);
    }


    this.uiLayer             = this.add.group();
    this.cursor = new Cursor(this.game);
    this.uiLayer.add(this.cursor);
  }

  private prepareStateMachine() : void {
    this.sceneFSM = new FSM<DungeonScreen>(this);
    this.sceneFSM.register(TurnStates.PLAYER_CHOOSE_ACTION, new PlayerChooseActionState());
    this.sceneFSM.register(TurnStates.PERFORM_TURN_ACTIONS, new PerformTurnActionsState());

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
