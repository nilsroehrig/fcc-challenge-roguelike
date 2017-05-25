import { randomIntBetween } from ('../../utils/MathUtils');

export default class BaseActor {
    constructor(level = 1) {
        this.attack = level * randomIntBetween(8, 13);
        this.health = level * randomIntBetween(80, 121);
    }

    levelUp(level) {
        this.level = this.level + 1;
        this.attack = this.attack + randomIntBetween(8, 13);
        this.health = this.attack + randomIntBetween(80, 121);
    }

    takeDamage(attackValue) {
        this.health = randomIntBetween(attackValue * .75, attackValue + 1);
    }

    getAttack() {
        return this.attack;
    }
}
