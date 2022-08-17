import { Comparator } from "../@interfaces/Comparator";
import { SystemListener } from "../@interfaces/Systemlisteners";
import { EngineArray } from "../utils/EngineArray";
import { ImmutableArray } from "../utils/ImmutableArray";
import { EntitySystem } from "./EntitySystem";

export class SystemManager {
  private systemComparator: SystemComparator = new SystemComparator();
  private systems: EngineArray<EntitySystem> = new EngineArray<EntitySystem>();
  private immutableSystems: ImmutableArray<EntitySystem> =
    new ImmutableArray<EntitySystem>(this.systems);
  private systemsByClass: Map<typeof EntitySystem, EntitySystem> = new Map<
    typeof EntitySystem,
    EntitySystem
  >();
  private listener: SystemListener;

  constructor(listener: SystemListener) {
    this.listener = listener;
  }

  addSystem(system: EntitySystem): void {
    const systemType = system.getClass();
    const oldSytem: EntitySystem = this.getSystem(systemType) || null;
    if (oldSytem) {
      this.removeSystem(oldSytem);
    }

    this.systems.push(system);
    this.systemsByClass.set(systemType, system);
    this.systems.sortItems(this.systemComparator);
    this.listener.systemAdded(system);
  }
  removeSystem(system: EntitySystem): void {
    if (this.systems.removeValue(system)) {
      this.systemsByClass.delete(system.getClass());
      this.listener.systemRemoved(system);
    }
  }

  removeAllSystems(): void {
    while (this.systems.length > 0) {
      this.removeSystem(this.systems.first()!);
    }
  }

  getSystem<T extends EntitySystem>(
    systemType: typeof EntitySystem
  ): EntitySystem {
    return <T>this.systemsByClass.get(systemType);
  }

  getSystems(): ImmutableArray<EntitySystem> {
    return this.immutableSystems;
  }
}

class SystemComparator implements Comparator<EntitySystem> {
  private static instance: SystemComparator;
  constructor() {
    if (SystemComparator.instance) {
      return SystemComparator.instance;
    }
    SystemComparator.instance = this;
  }
  compare(a: EntitySystem, b: EntitySystem): number {
    return a.priority > b.priority ? 1 : a.priority == b.priority ? 0 : -1;
  }
}
