/// <reference path="./defs/definitions.d.ts"/>
/**
* Load modules for Phaser
*/
import 'index.html';
import 'p2';
import 'pixi.js';
import * as Phaser from 'phaser';
require('./style.scss');

/**
* Loading main game class
*/
import DungeonGame from './core/dungeon_game';
window['DungeonGame'] = DungeonGame;
