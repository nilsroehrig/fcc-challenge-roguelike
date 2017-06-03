import { randomIntBetween } from '../utils/MathUtils';
import getRandomMonsterName from './MonsterNames';

function generateAttribute(min, max, count) {
    let health = 0;
    for (let i = 0; i < count; i++) {
        health += randomIntBetween(min, max);
    }
    return health;
}

function generate(x, y, level) {
    const health = generateAttribute(80, 120, level);
    const attack = generateAttribute(8, 12, level);
    return {
        health,
        attack,
        name: getRandomMonsterName(),
        exp: (health + attack) / level,
        position: { x, y }
    };
}

export default { generate };
