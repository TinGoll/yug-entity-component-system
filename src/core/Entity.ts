import { EngineObject } from "../@interfaces/EngineObject";
import { Signal } from "../signals/Signal";
import { convertToHashCode } from "../utils/HashCode";
import { ImmutableArray } from "../utils/ImmutableArray";
import { Component, ComponentClass } from "./Component";

export class Entity implements EngineObject {
  public key: string = "";
  /** Отправит событие при добавлении компонента. */
  public readonly componentAdded: Signal<Entity>;
  /** Будет отправлять событие при удалении компонента. */
  public readonly componentRemoved: Signal<Entity>;
  private components: Map<string, Component | null>;
  private immutableComponentsArray: ImmutableArray<Component>

  scheduledForRemoval: boolean = false;
  removing: boolean = false;
  componentsArray: Component[];
  constructor() {
    this.components = new Map<string, Component | null>();
    this.componentsArray = new Array<Component>;
    this.componentAdded = new Signal<Entity>();
    this.componentRemoved = new Signal<Entity>();
    this.immutableComponentsArray = new ImmutableArray<Component>(this.componentsArray);
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
  remove<T extends Component>(name: string): Component | null {
    const removeComponent = this.components.get(name);
    if (removeComponent && this.removeInternal(removeComponent)) {
      this.notifyComponentRemoved();
      return <T> removeComponent;
      
    }
    return null;
  }
  /**
   * Удаляет все комопненты.
   */
  removeAll(): void {
    while(this.componentsArray.length > 0) {
      this.remove(this.componentsArray[0]?.name);
    }
  }

  /**
   * Получить компонент
   * @param componentType класс компонента
   * @returns Объект {@link Component} для указанного класса, null, если
	 *         сущность не имеет компонентов для этого класса
   */
  getComponent(componentType: ComponentClass): Component | null {
      return this.components.get(componentType.name) || null;
  }

  /**
   * @returns неизменяемая коллекция со всеми компонентами {@link Component}
   */
  getComponents(): ImmutableArray<Component> {
    return this.immutableComponentsArray;
  }
  /**
   * 
   * @param componentType Класс комопнента
   * @returns Имеет ли сущность {@link Component} для указанного класса.
   */
  hasComponent(componentType: ComponentClass): boolean {
    return this.components.has(componentType.name)
  }

  private addInternal (component: Component): boolean {
    const name = component.name;
    const oldComponent = this.components.get(name);
    if (oldComponent === component) {
      return false;
    }
    if (oldComponent) {
      this.removeInternal(oldComponent);
    }
    this.components.set(name, component);
    this.componentsArray.push(component);
    return true;
  }

  removeInternal(component: Component): Component | null {
    const name = component.name;
    const removeComponent = this.components.get(name);
    if (removeComponent) {
      this.components.set(name, null);
      const index = this.componentsArray.indexOf(component);
      if (index !== -1) {
        this.componentsArray.splice(index, 1);
      }
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
