import Player from '../player';
import { PendingTurnAction } from './pending_turn_actions';
import NarrationManager from '../../narration_manager';
import Env from '../../env';

const EXP_GAIN_COLOR : string = "#dbd75d";
const LEVEL_UP_COLOR : string = "#6daa2c";

const TXT_LEVEL_UP = "level up!";
const TXT_NEW_LEVEL =
  "Now you are healthier and more focused. " +
  "It's easier for you to hit enemies and dodge their attacks.";

export default class PendingPlayerExperienceGainAction extends PendingTurnAction<Player> {
  private experienceGained : number;
  private didLevelUp : boolean;
  private level : number;
  private health : number;
  constructor(env : Env, player : Player, experienceGained : number, didLevelUp : boolean) {
    super(env, player);
    this.level            = player.level.current;
    this.didLevelUp       = didLevelUp;
    this.experienceGained = experienceGained;
    this.health           = player.health.current;
  }

  protected performTurn() : void {
    if (this.didLevelUp) {
      this.owner.health.visual = this.health;
      this.owner.statusText(TXT_LEVEL_UP, LEVEL_UP_COLOR).onComplete.addOnce(this.completeAction, this);
    } else {
      this.owner.statusText(`+ ${this.experienceGained} EXP`, EXP_GAIN_COLOR).onComplete.addOnce(this.completeAction, this);
    }
  }


  public turnDescription(narration : NarrationManager) : void {
    if (this.didLevelUp) {
      narration.info(`Welcome to level ${this.level}!`);
      narration.info(TXT_NEW_LEVEL);
    }
  }
}
