import React from 'react';
import renderer from 'react-test-renderer';
import Cell from './Cell';
import Field from '../../game/map/fields/Field';
import { Types } from '../../game/map/fields/FieldTypes';

function createNewCell(props) {
    const {
        field,
        cellSize = 0,
        cellPaddingTop = 0,
        cellPaddingLeft = 0,
        playerPosition = {
            x: 15,
            y: 15
        }} = props;
    return renderer.create(<Cell
        field={field}
        key={field.getId()}
        cellSize={cellSize}
        cellPaddingTop={cellPaddingTop}
        cellPaddingLeft={cellPaddingLeft}
        playerPosition={playerPosition}
    />);
}

test('Cell is not rendered when it is out of sight', () => {
    const field = new Field({
        x: 1,
        y: 1,
        type: Types.earth
    });

    const cell = createNewCell({ field });
    const cellAsTree = cell.toJSON();
    expect(cellAsTree).toMatchSnapshot();
});

test('Cell is rendered when it is in sight', () => {
    const field = new Field({
        x: 14,
        y: 14,
        type: Types.earth
    });

    const cell = createNewCell({ field });
    const cellAsTree = cell.toJSON();
    expect(cellAsTree).toMatchSnapshot();
});