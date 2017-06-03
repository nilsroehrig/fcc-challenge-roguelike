import { randomIntBetween } from '../utils/MathUtils';

const Weapons = [
    {
        name: 'Bare Hands',
        attack: 0,
        critChance: 1
    }, {
        name: 'Wooden Branch',
        attack: randomIntBetween(10, 20),
        critChance: 2
    }, {
        name: 'Rusty Pipe',
        attack: randomIntBetween(20, 40),
        critChance: 3
    }, {
        name: 'Dagger',
        attack: randomIntBetween(40, 70),
        critChance: 5
    }, {
        name: 'War Hammer',
        attack: randomIntBetween(70, 100),
        critChance: 8
    }, {
        name: 'Hand of Gods',
        attack: randomIntBetween(100, 140),
        critChance: 13
    }
];

export default function getWeapon(index) {
    return Weapons[index];
}
