import { EngineObject } from "../@interfaces/EngineObject";
import { Signal } from "../signals/Signal";
import { Bits } from "../utils/Bits";
import { Handbag } from "../utils/Handbag";
import { convertToHashCode } from "../utils/HashCode";
import { ImmutableArray } from "../utils/ImmutableArray";
import { Component, ComponentClass } from "./Component";
import { ComponentType } from "./ComponentType";

export class Entity implements EngineObject {
  public id: number = 0;
  public key: string = "";
  public parentKey?: string;

  /** Отправит событие при добавлении компонента. */
  public readonly componentAdded: Signal<Entity>;
  /** Будет отправлять событие при удалении компонента. */
  public readonly componentRemoved: Signal<Entity>;

  private components: Handbag<Component>;
  private immutableComponentsArray: ImmutableArray<Component>

  private componentBits: Bits;
  private familyBits: Bits;
  public flags: number;

  scheduledForRemoval: boolean = false;
  removing: boolean = false;
  componentsArray: Component[];
  constructor() {
    this.components = new Handbag<Component>();
    this.componentsArray = new Array<Component>;

    this.immutableComponentsArray = new ImmutableArray<Component>(this.componentsArray);
    this.componentBits = new Bits();
    this.familyBits = new Bits();
		this.flags = 0;

    this.componentAdded = new Signal<Entity>();
    this.componentRemoved = new Signal<Entity>();
  }

  /**
	 * Добавляет {@link Component} в этот объект. Если {@link Component} того же
	 * типа уже существует, он будет заменен.
	 * @return Вернет {@link Entity} для простой цепочки
	 */
  add (component: Component): this {
    if (this.addInternal(component)) {
      this.notifyComponentAdded();
    }
    return this;
  }
/**
	 * Добавляет {@link Component} в этот объект. Если {@link Component} того же
	 * типа уже существует, он будет заменен.
	 * 
	 * @return Компонент для прямого управления компонентом (например,
	 *         Объединенный компонент)
	 */
  addAndReturn<T extends Component>(component: T): T {
    this.add(component);
    return component;
  }

/**
	 * Удаляет {@link Component} указанного типа. Поскольку существует только один
	 * компонент одного типа, нам не нужена
	 * ссылка на экземпляр.
	 * 
	 * @return Удаленный {@link Component} или null, если объект не содержит
	 *         такой компонент.
	 */
  remove<T extends Component>(componentClass: ComponentClass): Component | null {
    const componentType = ComponentType.getFor(componentClass);
    const componentTypeIndex = componentType.getIndex();
    if(this.components.isIndexWithinBounds(componentTypeIndex)) {
      const removeComponent = this.components.get(componentTypeIndex);
      if (removeComponent && this.removeInternal(componentClass)) {
				this.notifyComponentRemoved();
        return <T> removeComponent;
			}
    }
    return null;
  }
  /**
   * Удаляет все комопненты.
   */
  removeAll(): void {
    while(this.componentsArray.length > 0) {
      this.remove(this.componentsArray[0]?.getClass());
    }
  }

  /**
   * Получить компонент
   * @param componentType класс компонента
   * @returns Объект {@link Component} для указанного класса, null, если
	 *         сущность не имеет компонентов для этого класса
   */

  getComponent<T extends Component>(component: ComponentType): T | null
  getComponent<T extends Component>(component: ComponentClass): T | null
  getComponent<T extends Component>(component: ComponentClass | ComponentType): T | null {
    let componentType: ComponentType;
    if (typeof component === "function") {
      componentType = ComponentType.getFor(component);
    }else{
      componentType = component;
    }
    const componentTypeIndex = componentType.getIndex();
		if (componentTypeIndex < this.components.getCapacity()) {
			return <T> this.components.get(componentType.getIndex());
		} else {
			return null;
		}
  }

  /**
   * @returns неизменяемая коллекция со всеми компонентами {@link Component}
   */
  getComponents(): ImmutableArray<Component> {
    return this.immutableComponentsArray;
  }
  
  // hasComponent(componentType: ComponentClass): boolean {
  //   return this.components.has(componentType.name)
  // }

  /**
   * @param componentType Класс комопнента
   * @returns Имеет ли сущность {@link Component} для указанного класса.
   */
  hasComponent (componentType: ComponentType): boolean {
		return this.componentBits.get(componentType.getIndex());
	}

  /**
	 * @return Биты компонентов этого объекта, описывающие все {@link Component},
	 *         которые он содержит.
	 */
  getComponentBits(): Bits {
    return this.componentBits;
  }

  /**
	 * @return Биты {@link Family} этой сущности, описывающие все
	 *         {@link EntitySystem}, которыми она в настоящее время обрабатывается.
	 */
	getFamilyBits (): Bits {
		return this.familyBits;
	}



  private addInternal (component: Component): boolean {
   const componentClass = component.getClass();
    const oldComponent = this.getComponent(componentClass);
    if (oldComponent === component) {
      return false;
    }
    if (oldComponent) {
      this.removeInternal(componentClass);
    }
    const componentTypeIndex = ComponentType.getIndexFor(componentClass);
    this.components.set(componentTypeIndex, component);
    this.componentsArray.push(component);
    this.componentBits.set(componentTypeIndex);
    return true;
  }

  removeInternal(componentClass: ComponentClass): Component | null {
    const componentType = ComponentType.getFor(componentClass);
    const componentTypeIndex = componentType.getIndex();
    const removeComponent = this.components.get(componentTypeIndex);
    if (removeComponent) {
      this.components.set(componentTypeIndex, null);
      const index = this.componentsArray.indexOf(removeComponent);
      if (index !== -1) {
        this.componentsArray.splice(index, 1);
      }
      this.componentBits.clear(componentTypeIndex);
      return removeComponent;
    }
    return null;
  }

  notifyComponentAdded() {
    this.componentAdded.dispatch(this);
  }

  notifyComponentRemoved() {
		this.componentRemoved.dispatch(this);
	}

  isRemoving() : boolean {
    return this.removing;
  }

  isScheduledForRemoval(): boolean {
    return this.scheduledForRemoval;
  }

  toString(): string {
    return `
    ${Entity.name}
    ${this.componentsArray.map(c => c.toString())}`;
  }
  hashCode(): number {
    return convertToHashCode(this.toString());
  }
  equals(object: EngineObject): boolean {
    return this.hashCode() === object?.hashCode();
  }
}
