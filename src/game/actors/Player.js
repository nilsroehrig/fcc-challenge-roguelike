import Weapons from './Weapons';
import BaseActor from './BaseActor';

export default class Player extends BaseActor {
    constructor() {
        super(1);
        this.weapon = Weapons[0];
    }

    getAttack() {
        return this.weapon.attack + super.getAttack();
    }

    pickUpWeapon(dungeonLevel) {
        this.weapon = Weapons[dungeonLevel];
    }
}
