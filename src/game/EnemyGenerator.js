import uuid from 'uuid';
import { randomIntBetween } from '../utils/MathUtils';
import getRandomMonsterName from './MonsterNames';

function generateAttribute(min, max, count) {
    let health = 0;
    for (let i = 0; i < count; i++) {
        health += randomIntBetween(min, max);
    }
    return health;
}

function generate(x, y, level, boss) {
    const modifier = (boss) ? 3 : 1;
    const health = generateAttribute(80, 120, level) * modifier;
    const attack = generateAttribute(8, 12, level) * modifier;
    const monsterName = [getRandomMonsterName()];
    if (boss) {
        monsterName.push('(BOSS)');
    }

    return {
        health,
        attack,
        boss,
        id: uuid(),
        name: monsterName.join(' '),
        exp: ((health + attack) / level) * 2,
        position: { x, y }
    };
}

export default { generate };
