export class Handbag<E> {
  private data: Array<E | null>;
  private _size: number = 0;

  constructor(capacity?: number) {
    if (capacity) {
      this.data = Array.from(Array<E>(capacity), () => null);
    } else {
      this.data = new Array<E | null>();
    }
  }

  /**
   * Удаляет элемент в указанной позиции в этой сумке. Порядок элементов не сохраняется.
   * @return, удаленный елемент.
   */

  remove(index: number): E | null {
    const e: E | null = this.data[index] || null; // Копируем елемент, что бы вернуть.
    this.data[index] = this.data[--this._size]; // перезаписать удаляемый элемент последним элементом
    this.data[this._size] = null; //  последний null
    return e;
  }

  /**
   * Удаляет первое вхождение указанного элемента из сумки, если он присутствует. не сохраняет порядок элементов.
   * @return true, если элемент был удален.
   */
  removeByItem(e: E): boolean {
    for (let i = 0; i < this._size; i++) {
      const e2 = this.data[i];
      if (e === e2) {
        this.data[i] = this.data[--this._size]; // перезаписать удаляемый элемент последним элементом
        this.data[this._size] = null; // null последний элемент
        return true;
      }
    }
    return false;
  }

  /**
   * Проверьте, есть ли в сумке этот элемент. Оператор === используется для
   * проверки на равенство.
   */
  public contains(e: E): boolean {
    for (let i = 0; this._size > i; i++) {
      if (e == this.data[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * @return элемент в указанной позиции в Сумке.
   */
  public get(index: number): E | null {
    return this.data[index] || null;
  }

  /**
   * @return количество элементов в этой сумке.
   */
  public size(): number {
    return this._size;
  }

  /**
   * @return количество элементов, которые сумка может вместить без увеличения.
   */
  public getCapacity(): number {
    return this.data.length;
  }

  /**
   * @param index
   * @return находится ли индекс в пределах коллекции
   */
  public isIndexWithinBounds(index: number): boolean {
    return index < this.getCapacity();
  }

  /**
   * @return true если сумка пуста
   */
  public isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Добавляет указанный элемент в конец этого пакета. при необходимости также увеличивает вместимость сумки
   */
  public add(e: E | null): void {
    // is size greater than capacity increase capacity
    if (this._size === this.data.length) {
      this.grow();
    }
    this.data[this._size++] = e;
  }

  /**
	 * Установить элемент по указанному индексу в сумке.
	 */
	public set (index: number, e: E|null): void {
		if (index >= this.data.length) {
			this.grow(index * 2);
		}
		this._size = Math.max(this._size, index + 1);
		this.data[index] = e;
	}

  private grow(capacity?: number): void {
    const newCapacity = capacity || Math.floor((this.data.length * 3) / 2 + 1);
    const oldData: Array<E | null> = this.data;
    this.data = Array.from(
      Array<E>(newCapacity),
      (v, k) => this.data[k] || null
    );
  }


  /**
   *  * Убирает и возвращает последний предмет в сумке.
   * @returns последний предмет в сумке, null, если она пуста.
   */
  public removeLast(): E | null {
    if (this._size > 0) {
      const e: E | null = this.data[--this._size];
      this.data[this._size] = null;
      return e;
    }
    return null;
  }
}
