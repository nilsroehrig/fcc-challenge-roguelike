// @flow
export function randomBetween(start: number, end: number): number {
    return (Math.random() * (end - start)) + start;
}

export function randomIntBetween(start: number, end: number): number {
    return Math.floor(randomBetween(Math.floor(start), Math.floor(end)));
}

export function oddify(value: number, floor: boolean = false) {
    return value % 2 === 0 ? value + ((floor) ? -1 : 1) : value;
}

export default { oddify, randomBetween, randomIntBetween };
