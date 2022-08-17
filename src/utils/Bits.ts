import { EngineObject } from "../@interfaces/EngineObject";

export class Bits implements EngineObject {
  public bits: number[] = Array<number>(0);

  /** Создает набор битов, начальный размер которого nbits
   * @param nbits начальный размер набора битов */
  constructor(nbits?: number) {
    if (nbits) this.checkCapacity(nbits >>> 6);
  }
  /** Создает битовый набор из другого битового набора
   * @param bitsToCpy битовый набор для copy */
  public static copy(bitsToCpy: Bits): Bits {
    return new Bits(bitsToCpy.bits.length).setBits(bitsToCpy.bits);
  }
  /**
   * @param index индекс бита
   * @return установлен ли бит
   * @throws если индекс < 0 */
  public get(index: number): boolean {
    const word: number = index >>> 6;
    if (word >= this.bits.length) return false;
    return (this.bits[word] & (1 << (index & 0x3f))) != 0;
  }
  /** Возвращает бит по заданному индексу и очищает его за один раз.
   * @param index индекс бита
   * @return, если бит был установлен до вызова
   * @throws если индекс < 0 */
  getAndClear(index: number): boolean {
    const word: number = index >>> 6;
    if (word >= this.bits.length) return false;
    const oldBits: number = this.bits[word];
    this.bits[word] &= ~(1 << (index & 0x3f));
    return this.bits[word] != oldBits;
  }
  /** Возвращает бит по заданному индексу и устанавливает его за один раз.
   * @param index индекс бита
   * @return, если бит был установлен до вызова
   * @throws  если индекс < 0 */
  getAndSet(index: number): boolean {
    const word: number = index >>> 6;
    this.checkCapacity(word);
    const oldBits: number = this.bits[word];
    this.bits[word] |= 1 << (index & 0x3f);
    return this.bits[word] == oldBits;
  }
  /**
   * @param index индекс устанавливаемого бита
   * @throws если индекс < 0 */
  set(index: number): void {
    const word: number = index >>> 6;
    this.checkCapacity(word);
    this.bits[word] |= 1 << (index & 0x3f);
  }
  /** @param index индекс переворачиваемого бита */
  flip(index: number) {
    const word: number = index >>> 6;
    this.checkCapacity(word);
    this.bits[word] ^= 1 << (index & 0x3f);
  }

  clear(index?: number): void {
    if (typeof index === "undefined") {
      Array.from(this.bits, () => 0);
    } else {
      const word: number = index >>> 6;
      if (word >= this.bits.length) return;
      this.bits[word] &= ~(1 << (index & 0x3f));
    }
  }
  /** @return число битов, хранящихся в настоящее время, <b>не</b> самый высокий установленный бит! */
  public numBits(): number {
    return this.bits.length << 6;
  }

  /**
   * Возвращает «логический размер» этого набора битов: индекс старшего установленного бита в наборе битов плюс один. Возвращает ноль, если
   * набор битов не содержит установленных битов.
   *
   * @вернуть логический размер этого набора битов */
  public length(): number {
    const bits: number[] = this.bits;
    for (let word: number = bits.length - 1; word >= 0; --word) {
      const bitsAtWord = bits[word];
      if (bitsAtWord != 0) {
        for (let bit: number = 63; bit >= 0; --bit) {
          if ((bitsAtWord & (1 << (bit & 0x3f))) != 0) {
            return (word << 6) + bit + 1;
          }
        }
      }
    }
    return 0;
  }

  /** @return true, если этот набор битов содержит хотя бы один бит, установленный в true */
  public notEmpty(): boolean {
    return !this.isEmpty();
  }

  /** @return true, если этот набор битов не содержит битов, для которых установлено значение true */
  public isEmpty(): boolean {
    const bits = this.bits;
    const length = bits.length;
    for (let i = 0; i < length; i++) {
      if (bits[i] != 0) {
        return false;
      }
    }
    return true;
  }

  /** Возвращает индекс первого бита, для которого установлено значение true, который встречается в указанном начальном индексе или после него. Если нет такого бита
   * существует, то возвращается -1. */
  public nextSetBit(fromIndex: number): number {
    const bits = this.bits;
    let word = fromIndex >>> 6;
    const bitsLength = bits.length;
    if (word >= bitsLength) return -1;
    let bitsAtWord = bits[word];
    if (bitsAtWord != 0) {
      for (let i = fromIndex & 0x3f; i < 64; i++) {
        if ((bitsAtWord & (1 << (i & 0x3f))) != 0) {
          return (word << 6) + i;
        }
      }
    }
    for (word++; word < bitsLength; word++) {
      if (word != 0) {
        bitsAtWord = bits[word];
        if (bitsAtWord != 0) {
          for (let i = 0; i < 64; i++) {
            if ((bitsAtWord & (1 << (i & 0x3f))) != 0) {
              return (word << 6) + i;
            }
          }
        }
      }
    }
    return -1;
  }

  /** Возвращает индекс первого бита, для которого установлено значение false, который встречается в указанном начальном индексе или после него. */
  public nextClearBit(fromIndex: number): number {
    const bits = this.bits;
    let word = fromIndex >>> 6;
    let bitsLength = bits.length;
    if (word >= bitsLength) return bits.length << 6;
    let bitsAtWord = bits[word];
    for (let i = fromIndex & 0x3f; i < 64; i++) {
      if ((bitsAtWord & (1 << (i & 0x3f))) == 0) {
        return (word << 6) + i;
      }
    }
    for (word++; word < bitsLength; word++) {
      if (word == 0) {
        return word << 6;
      }
      bitsAtWord = bits[word];
      for (let i = 0; i < 64; i++) {
        if ((bitsAtWord & (1 << (i & 0x3f))) == 0) {
          return (word << 6) + i;
        }
      }
    }
    return bits.length << 6;
  }

