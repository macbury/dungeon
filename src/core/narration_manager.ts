import Env from './env';
import { NARRATOR_TEXT_STYLE_INFO, NARRATOR_BOX_HEIGHT } from './consts';

const NUMBER_OF_LOGS_ON_SCREEN = 6;

/**
* Displays narration text in special layer
*/
export default class NarrationManager {
  private env : Env;
  private narrationRect : Phaser.Rectangle;
  private logsTextViews : Array<Phaser.Text>;

  constructor(env : Env) {
    this.env = env;
    this.logsTextViews = new Array<Phaser.Text>();
    this.narrationRect = new Phaser.Rectangle(0,0,0,0);
    this.calculateLogView();

    for (let i = 0; i < NUMBER_OF_LOGS_ON_SCREEN; i++) {
      var narrationLogText : Phaser.Text = this.game.add.text(0,i * 10, "", NARRATOR_TEXT_STYLE_INFO);
      narrationLogText.setTextBounds(5, 0, this.narrationRect.width - 10, 10);
      this.layer.add(narrationLogText);
      this.logsTextViews.push(narrationLogText);
    }
  }

  /**
  * reference to DungeonScreen#narrationLayer
  */
  private get layer() : Phaser.Group {
    return this.env.screen.narratorLayer;
  }

  private calculateLogView() {
    this.narrationRect.setTo(
      this.game.camera.x,
      this.game.camera.y + this.game.camera.height - NARRATOR_BOX_HEIGHT,
      this.game.width,
      NARRATOR_BOX_HEIGHT
    );
  }

  /**
  * Reference to current game
  */
  private get game() : Phaser.Game {
    return this.env.game;
  }

  public info(msg : string) : void {
    console.log(msg);
    for (let i = 1; i < this.logsTextViews.length; i++) {
      var prevTextView : Phaser.Text = this.logsTextViews[i-1];
      var currTextView : Phaser.Text = this.logsTextViews[i];
      prevTextView.colors = currTextView.colors;
      prevTextView.text   = currTextView.text;
    }

    this.logsTextViews[this.logsTextViews.length-1].text = msg;
  }

  public danger(msg : string) : void {
    this.info(msg);
  }

  /**
  * Update narration layer position
  */
  public render() {
    this.calculateLogView();
    this.layer.position.set(this.narrationRect.x, this.narrationRect.y);
  }
}
