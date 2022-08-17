import { Component } from "./core/Component";
import { Engine } from "./core/Engine";
import { Entity } from "./core/Entity";
import { EntitySystem } from "./core/EntitySystem";
import { Family } from "./core/Family";
import { IteratingSystem } from "./systems/IteratingSystem";
import { ImmutableArray } from "./utils/ImmutableArray";


class TestComponent1 extends Component {
  constructor() {
    super(TestComponent1);
  }
  test1_field1: number = 0;
  test1_field2: number = 0;
  test1_field3: number = 0;
}


class TestComponent2 extends Component {
  constructor() {
    super(TestComponent2);
  }
  test2_field1: number = 0;
  test2_field2: number = 0;
  test2_field3: number = 0;
}

class TestComponent3 extends Component {
  constructor() {
    super(TestComponent3);
  }
  test3_field1: number = 0;
  test3_field2: number = 0;
  test3_field3: number = 0;
}


class TestSystem1 extends EntitySystem {
  private entities?: ImmutableArray<Entity>;
  constructor() {
    super(TestSystem1);
  }

  addedToEngine(engine: Engine): void {
     this.entities = engine.getEntitiesFor(
       Family.all(TestComponent2, TestComponent1).exclude(TestComponent3).get()
     );
  }

  public update(deltaTime: number): void {
      for (const entity of this.entities!) {
        console.log(entity.flags);
      }
  }

}

class TestIteratingSystem extends IteratingSystem {
  constructor(famely: Family) {
    super(<any>TestIteratingSystem, famely);
  }
  protected processEntity(entity: Entity, deltaTime: number): void {
    console.log('IteratingSystem', entity.flags);
    
  }
}

// class TestSystem2 extends EntitySystem {
//   private entities?: ImmutableArray<Entity>;
//   constructor() {
//     super(TestSystem2);
//   }

//   addedToEngine(engine: Engine): void {
//     this.entities = engine.getEntitiesFor(
//       Family.one(TestComponent1).get()
//     );
//   }

//   public update(deltaTime: number): void {
//     for (const entity of this.entities!) {
//      // console.log(entity);
//     }
//   }
// }



const engine = Engine.create();

engine.addSystem(new TestSystem1());
engine.addSystem(new TestIteratingSystem(Family.all(TestComponent2).get()));


const ent1 = engine.createEntity();
const ent2 = engine.createEntity();
const ent3 = engine.createEntity();

ent1.flags = 1;
ent2.flags = 2;
ent3.flags = 3;

ent1.add(new TestComponent1());
ent2.add(new TestComponent2()).add(new TestComponent1());
ent3
  .add(new TestComponent3())
  .add(new TestComponent2())
  .add(new TestComponent1());

engine.addEntity(ent1);
engine.addEntity(ent2);
engine.addEntity(ent3);

engine.update(1);

export {};
