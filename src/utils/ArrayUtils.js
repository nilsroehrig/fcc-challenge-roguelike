// @flow
// https://bost.ocks.org/mike/shuffle/
export function shuffle(oldArray: Array<any>): Array<any> {
    const array = oldArray.slice();
    let m = array.length;
    let t;
    let i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

export default { shuffle };
