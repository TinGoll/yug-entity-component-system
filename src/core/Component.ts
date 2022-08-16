import { EngineObject } from "../@interfaces/EngineObject";
import { convertToHashCode } from "../utils/HashCode";

export type ComponentClass = typeof Component;

export abstract class Component implements EngineObject {
  constructor(readonly name: string) {}
  
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
