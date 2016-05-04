import { GAME_WIDTH, GAME_HEIGHT } from '../consts';
/**
* Calculates aspect ratio for resolution
*/

const MAX_TILE_COUNT_ON_SCREEN : number = 20;

export default class ResolutionCalculator {
  private _width : number;
  private _height : number;
  private _ratio : number;

  constructor() {
    if (window.innerWidth > window.innerHeight){
      this._width  = GAME_HEIGHT;
      this._height = GAME_WIDTH;
      this._ratio  = window.innerWidth / window.innerHeight;
    } else {
      this._width  = GAME_WIDTH;
      this._height = GAME_HEIGHT;
      this._ratio  = window.innerHeight / window.innerWidth;
    }

    if (this._ratio < this._width / this._height){
      this._height = this._width / this._ratio;
    }
  }

  public get width() : number {
    return this._width;
  }

  public get height() : number {
    return this._height;
  }
}
