import Player from '../player';
import { PendingTurnAction } from './pending_turn_actions';
import NarrationManager from '../../narration_manager';
import Env from '../../env';

const EXP_GAIN_COLOR : string = "#dbd75d";

export default class PendingPlayerExperienceGainAction extends PendingTurnAction<Player> {
  private experienceGained : number;
  private didLevelUp : boolean;

  constructor(env : Env, player : Player, experienceGained : number, didLevelUp : boolean) {
    super(env, player);
    this.didLevelUp       = didLevelUp;
    this.experienceGained = experienceGained;
  }

  protected performTurn() : void {
    this.owner.statusText(`+ ${this.experienceGained} EXP`, EXP_GAIN_COLOR).onComplete.addOnce(this.completeAction, this);
  }


  public turnDescription(narration : NarrationManager) : void {
    //narration.info(`${this.owner.name} gained ${}`);
  }
}
