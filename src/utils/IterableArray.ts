import { EngineObject } from "../@interfaces/EngineObject";
import { convertToHashCode } from "./HashCode";

/**
 * Не готов.
 */
export class IterableArray<T extends EngineObject>
  implements Iterable<T>, EngineObject
{
  private readonly array: Map<T, T>;
  constructor(array?: Iterable<T>) {
    if (!array) {
        this.array = new Map<T, T>();
    } else {
      const itt = Array.from(
        [...array],
        (item) => <readonly [T, T]>[item, item]
      );
      this.array = new Map(itt);
    }
  }
  hashCode(): number {
    return convertToHashCode(this.toString());
  }
  equals(object: EngineObject): boolean {
    return this.hashCode() === object?.hashCode();
  }

  toString(): string {
    return `${IterableArray.name}: 
    values: ${[...this.array.entries()].map((e) => [
      e[0]?.toString(),
      e[1]?.toString(),
    ])}`;
  }

  /**
   * Получить элемент массива по индексу.
   * @param index - номер индекса с 0.
   * @returns Элемент массива.
   */
  get(index: number): T | null {
    const key: T | undefined = [...this.array.keys()][index];
    if (!key) return null;
    return this.array.get(key!) || null;
  }
  /**
   * удаляет последний элемент из массива и возвращает его значение.
   */
  pop(): T | null {
    const item = this.get(this.size() - 1);
    if (!item) return null;
    this.array.delete(item);
    return item;
  }
  /**
   * Метод push() добавляет один или более элементов в конец массива и возвращает новую длину массива.
   * @param items размер массива
   */
  push(...items: T[]): number {
    for (const item of items) {
      this.array.set(item, item);
    }
    return this.size();
  }

  /**
   * Метод indexOf() возвращает первый индекс, по которому данный элемент может быть найден в массиве или -1, если такого индекса нет.
   * @param searchElement Искомый элемент в массиве.
   */
  indexOf(searchElement: T): number {
    let index = -1;
    const tempArr = [...this.array.entries()];
    for (let i = 0; i < this.array.size; i++) {
      const item = tempArr[i];
      if (item[1]?.equals(searchElement)) {
        index = i;
        break;
      }
    }
    return index;
  }
  /**
   * Метод lastIndexOf() возвращает индекс последнего вхождения указанного значения в строковый объект String,
   * на котором он был вызван, или -1, если ничего не было найдено.
   * @param searchElement Строка, представляющая искомое значение.
   * @returns number.
   */
  lastIndexOf(searchElement: T): number {
    let index = -1;
    const tempArr = [...this.array.entries()];
    for (let i = 0; i < this.array.size; i++) {
      const item = tempArr[i];
      if (item[1]?.equals(searchElement)) {
        index = i;
      }
    }
    return index;
  }
  /**
   * Метод forEach() выполняет указанную функцию один раз для каждого элемента в массиве.
   * currentValue Текущий обрабатываемый элемент в массиве.
   * index Необязательный Индекс текущего обрабатываемого элемента в массиве.
   * array Необязательный Массив, по которому осуществляется проход.
   * @param callbackfn Функция, которая будет вызвана для каждого элемента массива. Она принимает от одного до трёх аргументов:
   */
  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
    const tempArray = [...this.array.values()];
    for (let i = 0; i < tempArray.length; i++) {
      callbackfn(tempArray[i], i, tempArray);
    }
  }

  entries(): IterableIterator<[T, T]> {
    return this.array.entries();
  }

  keys(): IterableIterator<T> {
    return this.array.keys();
  }

  values(): IterableIterator<T> {
    return this.array.values();
  }

  size(): number {
    return this.array.size;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.array.values();
  }

  // [n: number]: T;
}
