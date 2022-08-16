import { EntityListener } from "../@interfaces/EntityListener";
import { Listener } from "../signals/Listener";
import { Signal } from "../signals/Signal";
import { ImmutableArray } from "../utils/ImmutableArray";
import { Component, ComponentClass } from "./Component";
import { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";

export class Engine extends Map<Entity, Entity> {
  private static instance?: Engine;

  private updating: boolean = false;
  private notifying: boolean = false;

  private readonly componentAdded: Listener<Entity> = new ComponentListener();
  private readonly componentRemoved: Listener<Entity> = new ComponentListener();
  private entityListeners: Array<EntityListenerData> =
    new Array<EntityListenerData>();

  private entityManager: EntityManager = new EntityManager(
    new EngineEntityListener(this)
  );

  /**
   * Приватный Конструтор, используйте {@link Engine.create()}
   */
  private constructor() {
    super();
    // Инициализация.
  }

  public getEntitiesFor(): ImmutableArray<Entity> | null {
    return null;
  }

  /**
   * Создает новый объект Entity
   * @return объект {@link Entity}
   */
  createEntity(): Entity {
    return new Entity();
  }

  /**
   * Создает новый компонент {@link Component}. Чтобы использовать этот метод, ваши
   * компоненты должны иметь видимый конструктор без аргументов.
   * ```js
   * createComponent(MyComponent, arg1, arg2, ...args);
   * ```
   */
  createComponent<T extends Component>(
    componentClass: ComponentClass,
    ...args: any[]
  ): T {
    // @ts-ignore
    const instance = <T>new (<ComponentClass>componentClass)(...args);
    return instance;
  }

  /**
   * Добавляет сущность в этот движок.
   * Вызовет ошибку, если данный объект
   * уже был зарегистрирован в движке.
   */
  addEntity(entity: Entity): void {
    try {
      this.entityManager.addEntity(entity);
    } catch (error: unknown) {
      throw error;
    }
  }
  /**
   * Удаляет сущность из этого движка.
   */
  removeEntity(entity: Entity): void {
    this.entityManager.removeEntity(entity);
  }

  removeAllEntities(): void {
    this.entityManager.removeAllEntities();
  }
  /**
   * Возвращает {@link ImmutableArray} из {@link Entity}, которым управляет Engine
   * но не может использоваться для изменения состояния. Этот массив не
   * является неизменным в том смысле, что его содержимое не будет изменено, а в том смысле, что оно
   * лишь отражает состояние движка.
   *
   * Массив является неизменяемым в том смысле, что вы не можете изменить его содержимое.
   * через API класса {@link ImmutableArray}, но вместо этого "управляется" движком
   * Двигатель может добавлять или удалять элементы из массива, и это будет отражено в
   * этом массиве.
   *
   * Это важное примечание, если вы перебираете возвращаемые объекты в цикле.
   * и вызов операций
   * который может добавлять/удалять сущности из движка, как базовый итератор
   * этот массив будут отражать эти изменения.
   *
   * В возвращаемом массиве будут удалены сущности, если они будут удалены в движке,
   * но нет возможности вводить новые сущности через интерфейс массива,
   * или удалить  сущности из движка через интерфейс этого массива.
   *
   *
   * @return Неизменяемый массив сущностей, которые будут соответствовать
   * состоянию сущности в движке.
   */
  getEntities(): ImmutableArray<Entity> {
    return this.entityManager.getEntities();
  }

  public addEntityListener(
    listener: EntityListener,
    priority: number = 0
  ): void {
    let insertionIndex: number = 0;
    while (insertionIndex < this.entityListeners.length) {
      if (this.entityListeners[insertionIndex].priority <= priority) {
        insertionIndex++;
      } else {
        break;
      }
    }
    const entityListenerData: EntityListenerData = new EntityListenerData();
    entityListenerData.listener = listener;
    entityListenerData.priority = priority;
    this.entityListeners.splice(insertionIndex, 0, entityListenerData);
  }

  public removeEntityListener(listener: EntityListener) {
    for (let i = 0; i < this.entityListeners.length; i++) {
      const entityListenerData = this.entityListeners[i];
      if (entityListenerData.listener === listener) {
        this.entityListeners.splice(i, 1);
      }
    }
  }

  public removeEntityInternal(entity: Entity) {
    this.updateNotifying(entity, "entityRemoved");
    entity.componentAdded.remove(this.componentAdded);
    entity.componentRemoved.remove(this.componentRemoved);
  }
  public addEntityInternal(entity: Entity) {
    entity.componentAdded.add(this.componentAdded);
    entity.componentRemoved.add(this.componentRemoved);
    this.updateNotifying(entity, "entityAdded");
  }

  public update(): void {}
  private updateNotifying(
    entity: Entity,
    type: "entityAdded" | "entityRemoved"
  ) {
    this.notifying = true;
    try {
      if (type === "entityRemoved") {
        for (const entityListenerData of this.entityListeners) {
          entityListenerData.listener?.entityRemoved(entity);
        }
      }
      if (type === "entityAdded") {
        for (const entityListenerData of this.entityListeners) {
          entityListenerData.listener?.entityAdded(entity);
        }
      }
    } catch (e) {
    } finally {
      this.notifying = false;
    }
  }

  isUpdating() {
    return this.updating;
  }
  isNotifying() {
    return this.notifying;
  }

  /**
   * Возвращает instance класса {@link Engine}.
   * Eсли экземпляр движка был создан ранее, возвращается этот экземпляр, в противном случае - создается новый.
   * @returns Engine
   */
  public static create() {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }
    return Engine.instance;
  }
}

class EngineEntityListener implements EntityListener {
  constructor(private readonly engine: Engine) {}
  public entityAdded(entity: Entity): void {
    this.engine.addEntityInternal(entity);
  }
  public entityRemoved(entity: Entity): void {
    this.engine.removeEntityInternal(entity);
  }
}

class ComponentListener implements Listener<Entity> {
  public receive(signal: Signal<Entity>, object: Entity) {
    // familyManager.updateFamilyMembership(object);
  }
}

class EntityListenerData {
  public listener?: EntityListener;
  public priority: number = 0;
}
