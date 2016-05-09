/**
* Size in pixels how big is each tile on screen
*/
export const TILE_SIZE       : number = 32;

export const GAME_SIZE      : number  = 19 * TILE_SIZE;
export const GAME_WIDTH     : number  = GAME_SIZE;
export const GAME_HEIGHT    : number  = 10 * TILE_SIZE;


/**
* Tile center position that equals TILE_SIZE / 2
*/
export const TILE_CENTER     : number = TILE_SIZE / 2;

/**
* How much time it takes player to move over one tile
*/
export const PLAYER_MOVE_SPEED : number = 150;
/**
* How much time it takes to animate quick attack
*/
export const QUICK_ATTACK_SPEED : number = 100;

/**
* How much time it should take to animate showing and hiding cursor
*/
export const CURSOR_ANIMATION_SPEED : number = 150;

/**
* Speed of player and monster objects
*/
export const GAME_OBJECT_FRAME_RATE : number = 4;

export const UP : Phaser.Point    = new Phaser.Point(0, -1);
export const DOWN : Phaser.Point  = new Phaser.Point(0, 1);
export const LEFT : Phaser.Point  = new Phaser.Point(1, 0);
export const RIGHT : Phaser.Point = new Phaser.Point(-1, 0);
export const ZERO : Phaser.Point = new Phaser.Point(0, 0);

export const MOVE_ARRAY : Array<Phaser.Point> = [UP, DOWN, LEFT, RIGHT];
export const AROUND  : Array<Phaser.Point> = [ZERO, UP, DOWN, LEFT, RIGHT];

/**
* Z index values for each layer
*/
export const LAYERS = {
  LEVEL: 1,
  GAME_OBJECTS: 2,
  ANIMATIONS_EFFECTS: 3,
  UI: 4
}

export const NARRATOR_BOX_HEIGHT      = 68;
export const NARRATOR_TEXT_COLOR_INFO   = '#FFFFFF';
export const NARRATOR_TEXT_COLOR_DANGER = '#FF5722';
export const NARRATOR_TEXT_STYLE_INFO = { font: "10px MainFont", fill: '#fff', stroke: '#000', strokeThickness: 2 };

export const STATUS_TEXT_STYLE = { font: "10px MainFont", fill: '#FF5722', stroke: '#000', strokeThickness: 2, align: "center" };
