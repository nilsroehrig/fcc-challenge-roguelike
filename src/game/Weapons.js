import { randomIntBetween } from '../utils/MathUtils';
export const Weapons = [{
        name: 'Bare Hands',
        attack: 0
    }, {
        name: 'Wooden Branch',
        attack: randomIntBetween(4, 7)
    }, {
        name: 'Rusty Pipe',
        attack: randomIntBetween(12, 19)
    }, {
        name: 'Dagger',
        attack: randomIntBetween(20, 31)
    }, {
        name: 'War Hammer',
        attack: randomIntBetween(35, 46)
    }, {
        name: 'Hand of Gods',
        attack: randomIntBetween(50, 71)
    }
];
