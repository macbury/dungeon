import { Point } from 'phaser';

/**
* Simple event model defining player action type
*/
export class IPlayerActionType {
  /**
  * Position on map where player should move. If null then no movement has been triggered;
  */
  destination : Point;

  public static isMovement(action : IPlayerActionType) : boolean {
    return action != null && action.destination != null;
  }

  /**
  * creates new player action for movement
  */
  public static performMoveTo(target : Point) : IPlayerActionType {
    return <IPlayerActionType>{ destination: target };
  }
}
