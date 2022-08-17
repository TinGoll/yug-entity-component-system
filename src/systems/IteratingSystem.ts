import { Engine } from "../core/Engine";
import { Entity } from "../core/Entity";
import { EntitySystem } from "../core/EntitySystem";
import { Family } from "../core/Family";
import { ImmutableArray } from "../utils/ImmutableArray";

export abstract class IteratingSystem extends EntitySystem {
  private entities: ImmutableArray<Entity> | null = null;

  constructor(
    sysClass: any,
    private readonly family: Family,
    priority?: number
  ) {
    super(<any>sysClass, priority);
  }

  addedToEngine(engine: Engine): void {
    this.entities = engine.getEntitiesFor(this.family);
  }

  public removedFromEngine(engine: Engine): void {
    this.entities = null; // Уничтожить массив сущностей.
  }
  /**
   * @returns семейство, которое использовалось для создания системы.
   */
  getFamily(): Family {
    return this.family;
  }
  /**
   * @return набор сущностей, обрабатываемых системой
   */
  getEntities(): ImmutableArray<Entity> | null {
    return this.entities;
  }

  public update(deltaTime: number): void {
    this.startProcessing();
    if (this.entities) {
      for (let i = 0; i < this.entities.size(); i++) {
        const entity = this.entities.get(i);
        if (entity) this.processEntity(entity, deltaTime);
      }
    }
    this.endProcessing();
  }

  /**
   * Этот метод вызывается для каждой сущности при каждом вызове обновления
   * EntitySystem. Переопределите это, чтобы реализовать
   * специальная обработка.
   *
   * @param entity    Текущая обрабатываемая сущность
   * @param deltaTime Разница во времени между последним и текущим кадром
   */
  protected abstract processEntity(entity: Entity, deltaTime: number): void;

  /**
   * Этот метод вызывается один раз при каждом вызове обновления EntitySystem до
   * начала обработки объекта. Переопределите этот метод, чтобы
   * реализовать ваши конкретные условия запуска.
   */
  startProcessing(): void {}
  /**
   * Этот метод вызывается один раз при каждом вызове обновления EntitySystem
   * после завершения обработки сущности. Переопределите этот метод, чтобы
   * реализуйте свои конкретные конечные условия.
   */
  endProcessing(): void {}
}
