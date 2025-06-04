import { createPlayer, createCPUPlayer } from './player.js'

export function createGameDirector() {
    let player1;
    let player2;
    let shipCoords = [];
    let roundCounter = 0;
    let inPlay = false;
    let gameOver = false;

    function init() {
        let name1 = prompt(`Hi! Please give a name for Player 1 :`);
        player1 = createPlayer(name1);
        let againstCPU = prompt(`Would you like to fight a CPU?`);
        let name2;
        if (againstCPU.toLowerCase() === 'yes') {
            name2 = 'CPU'
            player2 = createCPUPlayer();
        } else {
            name2 = prompt(`Please give a name for Player 2 :`);
            player2 = createPlayer(name2);
        }
        player1.setEnemyName(name2);
        player2.setEnemyName(name1);
        //    console.log(`Now, you will place your ships`);
        //    player1.placeShips();
        //    player2.placeShips();
        //    inPlay = true;
    }

    function receiveCoordinates(coordinates) {
        if (inPlay && !gameOver) {
            playRound(coordinates);
        } else if (!inPlay && !gameOver) {
            shipCoords.push(coordinates);
            if (ships.length === 10) {
                player1.placeShips(shipCoords);
            }
        } else if (!inPlay && gameOver) {
            return `Game already ended. Refresh to start a new match`;
        }
    } //maybe redo this

    function playRound(coordinates) {
        let currPlayer = roundCounter % 2 === 0 ? player1 : player2;
        if (currPlayer === player2 && player2.getName == 'CPU') {
            currPlayer.sendAttack();
        }
        currPlayer.sendAttack(coordinates);
        roundCounter++;
        if (!player1.isAlive()) {
            console.log(`${player2.getName()} wins!`);
            gameOver = true;
            inPlay = false;
        } else if (!player2.isAlive()) {
            console.log(`${player1.getName()} wins!`);
            gameOver = true;
            inPlay = false;
        }
    }

    function getInPlay() {
        return inPlay;
    }

    return { init, playRound, getInPlay, receiveCoordinates };
}
