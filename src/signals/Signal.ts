import { Listener } from "./Listener";

export class Signal<T> {
  private listeners: Set<Listener<T>>;
  constructor() {
    this.listeners = new Set<Listener<T>>();
  }
  /**
   * Добавьте слушателя к этому сигналу
   * @param listener Добавляемый слушатель
   */
  add(listener: Listener<T>): void {
    this.listeners.add(listener);
  }
  /**
   * Удалить слушателя из этого сигнала
   * @param listener Слушатель, который нужно удалить
   */
  remove(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }
  /** Удаляет всех прослушивателей, прикрепленных к this {@link Signal}. */
  removeAllListeners(): void {
    this.listeners.clear();
  }
  /**
   * Отправляет событие всем слушателям, зарегистрированным на этот сигнал
   * @param object Объект для отправки
   */
  dispatch(object: T): void {
    for (const listener of this.listeners) {
      listener.receive(this, object);
    }
  }
}