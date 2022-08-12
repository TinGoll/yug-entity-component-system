export interface EngineIterable<T> extends Iterable<T> {
  /**
   * Перебор всех элементов объекта.
   * @param callback
   */
  forEach(callback: (item: T) => void): void;

}