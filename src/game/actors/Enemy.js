import { randomIntBetween } from ('../../utils/MathUtils');
import BaseActor from './BaseActor';

export default class Enemy extends BaseActor {
    constructor(level = 1) {
        super(randomIntBetween(level, level + 2));
    }
}
