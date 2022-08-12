import { EntityListener } from "./@interfaces/EntityListener";
import { Component } from "./core/Component";
import { Engine } from "./core/Engine";
import { Entity } from "./core/Entity";
import { EntityManager } from "./core/EntityManager";
import { ImmutableArray } from "./utils/ImmutableArray";
import { IterableArray } from "./utils/IterableArray";

class TestListener implements EntityListener {
  entityAdded(entity: Entity): void {}
  entityRemoved(entity: Entity): void {}
}

const manager = new EntityManager(new TestListener());

manager.addEntity(new Entity());
manager.addEntity(new Entity());
manager.addEntity(new Entity());
manager.addEntity(new Entity());

manager.removeAllEntities();



class DComp extends Component {
  constructor() {
    super(DComp.name);
  }
  test: number = 1;
  test2: number = 5;
  test3: number = 8;
  test4: number[] = [5, 5, 6];
  entity = new Entity()
}


const engine = Engine.create();

const cmp = engine.createComponent(DComp);


console.log(cmp);




export {};
