export function createBattleship(length) {
    let hits = 0;
    let sunk = false;

    function hit() {
        hits++;
    }

    function isSunk() {
        if (hits === length) return true;
        return false;
    }

    function getLength() {
        return length;
    }

    function getHits() { return hits; }

    return { hit, isSunk, getLength, getHits };
}
