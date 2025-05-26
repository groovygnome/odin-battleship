export function createBattleship(length) {
    let hits = 0;
    let sunk = false;
    let startCoords = [];
    let endCoords = [];

    function hit() {
        hits++;
    }

    function isSunk() {
        if (hits === length) return true;
        return false;
    }

    function setStart(x, y) {
        startCoords.push(x);
        startCoords.push(y);
    }

    function setEnd(x, y) {
        endCoords.push(x);
        endCoords.push(y);
    }

    return { hit, isSunk, setStart, setEnd };
}
