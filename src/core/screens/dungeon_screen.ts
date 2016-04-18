import * as Phaser from 'phaser';
import { DESKTOP_SCALE, MOBILE_SCALE, TILE_SIZE } from '../consts';
import FSM from '../fsm/fsm';
import PathFinderPlugin from '../../lib/path_finder_plugin';
import TurnStates from '../states/turn_states';

import PlayerChooseActionState from '../states/player_choose_action_state';

export default class DungeonScreen extends Phaser.State {
  /**
  * Main world layer
  */
  protected worldLayer   : Phaser.Group;
  protected map          : Phaser.Tilemap;
  protected groundLayer  : Phaser.TilemapLayer;
  protected playerSprite : Phaser.Sprite;
  protected pathFinding  : PathFinderPlugin;
  protected sceneFSM     : FSM<DungeonScreen>;

  public preload() : void {
    this.load.image('dwarf', require('dwarf.png'));
    this.load.image('knight', require('knight2.png'));
    this.load.image('dungeon-tileset', require('tileset.png'));
  }

  public create() : void {
    this.input.mouse.capture = true;

    this.pathFinding         = this.game.plugins.add(PathFinderPlugin);
    this.prepareStateMachine();

    this.worldLayer          = this.add.group();

    this.prepareMap();

    this.input.onTap.add(this.onTap, this);

    var x = 1;
    var y = 1;

    this.playerSprite = this.add.sprite(8 + x * 16, 8 + y * 16, 'knight');
    this.playerSprite.anchor.set(0.5,0.5);

    this.camera.follow(this.playerSprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    this.worldLayer.add(this.playerSprite);
  }

  private prepareStateMachine() : void {
    this.sceneFSM = new FSM<DungeonScreen>(this);
    this.sceneFSM.register(TurnStates.PLAYER_CHOOSE_ACTION, new PlayerChooseActionState());
    this.sceneFSM.enter(TurnStates.PLAYER_CHOOSE_ACTION);
  }

  /**
  * Prepare map
  */
  private prepareMap() : void {
    this.map        = this.add.tilemap();
    this.map.setTileSize(TILE_SIZE, TILE_SIZE);
    this.map.addTilesetImage('dungeon-tileset');

    this.groundLayer = this.map.create('ground', 10, 10, TILE_SIZE, TILE_SIZE, this.worldLayer);
    this.map.setPreventRecalculate(true);

    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        this.map.putTile(19, x, y, this.groundLayer);

        if (x == 0 || y == 0 || x == 9 || y == 9  || (x == 3 && y < 5)) {
          this.map.putTile(0, x, y, this.groundLayer);
        }
      }
    }

    this.pathFinding.setGrid(this.map.layers[0].data, [19]);

    this.map.setPreventRecalculate(false);
    this.groundLayer.resizeWorld();
  }

  public update() : void {
    if (this.sceneFSM != null)
      this.sceneFSM.update(this.time.elapsedMS);
  }

  public shutdown() : void {
    this.game.plugins.remove(this.pathFinding);
  }

  private onTap(pointer : Phaser.Pointer, doubleTap : boolean) : void {
    console.log(this.groundLayer.getTileX(pointer.worldX) + "x" + this.groundLayer.getTileY(pointer.worldY));
    var targetPos : Phaser.Point = new Phaser.Point();
    this.groundLayer.getTileXY(pointer.worldX, pointer.worldY, targetPos);
    this.pathFinding.findPath(new Phaser.Point(1,1), targetPos).addOnce((path : Phaser.Point[]) => {
      if (path != null) {
        console.log("Found: ", path.length);

        this.add.tween(this.playerSprite).to({
          x: this.groundLayer.getTileX(pointer.worldX) * this.map.tileWidth + 8,
          y: this.groundLayer.getTileY(pointer.worldY) * this.map.tileHeight + 8
        }).start();
      }
    });
  }
}
