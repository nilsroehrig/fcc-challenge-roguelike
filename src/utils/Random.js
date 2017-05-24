export function randomBetween(start, end) {
    return (Math.random() * (end - start)) + start;
}

export default {randomBetween};
