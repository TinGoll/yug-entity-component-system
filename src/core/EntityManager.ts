import { Entity } from "./Entity";
import { EntityListener } from "../@interfaces/EntityListener";
import { ImmutableArray } from "../utils/ImmutableArray";

export class EntityManager<E extends Entity = Entity> {
  private entities: Array<E> = new Array<E>();
  private entitySet = new Map<E, E>();
  private immutableEntities = new ImmutableArray<E>(this.entities);
  private listener: EntityListener;

  constructor(listener: EntityListener) {
    this.listener = listener;
  }

  /**
   * Добавление новой сущности {@link Entity} в движок.
   * @param entity {@link Entity}
   */
  addEntity(entity: E): void {
    this.addEntityInternal(entity);
  }
  /**
   * Удаление сущности {@link Entity} из движка.
   * @param entity
   */
  removeEntity(entity: E): void {
    this.removeEntityInternal(entity);
  }
  /**
   * Удаление всех сущностей.
   */
  removeAllEntities(): void {
    while (this.immutableEntities.size() > 0) {
      this.removeEntity(this.immutableEntities.first());
    }
  }
  /**
   * Получить все сущности.
   */
  getEntities(): ImmutableArray<E> {
    return this.immutableEntities;
  }

  /**
   * Добавление нового объекта {@link Entity}. Выбрасывает ошибку, если объект уже зарегистрирован.
   * @param entity объект Сущности.
   */
  protected addEntityInternal(entity: E): void {
    if (this.entitySet.has(entity)) {
      throw new Error("Объект уже зарегистрирован ");
    }
    this.entities.push(entity);
    this.entitySet.set(entity, entity);
    this.listener.entityAdded(entity);
  }

  protected removeEntityInternal(entity: E) {
    const removed = this.entitySet.delete(entity);
    if (removed) {
      entity.scheduledForRemoval = false;
      entity.removing = true;
      const index = this.entities.indexOf(entity);
      if (index !== -1) {
        this.entities.splice(index, 1);
        this.listener.entityRemoved(entity);
      }
      entity.removing = false;
    }
  }
}
