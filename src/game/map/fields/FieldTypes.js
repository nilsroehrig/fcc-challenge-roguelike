// @flow
import { switchKeysAndValues } from '../../../utils/ObjectUtils';

export const Types: any = {
    rock: 0,
    earth: 1,
    wall: 2,
    player: 3,
    enemy: 4,
    boss: 5,
    exit: 6,
    weapon: 7,
    health: 8
};

export const TypesByCode = Object.freeze(switchKeysAndValues(Types));

export type FieldTypeCode = $Keys<TypesByCode>;
export type FieldTypeName = $Keys<Types>;

export default { Types, TypesByCode };
