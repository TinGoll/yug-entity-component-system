import { EngineObject } from "../@interfaces/EngineObject";
import { convertToHashCode } from "../utils/HashCode";

//export type ComponentClass = typeof Component;
export type ComponentClass = new (...args: any[]) => Component;

export abstract class Component implements EngineObject {
  public name: string;
  constructor(private readonly _componentClass: ComponentClass) {
    this.name = _componentClass.name;
  }
  
  getClass(): ComponentClass {
    return this._componentClass;
  }

  toString(): string {
    let str: string = `${this.name}`;
    for (const fildKey in this) {
      const key = <keyof this>fildKey;
      str += `
            ${key as Symbol}: ${(<any>this[key])?.toString() || this[key]}`;
    }
    return str;
  }
  hashCode(): number {
    return convertToHashCode(this.toString());
  }
  equals(object: EngineObject): boolean {
    return this.hashCode() === object?.hashCode();
  }
}
