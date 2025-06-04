import { createGameDirector } from './gameDirector.js'
import './styles.css'

const dom = (() => {
    let boardsContainer = document.querySelector('.board');
    let attackBoard = document.createElement('div');
    let defendBoard = document.createElement('div');

    let attackTiles = [];
    let row = [];

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            row.push([i, j]);
        }
        attackTiles.push(row);
        row = [];
    }


    const displayBoard = () => {
        for (let i = 9; i >= 0; i--) {
            let boardRow = document.createElement('div');
            boardRow.className = 'row';
            boardRow.id = 'row' + i;
            for (let j = 0; j < 10; j++) {
                let tile = document.createElement('button');
                tile.textContent = tiles[i][j];
                tile.id = j.toString() + i;
                boardRow.appendChild(tile);
                tile.addEventListener('click', () => { console.log(tile.textContent) });

            }
            boardContainer.appendChild(boardRow);
        }
    }
    displayBoard();
})();

let director = createGameDirector();
director.init();
