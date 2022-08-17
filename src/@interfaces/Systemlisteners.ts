import { EntitySystem } from "../core/EntitySystem";

export interface SystemListener {
  systemAdded(system: EntitySystem): void;
  systemRemoved(system: EntitySystem): void;
}
