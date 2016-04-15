import { GAME_WIDTH, GAME_HEIGHT } from '../consts';
/**
* Calculates aspect ratio for resolution
*/
export default class ResolutionCalculator {
  private _width : number;
  private _height : number;
  private _ratio : number;
  constructor() {
    this._width  = GAME_WIDTH;
    this._height = GAME_HEIGHT;
    this._ratio  = window.innerWidth / window.innerHeight;
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
