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

import Env from '../env';

export default class DungeonScreen extends Phaser.State {
  public cursor          : Cursor;
  public monstersLayer   : Phaser.Group;
  public uiLayer         : Phaser.Group;
  public pathFinding     : PathFinderPlugin;
  protected sceneFSM     : FSM<DungeonScreen>;

  public env : Env;

  public preload() : void {
    Slime.preload(this.load);
    Player.preload(this.load);
    this.load.image('cursor',  require('cursor.png'));
    this.load.image('tileset', require('tileset.png'));
    this.load.audio('hit',     require('audio/snd_hit.mp3'));
  }

  public create() : void {
    this.env                 = new Env();
    this.env.screen          = this;
    this.input.mouse.capture = true;
    this.prepareStateMachine();
    this.pathFinding         = this.game.plugins.add(PathFinderPlugin);

    this.env.level           = new Level(this, 'tileset', 100, 100);
    this.env.level.generate();
    this.env.level.setupPathFinding(this.pathFinding);

    this.env.player = new Player(this.env);
    this.env.player.position.set(16,16);
    this.env.player.follow(this.camera);

    this.monstersLayer       = this.add.group();
    this.env.monsters        = new MonstersManager(this.env);

    for (let i = 0; i < 40; i++) {
      this.env.monsters.spawn(Slime, this.rnd.between(0, 20), this.rnd.between(0, 20));
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
