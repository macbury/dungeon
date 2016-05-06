
import Character from '../objects/character';
const HEALTH_BAR_SPRITE_SHEET : string = require("ui/health.png");
const HEALTH_BAR_KEY : string          = "HEALTH_BAR_KEY";
const HEALTH_BAR_FRAME_COUNT : number  = 4;
/**
* This ui component display character health. The healthbar is only updated by pending actions
*/
export default class HealthBar extends Phaser.Sprite {
  private character : Character;
  constructor(game: Phaser.Game, character : Character) {
    super(game, 10,10, HEALTH_BAR_KEY);
    this.character     = character;
    this.fixedToCamera = true;
    character.health.onUpdate.add(this.updateHealthFrame, this);
    this.updateHealthFrame();
  }

  /**
  * Update frame of healthbar to match current healthPercent
  */
  private updateHealthFrame() {
    this.frame = HEALTH_BAR_FRAME_COUNT - Math.round(this.character.health.visualPercent * HEALTH_BAR_FRAME_COUNT);
  }


  public static preload(load : Phaser.Loader) : void {
    load.spritesheet(HEALTH_BAR_KEY, HEALTH_BAR_SPRITE_SHEET, 16, 16);
  }
}
