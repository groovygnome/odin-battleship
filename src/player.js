import { createGameBoard } from './gameBoard.js'
import { createBattleship } from './battleship.js'
import { pubsub } from './pubsub.js'

export function createPlayer(name) {
    let gameBoard = createGameBoard();
    let enemyName = null;
    let ships = [];
    ships.push(createBattleship(5), createBattleship(4), createBattleship(3), createBattleship(3), createBattleship(2));

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

    function placeShips() {
        ships.forEach((ship) => {
            console.log(`Please place a ship of size ${ship.getLength()}`);
            const startCoordinateX = Number(prompt(`Enter the X coordinate of the starting position`));
            const startCoordinateY = Number(prompt(`Enter the Y coordinate of the starting position`));
            let startCoordinate = [startCoordinateX, startCoordinateY];
            let diff = ship.getLength() - 1;

            let endCoordinates = [[startCoordinateX - diff, startCoordinateY], [startCoordinateX + diff, startCoordinateY], [startCoordinateX, startCoordinateY - diff], [startCoordinateX, startCoordinateY + diff]];
            console.log(endCoordinates);
            endCoordinates = endCoordinates.filter(endCoordinate => (endCoordinate[0] >= 0 && endCoordinate[0] <= 9 && endCoordinate[1] >= 0 && endCoordinate[1] <= 9));
            console.log(endCoordinates);
            console.log(`Select from these coordinates, these are where your ship can be placed to.`);
            let num = 1;
            endCoordinates.forEach((coordinate) => {
                console.log(`${num} : ${coordinate}`)
                num++;
            })
            let index = Number(prompt(`Select a coordinate.`));
            index--;
            let endCoordinate = endCoordinates[index];
            gameBoard.placeShip(ship, startCoordinate, endCoordinate);

        });

    }

    function isAlive() {
        if (gameBoard.getSunk() < 5) {
            return true;
        } else {
            return false;
        }
    }

    function getName() { return name; }


    return { setEnemyName, sendAttack, placeShips, getName }


}

export function createCPUPlayer() {
    let gameBoard = createGameBoard();
    let enemyName = null;
    let ships = [];
    ships.push(createBattleship(5), createBattleship(4), createBattleship(3), createBattleship(3), createBattleship(2));

    pubsub.subscribe(`attackCPU`, (coordinates) => { receiveAttack(coordinates) });


    function setEnemyName(enemy) {
        enemyName = enemy;
    }

    function sendAttack() {
        let coordinateX = Math.floor(Math.random() * 10);
        let coordinateY = Math.floor(Math.random() * 10);
        let coordinates = [coordinateX, coordinateY];
        pubsub.publish(`attack${enemyName}`, (coordinates));
    }

    function receiveAttack(coordinates) {
        gameBoard.receiveAttack(coordinates);
    }

    function placeShips() {
        ships.forEach((ship) => {
            let coordinateX = Math.floor(Math.random() * 10);
            let coordinateY = Math.floor(Math.random() * 10);
            let startCoordinate = [coordinateX, coordinateY];
            let diff = ship.getLength() - 1;

            let endCoordinates = [[coordinateX - diff, coordinateY], [coordinateX + diff, coordinateY], [coordinateX, coordinateY - diff], [coordinateX, coordinateY + diff]]
            endCoordinates = endCoordinates.filter(endCoordinate => (endCoordinate[0] >= 0 && endCoordinate[0] <= 9 && endCoordinate[1] >= 0 && endCoordinate[1] <= 9));

            let endCoordinate = endCoordinates[Math.floor(Math.random() * endCoordinates.length)];

            gameBoard.placeShip(ship, startCoordinate, endCoordinate);

        });

    }

    function isAlive() {
        if (gameBoard.getSunk() < 5) {
            return true;
        } else {
            return false;
        }
    }


    function getName() { return 'CPU'; }

    return { setEnemyName, sendAttack, placeShips, isAlive, getName }


}
