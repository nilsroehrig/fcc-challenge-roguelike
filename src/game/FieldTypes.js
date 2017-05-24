import {switchKeysAndValues} from '../utils/Object';

const Types = Object.freeze({
    rock: 0,
    earth: 1,
    wall: 2,
    player: 3,
    enemy: 4,
    boss: 5,
    exit: 6,
    weapon: 7,
    health: 8
});

const TypesByCode = Object.freeze(switchKeysAndValues(Types));

export default { Types, TypesByCode };
