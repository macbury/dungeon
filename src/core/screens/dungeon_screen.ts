import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE, TILE_SIZE, LAYERS } from '../consts';
import FSM from '../fsm/fsm';
import PathFinderPlugin from '../../lib/path_finder_plugin';
import TurnStates from '../states/turn_states';

import Cursor from '../ui/cursor';
import Level from '../level';

import MonstersManager from '../monsters_manager';

import Player from '../objects/player';

import Slime from '../objects/monsters/slime';
import Ant from '../objects/monsters/ant';

import PlayerChooseActionState from '../states/player_choose_action_state';
import PerformTurnActionsState from '../states/perform_turn_actions_state';

import Env from '../env';

export default class DungeonScreen extends Phaser.State {
  public cursor           : Cursor;
  public gameObjectsLayer : Phaser.Group;
  public uiLayer          : Phaser.Group;
  public pathFinding      : PathFinderPlugin;
  protected sceneFSM      : FSM<DungeonScreen>;

  public env : Env;

  public preload() : void {
    Env.preload(this.load);
    Slime.preload(this.load);
    Player.preload(this.load);
    Ant.preload(this.load);
    this.load.image('cursor',  require('cursor.png'));
    this.load.image('tileset', require('tileset.png'));
  }

  public create() : void {
    this.prepareStateMachine();
    this.input.mouse.capture = true;
    this.pathFinding         = this.game.plugins.add(PathFinderPlugin);
    this.env                 = new Env(this);
    this.gameObjectsLayer    = this.add.group();


    for (let i = 0; i < 20; i++) {
      this.env.monsters.spawn(Slime, this.rnd.between(0, 20), this.rnd.between(0, 20));
      this.env.monsters.spawn(Ant, this.rnd.between(0, 20), this.rnd.between(0, 20));
    }

    this.env.spawnPlayer();


    this.uiLayer  = this.add.group();
    this.cursor   = new Cursor(this.game);
    this.uiLayer.add(this.cursor);

    this.uiLayer.z          = LAYERS.UI;
    this.gameObjectsLayer.z = LAYERS.GAME_OBJECTS;

    this.add.text(2,2, "Hello world", { font: "10px MainFont", fill: '#fff', stroke: '#000', strokeThickness: 2 });
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
    this.gameObjectsLayer.sort('y', Phaser.Group.SORT_ASCENDING);
  }

  public shutdown() : void {
    this.game.plugins.remove(this.pathFinding);
  }
}
