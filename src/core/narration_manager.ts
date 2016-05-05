import Env from './env';
import { NARRATOR_TEXT_STYLE_INFO, NARRATOR_BOX_HEIGHT, NARRATOR_TEXT_COLOR_INFO, NARRATOR_TEXT_COLOR_DANGER } from './consts';

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

  /**
  * Calculate narration box position on screen
  */
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

  /**
  * Push log into narration box
  */
  private pushMsg(msg : string) : Phaser.Text {
    for (let i = 1; i < this.logsTextViews.length; i++) {
      var prevTextView : Phaser.Text = this.logsTextViews[i-1];
      var currTextView : Phaser.Text = this.logsTextViews[i];
      prevTextView.fill   = currTextView.fill;
      prevTextView.text   = currTextView.text;
    }

    var currTextView : Phaser.Text = this.logsTextViews[this.logsTextViews.length-1];
    currTextView.text = msg;
    return currTextView;
  }

  public info(msg : string) : void {
    this.pushMsg(msg).fill = NARRATOR_TEXT_COLOR_INFO;
  }

  public danger(msg : string) : void {
    this.pushMsg(msg).fill = NARRATOR_TEXT_COLOR_DANGER;
  }

  /**
  * Update narration layer position
  */
  public render() {
    this.calculateLogView();
    this.layer.position.set(this.narrationRect.x, this.narrationRect.y);
  }
}
