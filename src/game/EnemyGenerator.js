import uuid from 'uuid';
import { randomBetween, randomIntBetween } from '../utils/MathUtils';
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
        critChance: Math.floor(level * modifier),
        id: uuid(),
        name: monsterName.join(' '),
        exp: Math.floor(((health + attack) / level) * randomBetween(1, 2)),
        position: { x, y },
        img: `https://robohash.org/${encodeURIComponent(monsterName.join(' '))}.png?set=set2`
    };
}

export default { generate };
