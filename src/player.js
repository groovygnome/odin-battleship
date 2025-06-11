
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
        attackSpaces.push([coordinates, result]);
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
        console.log(result);
        defendSpaces.push([coordinates, result]);
        pubsub.publish(`${enemyName}AttackResults`, ([coordinates, result]));
    }

    function placeShips(shipCoords) {
        ships.forEach((ship) => {
            let startCoordinate = shipCoords.shift();
            //let diff = ship.getLength() - 1;

            //let endCoordinates = [[startCoordinateX - diff, startCoordinateY], [startCoordinateX + diff, startCoordinateY], [startCoordinateX, startCoordinateY - diff], [startCoordinateX, startCoordinateY + diff]];
            //endCoordinates = endCoordinates.filter(endCoordinate => (endCoordinate[0] >= 0 && endCoordinate[0] <= 9 && endCoordinate[1] >= 0 && endCoordinate[1] <= 9));
            //let selectPrompt = `Select from these coordinates, these are where your ship can be placed to.`;
            //let num = 1;
            //endCoordinates.forEach((coordinate) => {
            //    selectPrompt += `\n${num} : ${coordinate}`;
            //    num++;
            //});
            //let index = Number(prompt(selectPrompt));
            //index--;
            let endCoordinate = shipCoords.shift();
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
        return { attackSpaces, defendSpaces, occupied };
    }

    function getName() { return name; }

    function getShips() { return ships; }

    function getEnemyName() { return enemyName; };

    return { setEnemyName, getEnemyName, sendAttack, placeShips, isAlive, getName, getSpaces, getShips, placeShip }


}

export function createCPUPlayer() {
    const cpuPlayer = createPlayer('CPU');
    const ships = cpuPlayer.getShips();
    const hit = [];


    function sendAttack() {
        while (true) {
            let coordinateX = Math.floor(Math.random() * 10);
            let coordinateY = Math.floor(Math.random() * 10);
            let coordinates = [coordinateX, coordinateY];
            if (!hit.some(([x, y]) => x === coordinates[0] && y === coordinates[1])) {
                pubsub.publish(`attack${cpuPlayer.getEnemyName()}`, (coordinates));
                hit.push(coordinates);
                return;
            }
        }
    }

    function placeShips() {
        ships.forEach((ship) => {
            let occupied = cpuPlayer.getSpaces().occupied;
            let coordinateX;
            let coordinateY;
            while (true) {
                coordinateX = Math.floor(Math.random() * 10);
                coordinateY = Math.floor(Math.random() * 10);
                if (!occupied.some((entry) => entry[0][0] === coordinateX && entry[0][1] === coordinateY)) {
                    break;
                }
            }
            let startCoordinate = [coordinateX, coordinateY];
            let diff = ship.getLength() - 1;

            let endCoordinates = [[coordinateX - diff, coordinateY], [coordinateX + diff, coordinateY], [coordinateX, coordinateY - diff], [coordinateX, coordinateY + diff]]
            endCoordinates = endCoordinates.filter(endCoordinate => (endCoordinate[0] >= 0 && endCoordinate[0] <= 9 && endCoordinate[1] >= 0 && endCoordinate[1] <= 9));
            console.log(`endCoords before: ${endCoordinates}`);

            endCoordinates = endCoordinates.filter((endCoordinate) => {
                let occupiedCoords = checkCoords(startCoordinate, endCoordinate);
                console.log(`occupiedCoords: ${occupiedCoords}`);
                let result = occupiedCoords.every((coord) =>
                    !occupied.some((occCoord) => {
                        console.log(occCoord[0][0] === coord[0] && occCoord[0][1] === coord[1]);
                        console.log(`${occCoord[0][0]} === ${coord[0]} && ${occCoord[0][1]} === ${coord[1]}`)
                    }));
                console.log(result);
                return result;
            });

            console.log(`endCoordinates after: ${endCoordinates}`);

            let endCoordinate = endCoordinates[Math.floor(Math.random() * endCoordinates.length)];

            console.log(`${startCoordinate} ${endCoordinate}`);

            cpuPlayer.placeShip(ship, startCoordinate, endCoordinate);

        });

    }

    function checkCoords(startCoordinates, endCoordinates) {
        let coords = [];
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
        while (diff != 0) {
            let coord = i === 0
                ? [[startCoordinates[i], startCoordinates[j] - diff]]
                : [[startCoordinates[j] - diff, startCoordinates[i]]];
            coords.push(coord);
            diff = diff > 0 ? diff - 1 : diff + 1;
        }
        coords.push(startCoordinates);
        return coords;
    }

    return { ...cpuPlayer, sendAttack, placeShips }


}
