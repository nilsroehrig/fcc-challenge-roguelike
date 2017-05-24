class Room {
    constructor(width, height, x = 0, y = 0) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.position = undefined;
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
    }

    setHeight(height) {
        this.height = height;
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
        if (!this.position) {
            this._internalSetPosition();
        }

        return this.position;
    }
}

export default Room;
