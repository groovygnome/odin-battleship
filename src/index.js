import { createGameDirector } from './gameDirector.js'
import './styles.css'

const dom = (() => {
    let boardsContainer = document.querySelector('.board');
    let attackBoard = document.createElement('div');
    attackBoard.className = 'board';
    attackBoard.id = 'attboard'
    let defendBoard = document.createElement('div');
    defendBoard.className = 'board';
    defendBoard.id = 'defboard';
    let director = createGameDirector();
    let shipLengths = [1, 2, 2, 3, 4, 1, 2, 2, 3, 4];
    let end = false;
    let roundCounter = 0;

    let attackTiles = [];
    let defendTiles = [];
    let row = [];

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            row.push([i, j]);
        }
        attackTiles.push(row);
        defendTiles.push(row);
        row = [];
    }

    const init = () => {
        let name1 = prompt(`Hi! Please give a name for Player 1 :`);
        let againstCPU = prompt(`Would you like to fight a CPU?`);
        let name2;
        if (againstCPU.toLowerCase() === 'yes') {
            name2 = 'CPU'
        } else {
            name2 = prompt(`Please give a name for Player 2 :`);
        }
        director.init(name1, name2, againstCPU)
        alert(`Now, you will place your ships`);
    }


    const displayBoard = (player = null) => {
        for (let i = 0; i <= 9; i++) {
            let attBoardRow = document.createElement('div');
            attBoardRow.className = 'row';
            attBoardRow.id = 'attrow' + i;

            let defBoardRow = document.createElement('div');
            defBoardRow.className = 'row';
            defBoardRow.id = 'defrow' + i;

            for (let j = 0; j < 10; j++) {
                let attTile = document.createElement('button');
                attTile.textContent = attackTiles[i][j];
                attTile.id = `att` + i.toString() + j;
                attBoardRow.appendChild(attTile);
                attTile.addEventListener('click', () => {
                    let gameState = director.getGameState();
                    if (gameState[0] && !gameState[1]) {
                        let coords = attTile.textContent.split(',').map((char) => Number(char));
                        director.receiveCoordinates(coords, 'attack');
                        roundCounter % 2 == 0 ? displayBoard('1') : displayBoard('2');
                        setTimeout(2000);
                        roundCounter++;
                    }
                });

                let defTile = document.createElement('button');
                defTile.textContent = defendTiles[i][j];
                defTile.id = `def` + i.toString() + j;
                defBoardRow.appendChild(defTile);
                defTile.addEventListener('click', () => defTileLogic(defTile));
            }
            attackBoard.appendChild(attBoardRow);
            defendBoard.appendChild(defBoardRow);
        }
        if (player) {
            let spaces = director.getSpaces(player);
            let attackSpaces = spaces[0];
            let defendSpaces = spaces[1];
            let occupied = spaces[2];

            attackSpaces.forEach((space) => {
                if (space[1]) {
                    document.querySelector(`#att${space[0][0]}${space[0][1]}`).className = 'hit';
                } else {
                    document.querySelector(`#att${space[0][0]}${space[0][1]}`).className = 'miss';
                }
            });
            occupied.forEach((space) => {
                document.querySelector(`#def${space[0][0]}${space[0][1]}`).className = 'occupied';
            });
            defendSpaces.forEach((space) => {
                if (space[1]) {
                    document.querySelector(`#def${space[0][0]}${space[0][1]}`).className = 'hit';
                } else {
                    document.querySelector(`#def${space[0][0]}${space[0][1]}`).className = 'miss';
                }
            });

        }
        boardsContainer.appendChild(attackBoard);
        boardsContainer.appendChild(defendBoard);
    }

    function defTileLogic(defTile) {
        let gameState = director.getGameState();
        if (!gameState[0] && !gameState[1]) {
            let coords = defTile.textContent.split(',').map((char) => Number(char));
            if (defTile.className == '' && !end) {
                defTile.className = 'start-coord';
                director.receiveCoordinates(coords, 'defend');
                let diff = shipLengths.pop();
                let endCoordinates = [[coords[0] - diff, coords[1]], [coords[0] + diff, coords[1]], [coords[0], coords[1] - diff], [coords[0], coords[1] + diff]];
                endCoordinates = endCoordinates.filter(endCoordinate => (endCoordinate[0] >= 0 && endCoordinate[0] <= 9 && endCoordinate[1] >= 0 && endCoordinate[1] <= 9));
                endCoordinates = endCoordinates.filter((endCoordinate) => {
                    let occupiedTiles = getTiles(coords, endCoordinate, 'def');
                    if (occupiedTiles.every((tile) => tile.className != 'occupied')) {
                        return true;
                    }
                });
                endCoordinates = endCoordinates.map((entry => entry.join('')));
                endCoordinates.forEach((coord) => document.querySelector(`#def${coord}`).className = 'potential-endcoord');
                end = true;
            } else if (defTile.className == 'potential-endcoord' && end) {
                let startTile = document.querySelector('.start-coord');
                let startCoords = startTile.textContent.split(',').map((char) => Number(char));

                let occupiedTiles = getTiles(startCoords, coords, 'def');
                director.receiveCoordinates(coords, 'defend');
                occupiedTiles.forEach((tile) => tile.className = 'occupied');
                startTile.className = 'occupied';

                let endTiles = document.querySelector('#defboard').querySelectorAll('.potential-endcoord');
                endTiles.forEach((tile) => tile.className = '');

                end = false;
            } else if (defTile.className == 'occupied' && !end) {
                alert('This space is already used');
            } else if (defTile.className == '.start-coord') {
                director.receiveCoordinates('cancel', 'defend');
                document.querySelector('.start-coord').className = '';
            }

        }
    }

    function getTiles(startCoordinates, endCoordinates, prefix) {
        let tiles = [];
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
            let tile = i === 0
                ? document.querySelector(`#${prefix}${startCoordinates[i]}${startCoordinates[j] - diff}`)
                : document.querySelector(`#${prefix}${startCoordinates[j] - diff}${startCoordinates[i]}`);
            tiles.push(tile);
            diff = diff > 0 ? diff - 1 : diff + 1;
        }
        return tiles;
    }


    init();
    displayBoard();
})();

