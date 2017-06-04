import uuid from 'uuid';

import Field from './fields/Field';
import FieldTypes from './fields/FieldTypes';

const { Types } = FieldTypes;

function createMapData(width, height) {
    const map = [];
    for (let h = 0; h < height; h++) {
        map[h] = [];
        for (let w = 0; w < width; w++) {
            map[h][w] = new Field({ type: Types.rock, x: w, y: h });
        }
    }
    return map;
}

function cloneMapData(map) {
    return map.map(row => [...row]);
}

function cloneOnlySpecifiedRow(mapData, row) {
    const innerMapData = [...mapData];
    innerMapData[row] = [...mapData[row]];
    return innerMapData;
}

export default class DungeonMap {
    constructor(params) {
        const { width, height } = params;
        const id = params.id || uuid();
        const mapData = params.mapData || createMapData(width, height);

        function getCopy() {
            return { id, mapData: cloneMapData(mapData) };
        }

        function getDimensions() {
            return { width, height };
        }

        function getField(x, y) {
            return mapData[y][x];
        }

        function setField(x, y, newField) {
            const newMap = cloneOnlySpecifiedRow(mapData, y);
            newMap[y][x] = newField;
            return { id, newMap };
        }

        this.getCopy = getCopy;
        this.getDimensions = getDimensions;
        this.getField = getField;
        this.setField = setField;
        Object.freeze(this);
    }
}
