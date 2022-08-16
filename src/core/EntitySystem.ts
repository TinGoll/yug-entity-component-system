import { EngineObject } from "../@interfaces/EngineObject";
import { convertToHashCode } from "../utils/HashCode";
import { Engine } from "./Engine";

export abstract class EntitySystem implements EngineObject {
  private processing: boolean = false;
  public priority: number;
  private engine: Engine | null = null;
  /**
   * Инициализирует EntitySystem с указанным приоритетом.
   * @param priority Приоритет для выполнения этой системы (ниже означает более высокий приоритет).
   */
  constructor(protected readonly name: string, priority: number = 0) {
    this.processing = true;
    this.priority = priority;
  }

  /**
   * Вызывается при добавлении этой EntitySystem в {@link Engine}.
   * @param engine {@link Engine}, в который была добавлена ​​эта система..
   */
  addedToEngine(engine: Engine) {}

  /**
   * Вызывается, когда эта EntitySystem удаляется из {@link Engine}.
   * @param engine {@link Engine}, из которого была удалена система.
   */
  public removedFromEngine(engine: Engine) {}

  /** @return Должна ли система обрабатываться. */
  public checkProcessing(): boolean {
    return this.processing;
  }

  /** Устанавливает, должна ли система обрабатываться {@link Engine}. */
  public setProcessing(processing: boolean): void {
    this.processing = processing;
  }

  /**
   * @return экземпляр двигателя, в котором зарегистрирована система.
   * Будет нулевым, если система не связана ни с одним экземпляром движка.
   */
  public getEngine(): Engine | null {
    return this.engine;
  }

  /**
   * Метод обновления вызывается каждый тик.
   * @param deltaTime Время, прошедшее с последнего кадра в секундах.
   */
  public update(deltaTime: number): void {}

  toString(): string {
    return `${this.name}`;
  }
  hashCode(): number {
    return convertToHashCode(this.toString());
  }
  equals(object: EngineObject): boolean {
    return this.hashCode() === object?.hashCode();
  }

  addedToEngineInternal(engine: Engine) {
    this.engine = engine;
    this.addedToEngine(engine);
  }

  removedFromEngineInternal(engine: Engine) {
    this.engine = null;
    this.removedFromEngine(engine);
  }
}
