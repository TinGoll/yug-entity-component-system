import { Engine } from "../core/Engine";
import { Entity } from "../core/Entity";

export interface EntityListener<E extends Entity = Entity> {
  /**
   * Вызывается всякий раз, когда {@link Entity} добавляется в {@link Engine} или в определенное семейство.
   */
  entityAdded(entity: E): void;
  /**
   * Вызывается всякий раз, когда {@link Entity} удаляется в {@link Engine} или в определенном семействе.
   */
  entityRemoved(entity: E): void;
}