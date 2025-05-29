import { createPlayer, createCPUPlayer } from './player.js'

export function createGameDirector() {
    let player1;
    let player2;

    function init() {
        let name = prompt(`Hi! Please give a name for Player 1 :`);
        player1 = createPlayer(name);
        let againstCPU = prompt(`Would you like to fight a CPU?`);
        if (againstCPU === 'yes') player2 = createCPUPlayer();
        player2.placeShips();
        player1.setEnemyName('CPU');
        console.log(`Now, you will place your ships`);
        player1.placeShips();
    }

    return { init };
}
