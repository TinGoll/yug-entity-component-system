import { Component, ComponentClass } from "./core/Component";
import { Engine } from "./core/Engine";
import { Entity } from "./core/Entity";
import { EntitySystem } from "./core/EntitySystem";
import { Family } from "./core/Family";
import { BaseSystem } from "./systems/BaseSystem";
import { IteratingSystem } from "./systems/IteratingSystem";
import { ImmutableArray } from "./utils/ImmutableArray";

export default Engine.create;
export {
  Engine,
  Entity,
  Component,
  EntitySystem,
  Family,
  IteratingSystem,
  ComponentClass,
  BaseSystem,
  ImmutableArray,
};
