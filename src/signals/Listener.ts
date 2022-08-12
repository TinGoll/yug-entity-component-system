import { Signal } from "./Signal";

export interface Listener<T> {
    /**
	 * @param signal Сигнал, вызвавший событие
	 * @param object Объект, передаваемый при отправке
	 */
	receive (signal: Signal<T> , object: T): void;
}