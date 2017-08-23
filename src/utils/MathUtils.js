// @flow
import type { Point } from '../types/BasicTypes';

export function randomBetween(start: number, end: number): number {
    return (Math.random() * (end - start)) + start;
}

export function randomIntBetween(start: number, end: number): number {
    return Math.floor(randomBetween(Math.floor(start), Math.floor(end)));
}

export function oddify(value: number, floor: boolean = false): number {
    return value % 2 === 0 ? value + ((floor) ? -1 : 1) : value;
}

export function distance(p1: Point, p2: Point): number {
    const aq = (Math.max(p1.x, p2.x) - Math.min(p1.x, p2.x)) ** 2;
    const bq = (Math.max(p1.y, p2.y) - Math.min(p1.y, p2.y)) ** 2;
    const cq = aq + bq;
    const c = Math.sqrt(cq);

    return Math.round(c);
}


export default { oddify, randomBetween, randomIntBetween, distance };
