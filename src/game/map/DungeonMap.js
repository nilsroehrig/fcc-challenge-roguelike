// @flow
import uuid from 'uuid';

import Field from './fields/Field';
import { Types } from './fields/FieldTypes';

import type { Rect } from '../../types/BasicTypes';

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
    }
    return map;
}

function updateMap(mapData: DungeonMapData, row: DungeonMapRow) {
    const { y } = row[0].getPosition();
    const newMap = [...mapData];
    newMap[y] = row;
    return newMap;
}

function updateRow(row: DungeonMapRow, field: Field) {
    const newRow = [...row];
    const { x } = field.getPosition();
    newRow[x] = field;
    return newRow;
}

function updateMapDataWithField(mapData: DungeonMapData, field: Field) {
    const { y } = field.getPosition();
    const newRow = updateRow(mapData[y], field);
    return updateMap(mapData, newRow);
}

function freezeMap(mapData: DungeonMapData): DungeonMapData {
    mapData.forEach(row => Object.freeze(row));
    return Object.freeze(mapData);
}

function getFreeFieldsFromMap(mapData: DungeonMapData): Array<Field> {
    return mapData.reduce((acc, row) =>
        acc.concat(row.filter(field => field.getType() === Types.earth)),
    []);
}

function flatifyMapData(mapData: DungeonMapData): Array<Field> {
    return mapData.reduce((acc, row) => {
        acc.push(...row);
        return acc;
    }, []);
}

export default class DungeonMap {
    getDimensions: Function;
    getField: Function;
    setField: Function;
    setFields: Function;
    getState: Function;
    coordinatesOutOfBounds: Function;
    getFreeFields: Function;
    getFlatMap: Function;
    constructor(params: DungeonMapProperties) {
        const { width, height } = params;
        const id = params.id || uuid.v4();
        const mapData: DungeonMapData = params.mapData || createMapData(width, height);
        const flatMap: Array<Field> = flatifyMapData(mapData);

        this.getDimensions = function getDimensions(): Rect {
            return Object.freeze({ width, height });
        };

        this.getField = function getField(x: number, y: number): Field {
            return mapData[y][x];
        };

        this.setField = function setField(newField: Field): DungeonMap {
            const newMap = updateMapDataWithField(mapData, newField);
            return new DungeonMap({ width, height, id, mapData: newMap });
        };

        this.setFields = function setFields(fields: Array<Field>): DungeonMap {
            const rows = fields.reduce((acc, field) => {
                const { y } = field.getPosition();
                acc[y] = updateRow(acc[y] || mapData[y], field);
                return acc;
            }, []);

            const newMap = [...mapData];
            rows.forEach((row, index) => {
                newMap[index] = row;
            });

            return new DungeonMap({ width, height, id, mapData: newMap });
        };

        this.getState = function getState(): DungeonMapProperties {
            return Object.freeze({
                id,
                width,
                height,
                mapData: freezeMap(mapData)
            });
        };

        this.coordinatesOutOfBounds = function coordinatesOutOfBounds(
            coordinates: { x: number, y: number }
        ): boolean {
            const { x, y } = coordinates;
            return x < 0 || x >= width || y < 0 || y >= height;
        };

        this.getFreeFields = function getFreeFields(): Array<Field> {
            return Object.freeze(getFreeFieldsFromMap(mapData));
        };

        this.getFlatMap = function getFlatMap(): Array<Field> {
            return Object.freeze([...flatMap]);
        };

        Object.freeze(this);
    }
}
