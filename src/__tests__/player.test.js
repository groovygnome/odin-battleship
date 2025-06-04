/**
* @jest-environment jsdom
*/

import { createPlayer, createCPUPlayer } from '../player.js'

let testPlayer = createPlayer('test');
const inputs = ['0', '0', '1', '0', '9', '1', '9', '0', '1', '9', '9', '1', '4', '4', '1'];
jest.spyOn(window, 'prompt').mockImplementation(() => {
    return inputs.shift();
});


testPlayer.placeShips();
//let playerBoard = testPlayer.getBoard();


test.skip('receive attacks properly', () => {
    testPlayer.setEnemyName('test');
    testPlayer.sendAttack([0, 0]);
});

test.skip('receive attacks properly', () => {
    testPlayer.setEnemyName('test');
    console.log(testPlayer.isAlive());
    const occupied = [...playerBoard.getOccupied()];
    occupied.forEach(entry => testPlayer.sendAttack(entry[0]));
    console.log(testPlayer.isAlive());
});

let testCPU = createCPUPlayer();
//let cpuboard = testCPU.getBoard();

testCPU.placeShips();

testCPU.setEnemyName('test');
testPlayer.setEnemyName('CPU');

test.skip('CPU player initializes properly', () => {
    console.log(cpuboard.getOccupied());
});

test.skip('CPU player sends attacks properly', () => {
    const occupied = playerBoard.getOccupied();
    console.log(occupied);
    occupied.forEach(entry => testCPU.sendAttack());
    console.log(occupied);
});

test.skip('CPU player receives attacks properly', () => {
    console.log(testCPU.isAlive());
    const occupied = [...cpuboard.getOccupied()];
    occupied.forEach(entry => testPlayer.sendAttack(entry[0]));
    console.log(testCPU.isAlive());
});

