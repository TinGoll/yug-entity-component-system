import { Bits } from "../utils/Bits";
import { ComponentClass } from "./Component";

export class ComponentType {
  private static assignedComponentTypes: Map<string, ComponentType> = new Map<
    string,
    ComponentType
  >();
  private static typeIndex: number = 0;

  private readonly index: number;

  /**
   * Уникально идентифицирует подкласс {@link Component}. Он присваивает им индекс, который используется внутри для быстрого сравнения и
   * поиск. См. {@link Family} и {@link Entity}. ComponentType — это класс, защищенный пакетом. Вы не можете создать экземпляр
   * Тип компонента. Доступ к ним возможен только через {@link #getIndexFor(Class<? extends Component>)}. Каждый класс компонентов всегда
   * вернуть тот же экземпляр ComponentType.
   * @author Stefan Bachmann
   */
  private constructor() {
    this.index = ComponentType.typeIndex++;
  }

  /** @return Уникальный индекс этого ComponentType */
  getIndex(): number {
    return this.index;
  }
  /**
   * @param componentType Класс {@link Component}
   * @return Тип компонента, соответствующий классу компонента
   */
  public static getFor(componentType: ComponentClass) {
    let type: ComponentType | null =
      this.assignedComponentTypes.get(componentType.name) || null;
    if (type == null) {
      type = new ComponentType();
      this.assignedComponentTypes.set(componentType.name, type);
    }
    return type;
  }

  /**
   * Быстрый вспомогательный метод. То же самое можно сделать с помощью {@link ComponentType.getFor(Class<? extends Component>)}.
   * @param componentType Класс {@link Component}
   * @return Индекс для указанного класса {@link Component}.
   */
  public static getIndexFor(componentType: ComponentClass): number {
    return this.getFor(componentType).getIndex();
  }

  /**
   * @param componentTypes list of {@link Component} classes
   * @return Биты, представляющие набор компонентов для быстрого сравнения и сопоставления. Видеть
   *         {@link Family#getFor(Bits, Bits, Bits)}.
   */
  public static getBitsFor(...componentTypes: ComponentClass[]): Bits {
    
    const bits = new Bits();
    let typesLength = componentTypes.length;
    for (let i = 0; i < typesLength; i++) {
      bits.set(ComponentType.getIndexFor(componentTypes[i]));
    }
    return bits;
  }

  hashCode(): number {
    return this.index;
  }

  public equals (obj: object): boolean {
		if (this == obj) return true;
		if (obj == null) return false;
		const other: ComponentType = <ComponentType>obj;
		return this.index === other?.index;
	}
}
