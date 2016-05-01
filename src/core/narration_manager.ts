import Env from './env';
import { NARRATOR_TEXT_STYLE_INFO, NARRATOR_BOX_HEIGHT } from './consts';
/**
* Displays narration text in special layer
*/
export default class NarrationManager {
  private env : Env;
  private i : number = 0;
  constructor(env : Env) {
    this.env = env;
  }

  /**
  * reference to DungeonScreen#narrationLayer
  */
  private get layer() : Phaser.Group {
    return this.env.screen.narratorLayer;
  }

  /**
  * Reference to current game
  */
  private get game() : Phaser.Game {
    return this.env.game;
  }

  public info(msg : string) : void {
    console.log(msg);
    var narrationLogText : Phaser.Text = this.game.add.text(0,this.i * 10, msg, NARRATOR_TEXT_STYLE_INFO);
    narrationLogText.setTextBounds(5, 0, this.game.camera.width - 10, 10);
    this.layer.add(narrationLogText);
    //narrationLogText.wordWrap = true;
    //narrationLogText.wordWrapWidth = this.layer.width;
    //console.log(this.layer.position);
    this.i++;
  }

  public danger(msg : string) : void {
    this.info(msg);
  }

  /**
  * Update narration layer position
  */
  public render() {
    this.layer.position.set(this.game.camera.x, this.game.camera.y + this.game.camera.height - NARRATOR_BOX_HEIGHT);
  }
}
