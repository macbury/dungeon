/// <reference path="./defs/definitions.d.ts"/>
import 'p2';
import 'pixi.js';
import * as Phaser from 'phaser';
import DungeonGame from './core/dungeon_game';

/**
* Bootstrap main game here
*/
document.body.onload = function() {
  var game_container = document.querySelector("#game-container");
  if (game_container === null)
    throw "Could not find #game-container div!!!!";
  var game           = new DungeonGame(320, 480, game_container);
}
