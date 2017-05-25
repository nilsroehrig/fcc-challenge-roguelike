export function randomBetween(start, end) {
    return (Math.random() * (end - start)) + start;
}

export function randomIntBetween(start, end) {
    return randomBetween(Math.floor(start), Math.floor(end));
}

export default {randomBetween, randomIntBetween};