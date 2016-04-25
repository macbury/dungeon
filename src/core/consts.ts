
/**
* Default game scale used for rendering map
*/
export const DESKTOP_SCALE   : number = 2;
export const MOBILE_SCALE   :  number = 2;

export const GAME_WIDTH     : number  = 160;
export const GAME_HEIGHT    : number  = 240;

/**
* Size in pixels how big is each tile on screen
*/
export const TILE_SIZE       : number = 16;
/**
* Tile center position that equals TILE_SIZE / 2
*/
export const TILE_CENTER     : number = TILE_SIZE / 2;

/**
* How much time it takes player to move over one tile
*/
export const PLAYER_MOVE_SPEED : number = 150;

/**
* How much time it should take to animate showing and hiding cursor
*/
export const CURSOR_ANIMATION_SPEED : number = 250;

/**
* Speed of player and monster objects
*/
export const GAME_OBJECT_FRAME_RATE : number = 4;

export const UP : Phaser.Point    = new Phaser.Point(0, -1);
export const DOWN : Phaser.Point  = new Phaser.Point(0, 1);
export const LEFT : Phaser.Point  = new Phaser.Point(1, 0);
export const RIGHT : Phaser.Point = new Phaser.Point(-1, 0);

export const MOVE_ARRAY : Array<Phaser.Point> = [UP, DOWN, LEFT, RIGHT];
