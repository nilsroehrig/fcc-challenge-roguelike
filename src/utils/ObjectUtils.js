/* eslint-disable import/prefer-default-export */
export function switchKeysAndValues(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});
}
