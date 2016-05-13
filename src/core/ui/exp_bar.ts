import Player from '../objects/player';
import Env from '../env';
const EXP_BAR_SIZE : number   = 0.50;
const EXP_BAR_HEIGHT : number = 3;

/**
* This ui component display character health. The healthbar is only updated by pending actions
*/
export default class ExpBar extends Phaser.Group {
  private barForegroundBitmapData : Phaser.BitmapData;
  private barBackroundBitmapData : Phaser.BitmapData;
  private player : Player;
  private barSprite : Phaser.Sprite;
  private bgSprite  : Phaser.Sprite;
  private _currentExp : number;
  constructor(env: Env) {
    super(env.game);
    this.player = env.player;
    this.barForegroundBitmapData = this.createBitmapDataForColor('#dbd75d');
    this.barBackroundBitmapData  = this.createBitmapDataForColor('#864d30');
    this.barSprite = this.game.add.sprite(0,0, this.barForegroundBitmapData);
    this.bgSprite  = this.game.add.sprite(0,0, this.barBackroundBitmapData);
    this.add(this.bgSprite);
    this.add(this.barSprite);
    this._currentExp = this.player.level.experience;
    this.resize();
    this.barSprite.fixedToCamera = this.bgSprite.fixedToCamera = true;
    env.events.onExperienceChange.add(this.onExpChange, this);
    env.events.onLevelUp.add(this.onLevelChange, this);
  }

  private onLevelChange(level : number, experience : number) {
    this._currentExp = this.player.level.maxRequiredExperience;
    //TODO better effect for level up
    this.game.add.tween(this.barSprite).to({
      width: this.getWidthInPixels(),
    }, 100, Phaser.Easing.Linear.None, true).onComplete.addOnce(() => {
      this._currentExp = experience;
      this.barSprite.width = this.getWidthInPixels();
    });
  }

  /**
  * This method is triggered by pending action
  */
  private onExpChange(currentExperience : number) {
    this._currentExp = currentExperience;
    this.updateFrame();
  }

  private createBitmapDataForColor(color : string) : Phaser.BitmapData {
    let cachedHealthBarForeground = this.game.add.bitmapData(1, 1);
    cachedHealthBarForeground.ctx.fillStyle = color;
    cachedHealthBarForeground.ctx.beginPath();
    cachedHealthBarForeground.ctx.rect(0, 0, 1, 1);
    cachedHealthBarForeground.ctx.fill();
    return cachedHealthBarForeground;
  }

  public resize() {
    this.bgSprite.width   = this.game.width * EXP_BAR_SIZE;
    this.barSprite.width  = this.getWidthInPixels();
    this.bgSprite.height  = this.barSprite.height = EXP_BAR_HEIGHT;
    this.updateFrame();
  }

  private getWidthInPixels() : number {
    let expInPercent = this._currentExp / this.player.level.maxRequiredExperience;
    return this.game.width * (EXP_BAR_SIZE * expInPercent);
  }

  /**
  * Update frame of exp to match current exp
  */
  private updateFrame() : Phaser.Tween {
    return this.game.add.tween(this.barSprite).to({
      width: this.getWidthInPixels(),
    }, 100, Phaser.Easing.Linear.None, true);
  }

  public destroy(destroyChildren?: boolean, soft?: boolean) {
    super.destroy(destroyChildren, soft);
    this.player = null;
    this.barForegroundBitmapData.destroy();
  }

  public static preload(load : Phaser.Loader) : void {}
}
