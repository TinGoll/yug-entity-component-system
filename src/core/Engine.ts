import { EntityListener } from "../@interfaces/EntityListener";
import { SystemListener } from "../@interfaces/Systemlisteners";
import { Listener } from "../signals/Listener";
import { Signal } from "../signals/Signal";
import { ImmutableArray } from "../utils/ImmutableArray";
import { Component, ComponentClass } from "./Component";
import { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";
import { EntitySystem } from "./EntitySystem";
import { Family } from "./Family";
import { FamilyManager } from "./FamilyManager";
import { SystemManager } from "./SystemManager";

export class Engine extends Map<Entity, Entity> {
  private static instance?: Engine;

  private static empty: Family = Family.all().get();

  private readonly componentAdded: Listener<Entity> = new ComponentListener(this);
  private readonly componentRemoved: Listener<Entity> = new ComponentListener(this);
  private systemManager = new SystemManager(new EngineSystemListener(this));

  private entityManager: EntityManager = new EntityManager(new EngineEntityListener(this));

  private familyManager: FamilyManager = new FamilyManager(this.entityManager.getEntities());

  private updating: boolean = false;
  private notifying: boolean = false;

  // private entityListeners: Array<EntityListenerData> =
  //   new Array<EntityListenerData>();

  /**
   * Приватный Конструтор, используйте {@link Engine.create()}
   */
  constructor() {
    super();
    // Инициализация.
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
  createComponent<T extends Component>(componentClass: ComponentClass, ...args: any[]): T {
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

  /**
   * Добавляет {@link EntitySystem} в этот движок.
   * Если в Движке уже была система того же класса,
   * новый заменит старый.
   */
  public addSystem(system: EntitySystem): void {
    this.systemManager.addSystem(system);
  }

  /**
   * Удаляет {@link EntitySystem} из этого Engine.
   */
  public removeSystem(system: EntitySystem): void {
    this.systemManager.removeSystem(system);
  }

  /**
   * Удаляет все системы из этого двигателя.
   */
  public removeAllSystems(): void {
    this.systemManager.removeAllSystems();
  }

  /**
   * Быстрый поиск {@link EntitySystem}.
   */
  public getSystem<T extends EntitySystem>(systemType: any): T {
    return <T>this.systemManager.getSystem(systemType);
  }

  /**
   * @return неизменяемый массив всех систем сущностей, управляемых {@link Engine}.
   */
  public getSystems(): ImmutableArray<EntitySystem> {
    return this.systemManager.getSystems();
  }

  /**
   * Возвращает неизменяемую коллекцию сущностей для указанного {@link Family}.
   * Возвращает один и тот же экземпляр каждый раз для одного и того же семейства.
   */
  public getEntitiesFor(family: Family): ImmutableArray<Entity> {
    return this.familyManager.getEntitiesFor(family);
  }

  public addEntityListener(family: Family, priority: number, listener: EntityListener): void {
    this.familyManager.addEntityListener(family, priority, listener);
  }

  public removeEntityListener(listener: EntityListener) {
    this.familyManager.removeEntityListener(listener);
  }

  public update(deltaTime: number): void {
    if (this.updating) return;
    this.updating = true;
    const systems: ImmutableArray<EntitySystem> = this.systemManager.getSystems();
    try {
      for (let i = 0; i < systems.size(); ++i) {
        const system = systems.get(i);
        if (!system) continue;
        if (system.checkProcessing()) {
          system.update(deltaTime);
        }
      }
    } catch (e) {
    } finally {
      this.updating = false;
    }
  }

  public addEntityInternal(entity: Entity) {
    entity.componentAdded.add(this.componentAdded);
    entity.componentRemoved.add(this.componentRemoved);
    this.familyManager.updateFamilyMembership(entity);
  }

  public removeEntityInternal(entity: Entity) {
    this.familyManager.updateFamilyMembership(entity);
    entity.componentAdded.remove(this.componentAdded);
    entity.componentRemoved.remove(this.componentRemoved);
  }

  isUpdating() {
    return this.updating;
  }
  isNotifying() {
    return this.notifying;
  }

  getFamilyManager(): FamilyManager {
    return this.familyManager;
  }

  /**
   * Возвращает instance класса {@link Engine}.
   * Eсли экземпляр движка был создан ранее, возвращается этот экземпляр, в противном случае - создается новый.
   * @returns Engine
   */
  public static create() {
    /***************************** */
    /***************************** */
    // Эта реализация, позволяет иметь только один экземпляр движка.
    // Закомментировать, если нужно иметь много копий.

    // if (!Engine.instance) {
    //   Engine.instance = new Engine();
    // }
    // return Engine.instance;

    /***************************** */
    /***************************** */
    // Разкомментировать, если надо иметь много копий.

    return new Engine();
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
  constructor(private readonly engine: Engine) {}
  public receive(signal: Signal<Entity>, object: Entity) {
    this.engine.getFamilyManager().updateFamilyMembership(object);
  }
}

class EngineSystemListener implements SystemListener {
  constructor(private readonly engine: Engine) {}
  public systemAdded(system: EntitySystem) {
    system.addedToEngineInternal(this.engine);
  }

  public systemRemoved(system: EntitySystem) {
    system.removedFromEngineInternal(this.engine);
  }
}
