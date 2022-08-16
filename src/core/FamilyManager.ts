import { ImmutableArray } from "../utils/ImmutableArray";
import { Entity } from "./Entity";
import { Family } from "./Family";

export class FamilyManager {
  private families: Map<Family, Array<Entity>> = new Map<
    Family,
    Array<Entity>
  >();
  private immutableFamilies: Map<Family, ImmutableArray<Entity>> = new Map<
    Family,
    ImmutableArray<Entity>
  >();

  constructor(private readonly entities: ImmutableArray<Entity>) {}

  getEntitiesFor(family: Family): ImmutableArray<Entity> {
    return this.registerFamily(family);
  }

  registerFamily(family: Family): ImmutableArray<Entity> {
    let entitiesInFamily = this.immutableFamilies.get(family) || null;
    if (!entitiesInFamily) {
      const familyEntities = new Array<Entity>();
      entitiesInFamily = new ImmutableArray<Entity>(familyEntities);
      this.families.set(family, familyEntities);
      this.immutableFamilies.set(family, entitiesInFamily);

      for (const entity of this.entities) {
        this.updateFamilyMembership(entity);
      }
    }
    return entitiesInFamily;
  }
  updateFamilyMembership(entity: Entity) {
    // Реализовать метод
  }
}
