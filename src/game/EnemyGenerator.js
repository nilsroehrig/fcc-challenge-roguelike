import {randomIntBetween} from '../utils/MathUtils';
import getRandomMonsterName from './MonsterNames';

function generateAttribute(min, max, count) {
    let health = 0;
    for (let i = 0; i < count; i++) {
        health += randomIntBetween(min, max);
    }
    return health;
}

export default function EnemyGenerator(level) {
    let health = generateAttribute(80, 120, level);
    let attack = generateAttribute(8, 12, level);
    return {
        name: getRandomMonsterName(),
        health: health,
        attack: attack,
        exp: (health + attack) / level
    };
}
