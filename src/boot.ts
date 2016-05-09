/// <reference path="./defs/definitions.d.ts"/>
/**
* Load modules for Phaser
*/
require('./style.scss');
import 'index.html';
import 'p2';
import 'pixi.js';
import * as Phaser from 'phaser';


/**
* Loading main game class
*/
import DungeonGame from './core/dungeon_game';
window['DungeonGame'] = DungeonGame;
