import { EngineObject } from "../@interfaces/EngineObject";
import { Bits } from "../utils/Bits";
import { ComponentClass } from "./Component";
import { ComponentType } from "./ComponentType";
import { Entity } from "./Entity";

// Singleton Builder

class Builder {
  private static instance: Builder;

  private _all: Bits = Family.zeroBits;
  private _one: Bits = Family.zeroBits;
  private _exclude: Bits = Family.zeroBits;

  constructor() {
    if (Builder.instance) {
      return Builder.instance;
    }
    Builder.instance = this;
  }

  public reset(): Builder {
    this._all = Family.zeroBits;
    this._one = Family.zeroBits;
    this._exclude = Family.zeroBits;
    return this;
  }
  public all(...componentTypes: ComponentClass[]): Builder {
    this._all = ComponentType.getBitsFor(...componentTypes);
    return this;
  }
  public one(...componentTypes: ComponentClass[]): Builder {
    this._one = ComponentType.getBitsFor(...componentTypes);
    return this;
  }
  public exclude(...componentTypes: ComponentClass[]): Builder {
    this._exclude = ComponentType.getBitsFor(...componentTypes);
    return this;
  }
  public get(): Family {
    return Family.create(this._all, this._one, this._exclude);
  }
}

export class Family {
  private static families: Map<string, Family> = new Map<string, Family>();
  private static builder: Builder = new Builder();
  public static zeroBits: Bits = new Bits();
  private static familyIndex: number = 0;

  private index: number;

  protected constructor(
    private readonly all: Bits,
    private readonly one: Bits,
    private readonly exclude: Bits
  ) {
    this.index = Family.familyIndex++;
  }

  /** @return Соответствует ли объект семейным требованиям или нет */
  matches(entity: Entity): boolean {
    return false;
  }
  /** Возвращает hash code  в числовом формате */
  hashCode(): number {
    return this.index;
  }

  /** Сравнивает объект семейства */
  equals(object: object) {
    return this === object;
  }

  getFamilyHash(): number {
    return this.hashCode(); // Переопределить на правельныйх Хеш
  }

  public static create(all: Bits, one: Bits, exclude: Bits) {
    return new Family(all, one, exclude);
  }

  /**
   * @param componentTypes сущности должны будут содержать все указанные компоненты.
   * @return Builder singleton для получения семейства
   */
  public static all(...componentTypes: ComponentClass[]) {
    return this.builder.reset().all(...componentTypes);
  }
  /**
   * @param componentTypes объекты должны содержать хотя бы один из указанных компонентов.
   * @return Builder singleton для получения семейства
   */
  public static one(...componentTypes: ComponentClass[]) {
    return this.builder.reset().one(...componentTypes);
  }
  /**
   * @param componentTypes объекты не могут содержать ни один из указанных компонентов.
   * @return Builder singleton для получения семейства
   */
  public static exclude(...componentTypes: ComponentClass[]) {
    return this.builder.reset().exclude(...componentTypes);
  }
}

// Static class
// export class Builder {
//   private constructor() {}
//   public static reset(): typeof Builder {
//     return Builder;
//   }
// }
