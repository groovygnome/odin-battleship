import { createBattleship } from './battleship.js'

export function createGameboard() {
    let carrier = createBattleship(5);
    let battleship = createBattleship(4);
    let cruiser = createBattleship(3);
    let submarine = createBattleship(3);
    let destroyer = createBattleship(2);

    let occupied = [];
    let misses = 0;
    let sunk = 0;

    function placeShip(ship, startCoordinates, endCoordinates) {
        // if(startCoordinates[0] < 0 || startCoordinates[1] < 0 || endCoordinates [0] < 0 || endCoordinates[1] < 0)
        let length = ship.getLength();
        let i;
        let j;
        if (startCoordinates[0] === endCoordinates[0]) {
            i = 0;
            j = 1;
        } else if (startCoordinates[1] === endCoordinates[1]) {
            i = 1;
            j = 0;
        } else {
            return false;
        }
        let diff = startCoordinates[j] - endCoordinates[j];
        if (Math.abs(diff) === length - 1) {
            while (diff != 0) {
                let occupiedEntry = i === 0
                    ? [[startCoordinates[i], startCoordinates[j - diff]], ship]
                    : [[startCoordinates[j], startCoordinates[i - diff]], ship];
                occupied.push(occupiedEntry);
                diff = diff > 0 ? diff - 1 : diff + 1;
            }
            occupied.push([startCoordinates, ship]);
        } else {
            return false;
        }

    }

    function receiveAttack(coordinates) {
        let space = occupied.findIndex(entry => entry[0] === coordinates);
        if (space != -1) {
            let ship = occupied[space][1];
            ship.hit();
            occupied.splice(space, 1);
            if (ship.isSunk()) sunk++;
            if (sunk === 5) console.log('All ships sunk :(');
        } else {
            misses++;
        }
    }

    return { receiveAttack, placeShip };
}
