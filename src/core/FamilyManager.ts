import { EntityListener } from "../@interfaces/EntityListener";
import { Bits } from "../utils/Bits";
import { EngineArray } from "../utils/EngineArray";
import { ImmutableArray } from "../utils/ImmutableArray";
import { Entity } from "./Entity";
import { Family } from "./Family";

export class FamilyManager<E extends Entity = Entity> {
  private families: Map<Family, Array<E>> = new Map<
    Family,
    Array<E>
  >();
  private immutableFamilies: Map<Family, ImmutableArray<E>> = new Map<
    Family,
    ImmutableArray<E>
  >();

  private entityListeners: EngineArray<EntityListenerData> = new EngineArray<EntityListenerData>()
  private entityListenerMasks: Map<Family, Bits> = new Map<Family, Bits>;
  private _notifying: boolean = false;

  constructor(private readonly entities: ImmutableArray<E>) {}

  getEntitiesFor(family: Family): ImmutableArray<E> {
    return this.registerFamily(family);
  }
  
  public  notifying():boolean {
		return this._notifying;
	}

  public addEntityListener (family: Family, priority: number, listener: EntityListener): void {
		this.registerFamily(family);
		let insertionIndex = 0;
		while (insertionIndex < this.entityListeners.length) {
			if (this.entityListeners[insertionIndex]?.priority! <= priority) {
				insertionIndex++;
			} else {
				break;
			}
		}
    for (const mask of this.entityListenerMasks.values()) {
        for (let k = mask.length(); k > insertionIndex; k--) {
				if (mask.get(k - 1)) {
					mask.set(k);
				} else {
					mask.clear(k);
				}
			}
			mask.clear(insertionIndex);
    }
		this.entityListenerMasks.get(family)!.set(insertionIndex);
		const entityListenerData: EntityListenerData = new EntityListenerData();
		entityListenerData.listener = listener;
		entityListenerData.priority = priority;
		this.entityListeners.insert(insertionIndex, entityListenerData);
	}

  registerFamily(family: Family): ImmutableArray<E> {
    let entitiesInFamily = this.immutableFamilies.get(family) || null;
    if (!entitiesInFamily) {
      const familyEntities = new Array<E>();
      entitiesInFamily = new ImmutableArray<E>(familyEntities);
      this.families.set(family, familyEntities);
      this.immutableFamilies.set(family, entitiesInFamily);
      this.entityListenerMasks.set(family, new Bits())
      for (const entity of this.entities) {
        this.updateFamilyMembership(entity);
      }
    }
    return entitiesInFamily;
  }

  	public removeEntityListener (listener: EntityListener): void {
		for (let i = 0; i < this.entityListeners.length; i++) {
		  const	entityListenerData = this.entityListeners[i];
      if (!entityListenerData) continue;
			if (entityListenerData.listener === listener) {
        for (const mask of this.entityListenerMasks.values()) {
          for (let k = i, n = mask.length(); k < n; k++) {
						if (mask.get(k + 1)) {
							mask.set(k);
						} else {
							mask.clear(k);
						}
					}
        }
				this.entityListeners.removeIndex(i--);
			}
		}
	}


  updateFamilyMembership(entity: E) {
    const addListenerBits = new Bits();
    const removeListenerBits = new Bits();
    for (const family of this.entityListenerMasks.keys()) {
      const familyIndex = family.getIndex();
			const entityFamilyBits = entity.getFamilyBits();
      const belongsToFamily = entityFamilyBits.get(familyIndex);
			const matches = family.matches(entity) && !entity.removing;
      if (belongsToFamily !== matches) {
				const listenersMask = this.entityListenerMasks.get(family)!;
				const familyEntities = this.families.get(family)!;
				if (matches) {
					addListenerBits.or(listenersMask);
					familyEntities.push(entity);
					entityFamilyBits.set(familyIndex);
				} else {
					removeListenerBits.or(listenersMask);
          const entityIndex = familyEntities.indexOf(entity)
          if (entityIndex !== -1) {
            familyEntities.splice(entityIndex, 1);
          }
					entityFamilyBits.clear(familyIndex);
				}
			}
    }
    this._notifying = true;
    const items = this.entityListeners;
    try {
      for (let i = removeListenerBits.nextSetBit(0); i >= 0; i = removeListenerBits.nextSetBit(i + 1)) {
				(<EntityListenerData>items[i]).listener!.entityRemoved(entity);
			}
			for (let i = addListenerBits.nextSetBit(0); i >= 0; i = addListenerBits.nextSetBit(i + 1)) {
				(<EntityListenerData>items[i]).listener!.entityAdded(entity);
			}
    } catch (error) {
    }finally{
      addListenerBits.clear();
			removeListenerBits.clear();
			this._notifying = false;	
    }
  }
}

class EntityListenerData {
  public listener?: EntityListener;
	public priority?:number;
}
