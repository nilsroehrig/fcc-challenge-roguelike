import {randomBetween} from '../utils/MathUtils';

class Room {
    constructor(width, height, x = 0, y = 0) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this._internalSetPosition();
    }

    _internalSetPosition() {
        let halfWidth = this.width / 2;
        let halfHeight = this.height / 2;
        let widthIsWhole = true;
        let heightIsWhole = true;

        if (halfWidth % 1 !== 0) widthIsWhole = false;
        if (halfHeight % 1 !== 0) heightIsWhole = false;

        let top = this.y - ((heightIsWhole) ? Math.floor(halfHeight - 1) : Math.floor(halfHeight));
        let bottom = this.y + Math.floor(halfHeight);

        let left = this.x - ((widthIsWhole) ? Math.floor(halfWidth - 1) : Math.floor(halfWidth));
        let right = this.x + Math.floor(halfWidth);

        let x = this.x;
        let y = this.y;

        this.position = {top, bottom, left, right, x, y};
    }

    setWidth(width) {
        this.width = width;
        this._internalSetPosition();
    }

    setHeight(height) {
        this.height = height;
        this._internalSetPosition();
    }

    setX(x) {
        this.x = x;
        this._internalSetPosition();
    }

    setY(y) {
        this.y = y;
        this._internalSetPosition();
    }

    getPosition() {
        return this.position;
    }

    getRandomWall(direction) {
        let x, y;
        switch (direction) {
            case 'top':
            x = Math.floor(randomBetween(this.position.left + 1, this.position.right - 1));
            y = this.position.top - 1;
            break;

            case 'right':
            x = this.position.right + 1;
            y = Math.floor(randomBetween(this.position.top + 1, this.position.bottom -1));
            break;

            case 'bottom':
            x = Math.floor(randomBetween(this.position.left + 1, this.position.right - 1));
            y = this.position.bottom + 1;
            break;

            case 'left':
            case 'default':
            x = this.position.left - 1;
            y = Math.floor(randomBetween(this.position.top + 1, this.position.bottom -1));
            break;
        }
        return { direction, x, y };
    }
}

export default Room;
