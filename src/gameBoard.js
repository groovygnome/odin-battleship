import { createBattleship } from './battleship.js'

export function createGameBoard() {
    let occupied = [];
    let missed = [];
    let sunk = 0;

    function placeShip(ship, startCoordinates, endCoordinates) {
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
                    ? [[startCoordinates[i], startCoordinates[j] - diff], ship]
                    : [[startCoordinates[j] - diff, startCoordinates[i]], ship];
                occupied.push(occupiedEntry);
                diff = diff > 0 ? diff - 1 : diff + 1;
            }
            occupied.push([startCoordinates, ship]);
        } else {
            return false;
        }

    }

    function receiveAttack(coordinates) {
        let space = occupied.findIndex(entry => entry[0].toString() === coordinates.toString());

        if (space != -1) {
            let ship = occupied[space][1];
            ship.hit();
            occupied.splice(space, 1);
            if (ship.isSunk()) sunk++;
            if (sunk === 5) console.log('All ships sunk :(');
        } else {
            missed.push(coordinates);
        }
    }

    function getOccupied() {
        return occupied;
    }

    function getMissed() {
        return missed;
    }

    function getSunk() {
        return sunk;
    }

    return { receiveAttack, placeShip, getOccupied, getMissed, getSunk };
}
