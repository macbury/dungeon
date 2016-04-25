import { Point } from 'phaser';

/**
* Simple model defining player action type
*/
export default interface IPlayerActionType {
  /**
  * Position on map where player should move. If null then no movement has been triggered;
  */
  destination : Point;
}
