// https://bost.ocks.org/mike/shuffle/
export function shuffle(array) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export function shuffleImmutable(array) {
    let newArray = array.slice();
    return shuffle(newArray);
}

export default { shuffle };
