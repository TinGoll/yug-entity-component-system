import { EntityListener } from "./@interfaces/EntityListener";
import { Component, ComponentClass } from "./core/Component";
import { Engine } from "./core/Engine";
import { Entity } from "./core/Entity";
import { Family } from "./core/Family";
import { Bits } from "./utils/Bits";

class TestListener implements EntityListener {
  entityAdded(entity: Entity): void {
    //console.log('entityAdded', 'entity');
    
  }
  entityRemoved(entity: Entity): void {
    //console.log("entityRemoved", 'entity');
  }
}

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
class DComp1 extends Component {
  constructor() {
    super(DComp1.name);
  }
  test_2_: number = 1;
  test_2_2: number = 5;
  test_2_3: number = 8;
  test_2_4: number[] = [5, 5, 6];
  entity = new Entity();
}
class DComp2 extends Component {
  constructor() {
    super(DComp2.name);
  }
  test_3_: number = 1;
  test_3_1: number = 5;
  test_3_2: number = 8;
  test_3_3: number[] = [5, 5, 6];
  entity = new Entity();
}


const engine = Engine.create();
engine.addEntityListener(new TestListener());

const cmp = engine.createComponent(DComp);

const entity = engine.createEntity();

entity.add(cmp);

engine.addEntity(entity)

const arr = engine.getEntities();

const famely = Family.all(DComp, DComp1).exclude(DComp2, DComp);

console.log(famely);




// function convertToBinary1(number: number) {
//   let num = number;
//   let binary = (num % 2).toString();
//   for (; num > 1; ) {
//     num = parseInt((<any>(num / 2)) as string);
//     binary = (num % 2) + binary;
//   }
//   return parseInt(binary);
// }

// let v = 6;

// console.log(parseInt(v.toString(2)));

// convertToBinary1(v);

// const a: number = 0x3f;

// console.log(a);



// console.time("my Function");

// for (let i = 0; i < 1000000; i++) {
//   const bts = convertToBinary1(i);
// }
// console.timeEnd("my Function");

// console.time("to String");

// for (let i = 0; i < 1000000; i++) {
//   const bts = parseInt(i.toString(2));
// }
// console.timeEnd("to String");

export {};
