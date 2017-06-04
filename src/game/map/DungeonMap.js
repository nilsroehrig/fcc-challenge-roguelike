// @flow
import uuid from 'uuid';

import Field from './fields/Field';
import { Types } from './fields/FieldTypes';

type Rect = { width: number, height: number };
type DungeonMapRow = Array<Field>;
type DungeonMapData = Array<DungeonMapRow>;

export type DungeonMapProperties = {
    width: number,
    height: number,
    mapData?: DungeonMapData,
    id?: string
};

function createMapData(width: number, height: number): DungeonMapData {
    const map = [];
    for (let h = 0; h < height; h++) {
        map[h] = [];
        for (let w = 0; w < width; w++) {
            map[h][w] = new Field({ type: Types.rock, x: w, y: h });
        }
        Object.freeze(map[h]);
    }
    Object.freeze(map);
    return map;
}

function copyMapDataWithClonedRow(mapData: DungeonMapData, row: number): DungeonMapData {
    const newMapData = [...mapData];
    newMapData[row] = [...mapData[row]];
    return newMapData;
}

function updateMapDataWithField(mapData: DungeonMapData, field: Field) {
    const { x, y } = field.getPosition();
    const newMapData = copyMapDataWithClonedRow(mapData, y);
    newMapData[y][x] = field;
    Object.freeze(newMapData[y]);
    return Object.freeze(newMapData);
}

export default class DungeonMap {
    getDimensions: Function;
    getField: Function;
    setField: Function;
    getState: Function;
    constructor(params: DungeonMapProperties) {
        const { width, height } = params;
        const id = params.id || uuid.v4();
        const mapData: DungeonMapData = params.mapData || createMapData(width, height);

        function getDimensions(): Rect {
            return Object.freeze({ width, height });
        }

        function getField(x: number, y: number): Field {
            return mapData[y][x];
        }

        function setField(newField: Field): DungeonMap {
            const newMap = updateMapDataWithField(mapData, newField);
            return new DungeonMap({ width, height, id, newMap });
        }

        function getState(): DungeonMapProperties {
            return Object.freeze({
                id,
                width,
                height,
                mapData
            });
        }

        this.getDimensions = getDimensions;
        this.getField = getField;
        this.setField = setField;
        this.getState = getState;
        Object.freeze(this);
    }
}
