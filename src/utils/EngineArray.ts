import { Comparator } from "../@interfaces/Comparator";

export class EngineArray<T> extends Array<T> {
  constructor() {
    super();
  }
  public insert(index: number, item: T): void {
    this.splice(index, 0, item);
  }

  public removeIndex(index: number): void {
    this.splice(index, 1);
  }

  removeValue(item: T): boolean {
    const index = this.indexOf(item);
    if (index === -1) return false;
    this.removeIndex(index);
    return true;
  }

  first(): T | null {
    return this[0] || null;
  }

  sortItems (comparator: Comparator<T>) {
    return this.sort(comparator.compare);
  }
}