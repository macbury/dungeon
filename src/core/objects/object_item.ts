import GameObject from './game_object';

/**
* Objects that are inserted in ObjectsGrid like chests, dropped items or plants
*/
abstract class ObjectItem extends GameObject {
  /**
  * Sets character virtual position. Addtionaly it updates character grid
  */
  public setVirtualPosition(x : number, y : number) {
    this.env.objects.set(this.virtualPosition.x, this.virtualPosition.y, null);
    this.virtualPosition.set(x, y);
    this.env.objects.set(this.virtualPosition.x, this.virtualPosition.y, this);
  }

  public setTilePosition(x : number, y : number) {
    this.env.objects.set(this.virtualPosition.x, this.virtualPosition.y, null);
    super.setTilePosition(x,y);
    this.env.objects.set(this.virtualPosition.x, this.virtualPosition.y, this);

  }
}

export default ObjectItem;
