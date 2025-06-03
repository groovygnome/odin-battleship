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
    expect(testBoard.getOccupied()).toStrictEqual([[[0, 4], carrier], [[0, 3], carrier], [[0, 2], carrier], [[0, 1], carrier], [[0, 0], carrier]])
});

test('place carrier in [0,0] - [0,4], place battleship in [8,3] - [8,6]', () => {
    let testBoard = createGameBoard();
    let carrier = createBattleship(5);
    let battleship = createBattleship(4);
    testBoard.placeShip(carrier, [0, 0], [0, 4]);
    testBoard.placeShip(battleship, [8, 3], [8, 6]);
    expect(testBoard.getOccupied()).toStrictEqual([[[0, 4], carrier], [[0, 3], carrier], [[0, 2], carrier], [[0, 1], carrier], [[0, 0], carrier], [[8, 6], battleship], [[8, 5], battleship], [[8, 4], battleship], [[8, 3], battleship]])
});


test('place carrier in [0,0] - [0,4], attack [0,1]', () => {
    let testBoard = createGameBoard();
    let carrier = createBattleship(5);
    testBoard.placeShip(carrier, [0, 0], [0, 4]);
    testBoard.receiveAttack([0, 1]);
    expect(testBoard.getOccupied()).toStrictEqual([[[0, 4], carrier], [[0, 3], carrier], [[0, 2], carrier], [[0, 0], carrier]]);
    expect(carrier.getHits()).toBe(1);
});

test('place carrier in [0,0] - [0,4], sink ship', () => {
    let testBoard = createGameBoard();
    let carrier = createBattleship(5);
    testBoard.placeShip(carrier, [0, 0], [0, 4]);
    testBoard.receiveAttack([0, 1]);
    testBoard.receiveAttack([0, 2]);
    testBoard.receiveAttack([0, 3]);
    testBoard.receiveAttack([0, 4]);
    testBoard.receiveAttack([0, 0]);
    expect(testBoard.getOccupied()).toStrictEqual([]);
    expect(testBoard.getSunk()).toBe(1);
    expect(carrier.getHits()).toBe(5);
    expect(carrier.isSunk()).toBe(true);
});

test('miss', () => {
    let testBoard = createGameBoard();
    testBoard.receiveAttack([0, 1]);
    expect(testBoard.getMissed()).toStrictEqual([[0, 1]]);
});
