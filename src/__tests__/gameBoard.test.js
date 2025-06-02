import { createGameBoard } from '../gameBoard.js'
import { createBattleship } from '../battleship.js';

//let testBoard = createGameBoard();

//let carrier = createBattleship(5);
//let battleship = createBattleship(4);
//let cruiser = createBattleship(3);
//let submarine = createBattleship(3);
//let destroyer = createBattleship(2);


test('place carrier in [0,0] - [4,0]', () => {
    let testBoard = createGameBoard();
    let carrier = createBattleship(5);
    testBoard.placeShip(carrier, [0, 0], [4, 0]);
    expect(testBoard.getOccupied()).toStrictEqual([[[4, 0], carrier], [[3, 0], carrier], [[2, 0], carrier], [[1, 0], carrier], [[0, 0], carrier]])
});

test('place carrier in [0,0] - [0,4]', () => {
    let testBoard = createGameBoard();
    let carrier = createBattleship(5);
    testBoard.placeShip(carrier, [0, 0], [0, 4]);
    console.log(testBoard.getOccupied());
    expect(testBoard.getOccupied()).toStrictEqual([[[0, 4], carrier], [[0, 3], carrier], [[0, 2], carrier], [[0, 1], carrier], [[0, 0], carrier]])
});
