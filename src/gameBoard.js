import { createBattleship } from './battleship.js'

export function createGameboard() {
    let carrier = createBattleship(5);
    let battleship = createBattleship(4);
    let cruiser = createBattleship(3);
    let submarine = createBattleship(3);
    let destroyer = createBattleship(2);

    function placeShip(ship) {

    }
}
