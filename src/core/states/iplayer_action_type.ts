import { Point } from 'phaser';

/**
* Simple event model defining player action type
*/
export class IPlayerActionType {
  /**
  * Position on map where player should move. If null then no movement has been triggered;
  */
  destination : Point;
  pick: boolean;
  attackTarget: Point;

  public static isMovement(action : IPlayerActionType) : boolean {
    return action != null && action.destination != null;
  }

  public static isAttack(action : IPlayerActionType) : boolean {
    return action != null && action.attackTarget != null;
  }

  public static isPicking(action : IPlayerActionType) : boolean {

    return action != null && action.pick == true;
  }

  /**
  * creates new player action for movement
  */
  public static performMoveTo(target : Point) : IPlayerActionType {
    return <IPlayerActionType>{ destination: target };
  }

  /**
  * creates new player action for picking items below
  */
  public static pick() : IPlayerActionType {
    return <IPlayerActionType>{ pick: true };
  }

  /**
  * Creates action to attack at tile
  */
  public static performMeleeAttack(target : Point) : IPlayerActionType {
    return <IPlayerActionType>{ attackTarget: target };
  }
}
