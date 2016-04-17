import { Plugin, Game } from 'phaser';
var EasyStar = require("easystarjs");
console.log(EasyStar);

export default class PathFinderPlugin extends Plugin {
  /**
 * Constructor.
 *
 * @param parent
 * @constructor
 */
  constructor(game : Game, parent : PIXI.DisplayObject) {
    super(game, parent);
  }
}
