import { createGameboard } from './gameBoard.js'
import { pubsub } from './pubsub.js'

export function createPlayer(name) {
    let gameBoard = createGameboard();
    let enemyName = null;


    pubsub.subscribe(`attack${name}`, (coordinates) => { receiveAttack(coordinates) });

    function setEnemyName(enemy) {
        enemyName = enemy;
    }

    function sendAttack(coordinates) {
        pubsub.publish(`attack${enemyName}`, (coordinates));
    }

    function receiveAttack(coordinates) {
        gameBoard.receiveAttack(coordinates);
    }

    return { setEnemyName, sendAttack }


}
