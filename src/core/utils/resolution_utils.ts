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
    const MAX_TILE_COUNT_FOR_SMALLES_SIDE : number = 12;
    const MAX_SIZE_USING_TILE_SIZE : number        = MAX_TILE_COUNT_FOR_SMALLES_SIDE * TILE_SIZE;


    let smallestSideScale : number                 = this.smallestSideSize / MAX_SIZE_USING_TILE_SIZE;
    this.scale                                     = smallestSideScale;
    this.canvas.width                              = Math.round(this.realLargestSideSize / smallestSideScale);
    this.canvas.height                             = Math.round(this.smallestSideSize / this.scale);


    //console.log("Canvas scale: ", smallestSideScale);
  //  console.log(`Canvas size ${largestSideSize}x${MAX_SIZE_USING_TILE_SIZE}`);

    //console.log(`Canvas size after scale ${largestSideSize * smallestSideScale }x${MAX_SIZE_USING_TILE_SIZE * smallestSideScale}`);
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
