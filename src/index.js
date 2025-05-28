import { createPlayer } from './player'
import './styles.css'

const dom = (() => {
    let boardContainer = document.querySelector('.board');

    let tiles = [];
    let row = [];

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            row.push([i, j]);
        }
        tiles.push(row);
        row = [];
    }


    const displayBoard = () => {
        for (let i = 0; i < 10; i++) {
            let boardRow = document.createElement('div');
            boardRow.className = 'row';
            boardRow.id = 'row' + i;
            for (let j = 0; j < 10; j++) {
                let tile = document.createElement('div');
                tile.textContent = tiles[j][i];
                tile.id = j.toString() + i;
                boardRow.appendChild(tile);
                tile.addEventListener('click', () => { console.log(tile.textContent) });

            }
            boardContainer.appendChild(boardRow);
        }
        console.log(tiles[0][1]);

    }
    displayBoard();
})();
