import Character from '../objects/character';

const HEALTH_BAR_WIDTH : number  = 120;
const HEALTH_BAR_HEIGHT : number = 5;
const HEALTH_BAR_SIZE   : number = 0.55;
var cachedHealthBarBackground : Phaser.BitmapData;
var cachedHealthBarForeground : Phaser.BitmapData;

function healthForegroundBitmapData(game : Phaser.Game) : Phaser.BitmapData {
  if (cachedHealthBarForeground == null){
    cachedHealthBarForeground = game.add.bitmapData(HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    cachedHealthBarForeground.ctx.fillStyle = "#6daa2c";
    cachedHealthBarForeground.ctx.beginPath();
    cachedHealthBarForeground.ctx.rect(0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    cachedHealthBarForeground.ctx.fill();
  }
  return cachedHealthBarForeground;
}

function healthBarBitmapData(game : Phaser.Game) : Phaser.BitmapData {
  if (cachedHealthBarBackground == null){
    cachedHealthBarBackground = game.add.bitmapData(HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    cachedHealthBarBackground.ctx.fillStyle = "#d34549";
    cachedHealthBarBackground.ctx.beginPath();
    cachedHealthBarBackground.ctx.rect(0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    cachedHealthBarBackground.ctx.fill();
  }
  return cachedHealthBarBackground;
}

/**
* This ui component display character health. The healthbar is only updated by pending actions
*/
export default class PlayerHealthBar extends Phaser.Group {
  private character : Character;
  private barSprite : Phaser.Sprite;
  private bgSprite  : Phaser.Sprite;
  constructor(game: Phaser.Game, character : Character) {
    super(game);
    this.character     = character;
    character.health.onUpdate.add(this.updateHealthFrame, this);
    this.drawBar();
    this.resize();
  }

  private drawBar() : void {
    this.barSprite = this.game.add.sprite(0,0, healthForegroundBitmapData(this.game));
    this.bgSprite = this.game.add.sprite(0,0, healthBarBitmapData(this.game));
    this.add(this.bgSprite);
    this.add(this.barSprite);
    this.barSprite.fixedToCamera = this.bgSprite.fixedToCamera = true;
  }

  private get healthBarWidth() : number {
    return this.game.width * HEALTH_BAR_SIZE;
  }

  private get healthSize() : number {
    return Math.round(this.character.health.visualPercent * this.healthBarWidth);
  }

  public resize() {
    this.bgSprite.width  = this.healthBarWidth;
    this.barSprite.width = this.healthSize;
    this.updateHealthFrame();
  }

  /**
  * Update frame of healthbar to match current healthPercent
  */
  private updateHealthFrame() {
    this.game.add.tween(this.barSprite).to({
      width: this.healthSize
    }, 100, Phaser.Easing.Linear.None, true);
  }

  public static preload(load : Phaser.Loader) : void {}
}
