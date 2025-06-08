import { createPlayer, createCPUPlayer } from './player.js'

export function createGameDirector() {
    let player1;
    let player2;
    let shipCoords = [];
    let roundCounter = 0;
    let inPlay = false;
    let gameOver = false;

    function init(name1, name2, againstCPU) {
        player1 = createPlayer(name1);
        if (againstCPU.toLowerCase() === 'yes') {
            player2 = createCPUPlayer();
        } else {
            player2 = createPlayer(name2);
        }
        player1.setEnemyName(name2);
        player2.setEnemyName(name1);
        //    console.log(`Now, you will place your ships`);
        //    player1.placeShips();
        //    player2.placeShips();
        //    inPlay = true;
    }

    function receiveCoordinates(coordinates, commType) {
        if (inPlay && !gameOver && commType === 'attack') {
            playRound(coordinates);
        } else if (!inPlay && !gameOver && commType === 'defend') {
            if (coordinates === 'cancel') {
                shipCoords.pop();
                return false;
            }
            shipCoords.push(coordinates);
            if ((shipCoords.length === 10 && player2.getName() === 'CPU')) {
                player1.placeShips(shipCoords);
                player2.placeShips();
                inPlay = true;
            } else if (shipCoords.length === 20 && !(player2.getName() === 'CPU')) {
                player1.placeShips(shipCoords.slice(0, 10));
                player2.placeShips(shipCoords.slice(10));
                inPlay = true;
            }
        } else if (!inPlay && gameOver) {
            return `Game already ended. Refresh to start a new match`;
        }
    } //maybe redo this

    function playRound(coordinates) {
        let currPlayer = roundCounter % 2 === 0 ? player1 : player2;
        currPlayer.sendAttack(coordinates);
        roundCounter++;
        if (player2.getName() == 'CPU') {
            player2.sendAttack();
            roundCounter++;
        }

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

    function getGameState() {
        return [inPlay, gameOver];
    }

    function getSpaces(player) {
        if (player == '1') {
            return player1.getSpaces();
        } else if (player == '2') {
            return player2.getSpaces();
        }
    }

    return { init, playRound, getGameState, receiveCoordinates, getSpaces };
}
