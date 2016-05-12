import { TILE_SIZE } from '../consts';
import Health from '../rpg/health';

const HEALTH_BAR_WIDTH  : number = TILE_SIZE;
const HEALTH_BAR_HEIGHT : number = 2;
var cachedHealthBarBackground : Phaser.BitmapData;
var cachedHealthBarForeground : Phaser.BitmapData;

function healthForegroundBitmapData(game : Phaser.Game) : Phaser.BitmapData {
  if (cachedHealthBarForeground == null){
    cachedHealthBarForeground = game.add.bitmapData(TILE_SIZE, 2);
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
* Display health bar above monster
*/
export default class MobHealthBar extends Phaser.Group {
  private barSprite : Phaser.Sprite;
  private bgSprite  : Phaser.Sprite;
  private health    : Health;

  constructor(game: Phaser.Game, health : Health) {
    super(game);
    this.health = health;
    health.onUpdate.add(this.updateHealth, this);

    this.drawBar();
  }

  private drawBar() : void {
    this.barSprite = this.game.add.sprite(0,0, healthForegroundBitmapData(this.game));
    this.bgSprite = this.game.add.sprite(0,0, healthBarBitmapData(this.game));
    this.add(this.bgSprite);
    this.add(this.barSprite);
    this.updateHealth();
  }

  private updateHealth() : void {
    this.game.add.tween(this.barSprite).to({
      width: Math.round(this.health.visualPercent * HEALTH_BAR_WIDTH)
    }, 300, Phaser.Easing.Linear.None, true);
  }
}
