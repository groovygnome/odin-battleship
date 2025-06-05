import { createGameDirector } from './gameDirector.js'
import './styles.css'

const dom = (() => {
    let boardsContainer = document.querySelector('.board');
    let attackBoard = document.createElement('div');
    attackBoard.className = 'board';
    let defendBoard = document.createElement('div');
    defendBoard.className = 'board';
    let director = createGameDirector();

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


    const displayBoard = () => {
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
                attTile.id = j.toString() + i;
                attBoardRow.appendChild(attTile);
                attTile.addEventListener('click', () => { console.log(attTile.textContent) });

                let defTile = document.createElement('button');
                defTile.textContent = defendTiles[i][j];
                defTile.id = j.toString() + i;
                defBoardRow.appendChild(defTile);
                defTile.addEventListener('click', () => { console.log(defTile.textContent) });


            }
            attackBoard.appendChild(attBoardRow);
            defendBoard.appendChild(defBoardRow);
        }
        boardsContainer.appendChild(attackBoard);
        boardsContainer.appendChild(defendBoard);
    }
    displayBoard();
})();

