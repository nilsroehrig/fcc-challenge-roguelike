import uuid from 'uuid';

export default class Field {
    constructor(params) {
        const { x, y, type, image } = params;
        const id = params.id || uuid();

        function getPosition() {
            return { x, y };
        }

        function getType() {
            return type;
        }

        function getId() {
            return id;
        }

        function setType(newType) {
            return new Field({ x, y, image, id, type: newType });
        }

        function getImage() {
            return image;
        }

        function setImage(newImage) {
            return new Field({ x, y, type, id, image: newImage });
        }

        function getCopy() {
            return new Field({ x, y, type, id, image });
        }

        this.getPosition = getPosition;
        this.getType = getType;
        this.setType = setType;
        this.getImage = getImage;
        this.setImage = setImage;
        this.getCopy = getCopy;
        this.getId = getId;

        Object.freeze(this);
    }
}
