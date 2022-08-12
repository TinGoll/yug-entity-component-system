import { EngineIterable } from "../@interfaces/EngineIterable";
import { EngineObject } from "../@interfaces/EngineObject";
import { convertToHashCode } from "./HashCode";


export class ImmutableArray<T extends EngineObject>
  implements EngineIterable<T>, EngineObject
{
  private index: number = 0;
  constructor(private readonly array: Array<T>) {}

  public size(): number {
    return this.array.length;
  }

  public get(index: number): T | null {
    return this.array[index] || null;
  }

  /**
   * Возвращает индекс последнего вхождения заданного значения в массив или -1, если оно отсутствует.
    @param searchElement — Значение, которое нужно найти в массиве.
    @param fromIndex — Индекс массива, с которого начинается поиск в обратном направлении. Если параметр fromIndex опущен, поиск начинается с последнего индекса в массиве.
   */
  public lastIndexOf(searchElement: T, fromIndex?: number): number {
    return this.array.lastIndexOf(searchElement, fromIndex);
  }

  /**
   *
   * @param value
   * @param identity Если true, будет использоваться сравнение ===. Если false, будет использоваться сравнение .equals().
   * (.equals() - не реализован, удалить после реализации)
   */
  public contains(value: T, identity: boolean = true): boolean {
    return this.array.includes(value);
  }

  /**
   *
   * Возвращает индекс первого вхождения значения в массив или -1, если оно отсутствует.
   * @param searchElement — Значение, которое нужно найти в массиве.
   * @param fromIndex — Индекс массива, с которого начинается поиск. Если параметр fromIndex опущен, поиск начинается с индекса 0.
   * @returns
   */
  public indexOf(searchElement: T, fromIndex?: number): number {
    return this.array.indexOf(searchElement, fromIndex);
  }

  public forEach(callback: (item: T) => void): void {
    this.array.forEach((item) => callback(item));
  }

  /**
   * Получить первый элемент коллекции.
   * @returns
   */
  public peek(): T {
    return this.array.values().next().value;
  }
  /**
   * Получить последний элемент коллекции
   * @returns
   */
  public first(): T {
    return this.array[this.array.length - 1];
  }

  /**
   * Получить случайный элмент коллекции.
   * @returns
   */
  public random(): T {
    return this.array[Math.floor(Math.random() * this.array.length - 1)];
  }
  /**
   * Получить нативный массив обектов {@link T}
   * @returns
   */
  public toArray(): T[] {
    return [...this];
  }

  toString(): string {
    // ${ImmutableArray.toString()} измененено на ImmutableArray.name
    // Для увеличения производительности.
    return `
    ${ImmutableArray.name}:
    values: ${this.array.map((item) => item.toString())}
    index: ${this.index}
    `;
  }

  hashCode(): number {
    return convertToHashCode(this.toString());
  }
  equals(object: EngineObject): boolean {
    return object?.hashCode() === this.hashCode();
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.array.values();
  }
}
