/// <reference path="./defs/definitions.d.ts"/>
/**
* Load modules for Phaser
*/
import 'index.html';
import 'p2';
import 'pixi.js';
import * as Phaser from 'phaser';
/**
* Loading main game class
*/
import DungeonGame from './core/dungeon_game';
/**
* Bootstrap main game here
*/
document.body.onload = function() {
  var game           = new DungeonGame(document.body);
}
