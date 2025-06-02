import { createPlayer, createCPUPlayer } from './player.js'

export function createGameDirector() {
    let player1;
    let player2;
    let roundCounter = 0;
    let inPlay = true;

    function init() {
        let name1 = prompt(`Hi! Please give a name for Player 1 :`);
        player1 = createPlayer(name);
        let againstCPU = prompt(`Would you like to fight a CPU?`);
        let name2;
        if (againstCPU.toLowerCase() === 'yes') {
            name2 = 'CPU'
            player2 = createCPUPlayer();
        } else {
            name2 = prompt(`Please give a name for Player 2`);
            player2 = createPlayer(name2)
        }
        player1.setEnemyName(player2);
        console.log(`Now, you will place your ships`);
        player1.placeShips();
        player2.placeShips();
    }

    function playRound(coordinates) {
        if (inPlay) {
            let currPlayer = roundCounter % 2 === 0 ? player1 : player2;
            if (currPlayer === player2 && player2.getName == 'CPU') {
                currPlayer.sendAttack();
            }
            currPlayer.sendAttack(coordinates);
            roundCounter++;
            if (!player1.isAlive()) {
                console.log(`${player2.getName()} wins!`);
                inPlay = false;
            } else if (!player2.isAlive()) {
                console.log(`${player1.getName()} wins!`);
                inPlay = false;
            }
        } else {
            console.log(`Game already ended. Refresh to start a new match`);
        }
    }

    function getInPlay() {
        return inPlay;
    }

    return { init, playRound, getInPlay };
}
