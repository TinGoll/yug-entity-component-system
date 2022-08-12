import { Entity } from "../core/Entity";

export interface EntityListener {
  /**
   * Вызывается всякий раз, когда {@link Entity} добавляется в {@link Engine} или в определенное семейство.
   */
  entityAdded(entity: Entity): void;
  /**
   * Вызывается всякий раз, когда {@link Entity} удаляется в {@link Engine} или в определенном семействе.
   */
  entityRemoved(entity: Entity): void;
}