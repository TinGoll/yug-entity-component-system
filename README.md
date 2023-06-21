# yug-entity-component-system

Hello! I'm Roman, a JavaScript developer, and yug-entity-component-system is an efficient library based on the Entity Component System (ECS) pattern for handling data.

## Features

- Flexible architecture for managing entities, components, and systems.
- Optimized algorithms for improved performance.
- Easy integration into your JavaScript projects.

## Installation

You can install yug-entity-component-system via npm:

```bash
npm install yug-entity-component-system

## Usage

To use yug-entity-component-system in your project, follow these steps:

Import the necessary classes from yug-entity-component-system:

```javascript
import { Entity, Component, IteratingSystem, Family, Engine } from 'yug-entity-component-system';

Define your custom context:


// Define your custom context
interface Context {}


// Define the default context value
const defaultContext: Context = {};

Create entities and components:


// Extend the Entity class if needed
class MyEntity extends Entity {}


// Create a component with no logic
class MyComponent extends Component {
  x: number = 0;
  y: number = 0;

  constructor() {
    super(MyComponent);
  }
}

Implement systems to process components:

// Create a complex system
class MySystem extends IteratingSystem {
  constructor() {
    // Require entities with MyComponent
    super(MySystem, Family.all(MyComponent).get());
  }

  // Process the component
  protected async processEntity(entity: Entity, deltaTime: number) {
    const cmp = entity.getComponent<MyComponent>(MyComponent)!;
    cmp.x = 2;
    cmp.y = 2 * 2;
  }
}

Set up and run the engine:

// Create the engine
const engine = new Engine<MyEntity, Context>(defaultContext);

// Add a number of entities
for (let i = 0; i < 10; i++) {
  const entity = new MyEntity();
  entity.add(new MyComponent());
  engine.addEntity(entity);
}

// Add the system
engine.addSystem(new MySystem());

// Start the update
engine.update(0);