  /** Выполняет логическое <b>И</b> этого целевого набора битов с установленным битом аргумента. Этот набор битов изменен так, что каждый бит
   * в нем имеет значение true тогда и только тогда, когда он изначально имел значение true и соответствующий бит в битовом наборе
   * Аргумент также имел значение true.
   * @param other 
   */
  public and(other: Bits): void {
    let commonWords = Math.min(this.bits.length, other.bits.length);
    for (let i = 0; commonWords > i; i++) {
      this.bits[i] &= other.bits[i];
    }

    if (this.bits.length > commonWords) {
      for (let i = commonWords, s = this.bits.length; s > i; i++) {
        this.bits[i] = 0;
      }
    }
  }

  /** Очищает все биты в этом наборе битов, соответствующие биты которых установлены в указанном наборе битов.
   *
   * @param другой бит установлен */
  public andNot(other: Bits): void {
    for (
      let i = 0, j = this.bits.length, k = other.bits.length;
      i < j && i < k;
      i++
    ) {
      this.bits[i] &= ~other.bits[i];
    }
  }

  /** Выполняет логическое <b>ИЛИ</b> этого битового набора с аргументом битового набора. Этот битовый набор изменен так, что бит в нем имеет
   * значение true тогда и только тогда, когда оно либо уже имело значение true, либо соответствующий бит в аргументе набора битов имеет
   * значение верно.
   * @param другой бит установлен */
  public or(other: Bits): void {
    const commonWords = Math.min(this.bits.length, other.bits.length);
    for (let i = 0; commonWords > i; i++) {
      this.bits[i] |= other.bits[i];
    }

    if (commonWords < other.bits.length) {
      this.checkCapacity(other.bits.length);
      for (let i = commonWords, s = other.bits.length; s > i; i++) {
        this.bits[i] = other.bits[i];
      }
    }
  }

  /** Выполняет логическое <b>исключающее ИЛИ</b> этого битового набора с аргументом битового набора. Этот битовый набор изменен так, что бит в нем имеет
   * значение true тогда и только тогда, когда выполняется одно из следующих утверждений:
   * <ул>
   * <li>Бит изначально имеет значение true, а соответствующий бит в аргументе имеет значение false.</li>
   * <li>Бит изначально имеет значение false, а соответствующий бит в аргументе имеет значение true.</li>
   * </ul>
   * @параметр другой */
  public xor(other: Bits): void {
    let commonWords = Math.min(this.bits.length, other.bits.length);

    for (let i = 0; commonWords > i; i++) {
      this.bits[i] ^= other.bits[i];
    }

    if (commonWords < other.bits.length) {
      this.checkCapacity(other.bits.length);
      for (let i = commonWords, s = other.bits.length; s > i; i++) {
        this.bits[i] = other.bits[i];
      }
    }
  }

  /** Возвращает истину, если в указанном наборе битов есть какие-либо биты, установленные в значение «истина», которые также установлены в значение «истина» в этом наборе битов.
   *
   * @param другой бит установлен
   * @return логическое значение, указывающее, пересекается ли этот набор битов с указанным набором битов */
  public intersects(other: Bits): boolean {
    const bits = this.bits;
    const otherBits = other.bits;
    for (let i = Math.min(bits.length, otherBits.length) - 1; i >= 0; i--) {
      if ((bits[i] & otherBits[i]) != 0) {
        return true;
      }
    }
    return false;
  }

  /** Возвращает значение true, если этот набор битов является надмножеством указанного набора, т. е. все биты, установленные в значение true, также установлены в значение
   * true в указанном BitSet.
   *
   * @return логическое значение, указывающее, является ли этот набор битов надмножеством указанного набора */
  public containsAll(other: Bits): boolean {
    const bits = this.bits;
    const otherBits = other.bits;
    let otherBitsLength = otherBits.length;
    let bitsLength = bits.length;

    for (let i = bitsLength; i < otherBitsLength; i++) {
      if (otherBits[i] != 0) {
        return false;
      }
    }
    for (let i = Math.min(bitsLength, otherBitsLength) - 1; i >= 0; i--) {
      if ((bits[i] & otherBits[i]) != otherBits[i]) {
        return false;
      }
    }
    return true;
  }

  public setBits(bits: number[]): Bits {
    this.bits = [...bits];
    return this;
  }

  private checkCapacity(len: number): void {
    if (len >= this.bits.length) {
      const newBits: number[] = Array.from(
        Array(len),
        (v, k) => this.bits[k] || 0
      );
      this.bits = newBits;
    }
  }

  toString(): string {
    throw new Error("Method not implemented.");
  }

  hashCode(): number {
    const word: number = this.length() >>> 6;
    let hash = 0;
    for (let i = 0; word >= i; i++) {
      hash = 127 * hash + <number>(this.bits[i] ^ (this.bits[i] >>> 32));
    }
    return hash;
  }

  equals(obj: EngineObject): boolean {
    if (this === obj) return true;
    if (obj === null) return false;
    const other = <Bits>obj;
    const otherBits = other.bits;

    let commonWords = Math.min(this.bits.length, otherBits.length);
    for (let i = 0; commonWords > i; i++) {
      if (this.bits[i] != otherBits[i]) return false;
    }

    if (this.bits.length == otherBits.length) return true;

    return this.length() == other.length();
  }
}
