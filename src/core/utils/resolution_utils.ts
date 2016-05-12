import { TILE_SIZE } from '../consts';

export default class ResolutionUtils {
  public scale : number;
  public canvas : {
    width: number,
    height: number
  };

  constructor() {
    this.canvas = { width: 0, height: 0 };
    this.recalculate();
  }

  /**
  * Recalculate game size and etc
  */
  public recalculate() : void {
    const MAX_SIZE_USING_TILE_SIZE : number        = this.tileCountForSmallSide * TILE_SIZE;

    let smallestSideScale : number                 = this.smallestSideSize / MAX_SIZE_USING_TILE_SIZE;

    this.scale                                     = smallestSideScale;
    this.canvas.width                              = Math.round(this.realLargestSideSize / smallestSideScale);
    this.canvas.height                             = Math.round(this.smallestSideSize / this.scale);
  }

  public get tileCountForSmallSide() {
    let currentTileCount : number = Math.round(this.smallestSideSize / TILE_SIZE);
    switch(Math.round(window.devicePixelRatio)) {
      case 1:
        return 10;
      default:
        return Math.max(currentTileCount, 8);
    }
  }

  public get maxCanvasSize() : number {
    return Math.max(this.canvas.width, this.canvas.height);
  }

  private get smallestSideSize() : number {
    return Math.min(window.innerWidth, window.innerHeight);
  }

  private get realLargestSideSize() : number {
    return Math.max(window.innerWidth, window.innerHeight);
  }
}
