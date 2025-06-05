import { createGameBoard } from './gameBoard.js'
import { createBattleship } from './battleship.js'
import { pubsub } from './pubsub.js'

export function createPlayer(name) {
    let occupied = [];
    let sunk = 0;
    let enemyName = null;
    let ships = [];
    let defendSpaces = [];
    let attackSpaces = [];
    ships.push(createBattleship(5), createBattleship(4), createBattleship(3), createBattleship(3), createBattleship(2));

    pubsub.subscribe(`attack${name}`, (coordinates) => { receiveAttack(coordinates) });
    pubsub.subscribe(`${name}AttackResults`, ([coordinates, result]) => { updateAttackBoard(coordinates, result) });

    function setEnemyName(enemy) {
        enemyName = enemy;
    }

    function updateAttackBoard(coordinates, result) {
        attackSpaces.push(coordinates, result);
    }

    function sendAttack(coordinates) {
        pubsub.publish(`attack${enemyName}`, (coordinates));
    }

    function receiveAttack(coordinates) {
        let result;
        let space = occupied.findIndex(entry => entry[0].toString() === coordinates.toString());

        if (space != -1) {
            let ship = occupied[space][1];
            ship.hit();
            occupied.splice(space, 1);
            if (ship.isSunk()) sunk++;
            if (sunk === 5) console.log('All ships sunk :(');
            result = true;
        } else {
            result = false;
        }
        defendSpaces.push(coordinates, result);
        pubsub.publish(`${enemyName}AttackResults`, ([coordinates, result]));
    }

    function placeShips() {
        ships.forEach((ship) => {
            let promptStart = `You are placing a ship of size ${ship.getLength()}.`
            const startCoordinateX = Number(prompt(`${promptStart}\nEnter the X coordinate of the starting position.`));
            const startCoordinateY = Number(prompt(`${promptStart}\nEnter the Y coordinate of the starting position.`));
            let startCoordinate = [startCoordinateX, startCoordinateY];
            let diff = ship.getLength() - 1;

            let endCoordinates = [[startCoordinateX - diff, startCoordinateY], [startCoordinateX + diff, startCoordinateY], [startCoordinateX, startCoordinateY - diff], [startCoordinateX, startCoordinateY + diff]];
            endCoordinates = endCoordinates.filter(endCoordinate => (endCoordinate[0] >= 0 && endCoordinate[0] <= 9 && endCoordinate[1] >= 0 && endCoordinate[1] <= 9));
            let selectPrompt = `Select from these coordinates, these are where your ship can be placed to.`;
            let num = 1;
            endCoordinates.forEach((coordinate) => {
                selectPrompt += `\n${num} : ${coordinate}`;
                num++;
            });
            let index = Number(prompt(selectPrompt));
            index--;
            let endCoordinate = endCoordinates[index];
            placeShip(ship, startCoordinate, endCoordinate);

        });

    }

    function placeShip(ship, startCoordinates, endCoordinates) {
        let length = ship.getLength();
        let i;
        let j;
        if (startCoordinates[0] === endCoordinates[0]) {
            i = 0;
            j = 1;
        } else if (startCoordinates[1] === endCoordinates[1]) {
            i = 1;
            j = 0;
        } else {
            return false;
        }
        let diff = startCoordinates[j] - endCoordinates[j];
        if (Math.abs(diff) === length - 1) {
            while (diff != 0) {
                let occupiedEntry = i === 0
                    ? [[startCoordinates[i], startCoordinates[j] - diff], ship]
                    : [[startCoordinates[j] - diff, startCoordinates[i]], ship];
                occupied.push(occupiedEntry);
                diff = diff > 0 ? diff - 1 : diff + 1;
            }
            occupied.push([startCoordinates, ship]);
        } else {
            return false;
        }

    }

    function isAlive() {
        if (sunk < 5) {
            return true;
        } else {
            return false;
        }
    }

    function getSpaces() {
        return { attackSpaces, defendSpaces };
    }

    function getName() { return name; }

    return { setEnemyName, sendAttack, placeShips, isAlive, getName, getSpaces }


}

export function createCPUPlayer() {
    const cpuPlayer = createPlayer('CPU');

    function sendAttack() {
        let coordinateX = Math.floor(Math.random() * 10);
        let coordinateY = Math.floor(Math.random() * 10);
        let coordinates = [coordinateX, coordinateY];
        pubsub.publish(`attack${enemyName}`, (coordinates));
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

            cpuPlayer.placeShip(ship, startCoordinate, endCoordinate);

        });

    }

    return { ...cpuPlayer, sendAttack, placeShips }


}
