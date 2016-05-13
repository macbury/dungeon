import * as Phaser from 'phaser';
import { TILE_SIZE, LAYERS, NARRATOR_BOX_HEIGHT } from '../consts';
import FSM from '../fsm/fsm';
import PathFinderPlugin from '../../lib/path_finder_plugin';
import TurnStates from '../states/turn_states';

import Cursor from '../ui/cursor';
import ExpBar from '../ui/exp_bar';
import PlayerHealthBar from '../ui/player_health_bar';
import Map from '../map';

import MonstersManager from '../monsters_manager';

import Player from '../objects/player';

import { Slime, Ant } from '../objects/monsters';;

import PlayerChooseActionState from '../states/player_choose_action_state';
import PerformTurnActionsState from '../states/perform_turn_actions_state';
import PlayerGameOverState  from '../states/player_game_over_state';
import Env from '../env';

/**
* In this state whole gameplay is performed
*/
export default class DungeonScreen extends Phaser.State {
  public cursor           : Cursor;
  public healthBar        : PlayerHealthBar;
  public expBar           : ExpBar;
  public gameObjectsLayer : Phaser.Group;
  public uiLayer          : Phaser.Group;
  public itemsLayer       : Phaser.Group;
  /**
  * This layer is at bottom of the screen and its fixed to camera
  */
  public narratorLayer    : Phaser.Group;
  public pathFinding      : PathFinderPlugin;
  protected sceneFSM      : FSM<DungeonScreen>;

  public env : Env;

  public preload() : void {
    Env.preload(this.load);
    PlayerHealthBar.preload(this.load);
    ExpBar.preload(this.load);
  }

  public create() : void {
    this.prepareStateMachine();
    this.input.mouse.capture = true;
    this.pathFinding         = this.game.plugins.add(PathFinderPlugin);
    this.uiLayer             = this.add.group();
    this.narratorLayer       = this.add.group(this.uiLayer);
    this.env                 = new Env(this);

    this.itemsLayer          = this.add.group();
    this.gameObjectsLayer    = this.add.group();

    for (let i = 0; i < 20; i++) {
      this.env.monsters.spawn(Slime, this.rnd.between(0, 20), this.rnd.between(0, 20));
      this.env.monsters.spawn(Ant, this.rnd.between(0, 20), this.rnd.between(0, 20));
    }

    this.env.monsters.spawn(Slime, 4, 1);

    this.env.spawnPlayer();

    this.healthBar = new PlayerHealthBar(this.game, this.env.player);
    this.healthBar.position.x = this.healthBar.position.y = 2;

    this.expBar    = new ExpBar(this.env);
    this.expBar.position.x = 2;
    this.expBar.position.y = 9;

    this.cursor   = new Cursor(this.game);
    this.uiLayer.add(this.cursor);
    this.uiLayer.add(this.healthBar);
    this.uiLayer.add(this.expBar);

    this.world.bringToTop(this.uiLayer);

    this.env.narration.info("Welcome in my custom dungeon!");
    this.env.narration.info("You dare to fight! Then we shall fight");
  }

  private prepareStateMachine() : void {
    this.sceneFSM = new FSM<DungeonScreen>(this);
    this.sceneFSM.register(TurnStates.PLAYER_CHOOSE_ACTION, new PlayerChooseActionState());
    this.sceneFSM.register(TurnStates.PERFORM_TURN_ACTIONS, new PerformTurnActionsState());
    this.sceneFSM.register(TurnStates.GAME_OVER, new PlayerGameOverState());
    this.sceneFSM.enter(TurnStates.PLAYER_CHOOSE_ACTION);
  }

  public resize() : void {
    this.env.map.resize();
    this.healthBar.resize();
    this.expBar.resize();
  }

  public update() : void {
    if (this.sceneFSM != null)
      this.sceneFSM.update(this.time.elapsedMS);
    this.gameObjectsLayer.sort('y', Phaser.Group.SORT_ASCENDING);
    this.env.update();
  }

  public preRender() : void {
    // update here narration layer removes jitter on moving
    this.env.narration.render();
  }

  public shutdown() : void {
    this.game.plugins.remove(this.pathFinding);
  }
}
