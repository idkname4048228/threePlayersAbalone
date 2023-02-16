function setElementToHole(hole, id, x, y, column) {
    hole.setAttribute('id', "hole-" + id);
    hole.setAttribute('x', (x + (20 * column)).toString().padStart(2, 0));
    hole.setAttribute('y', y.toString());
    hole.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#hole');
    hole.setAttribute("fill", 'url(#hole-color)')
    hole.setAttribute('stroke', '#888888');
    hole.setAttribute('stroke-width', '1.5');
}
function setHoleToPlayerPiece(hole, num) {
    const map = ["22bc22", "bc2222", "2222bc"]
    hole.setAttribute("fill", 'url(#player' + num + '-color)')
    hole.setAttribute('stroke', map[num]);
    hole.setAttribute('stroke-width', '0.5');
}
function setElementToMark(mark, id, x, y, column) {
    mark.setAttribute('id', "mark-" + id);
    mark.setAttribute('x', (x + (20 * column)).toString());
    mark.setAttribute('y', y);
    mark.setAttribute('stroke-opacity', '0');
    mark.setAttribute('be-click', '0');
    mark.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#select');
}

function setHoleToEmpty(hole) {
    hole.setAttribute("fill", 'url(#hole-color)')
    hole.setAttribute('stroke', '#888888');
    hole.setAttribute('stroke-width', '1.5');
}

function generateBoard(){
    for (let row = 0; row < 9; row++) {
        var y = (100 - ((4 - row) * 10 * Math.sqrt(3))).toString(); //caculate the y axis
        for (let column = 0; column < 9 - (Math.abs(4 - row)); column++){
            var x = (11 - (9 - (Math.abs(4 - row)))) * 10;  //caculate the x axis

            const hole = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            const mark = document.createElementNS('http://www.w3.org/2000/svg', 'use');

            var tmpMin = ((3 >= row) ? 5 - row : 1);
            var tmpMax = ((3 >= row) ? 9 : 9 - (row - 4));  //id helper
            var id = (column + tmpMin).toString() + (9 - row).toString() + (tmpMax - column).toString();    //caculate the id place

            setElementToHole(hole, id, x, y, column);
            setElementToMark(mark, id, x, y, column);

            svg.appendChild(hole);
            svg.appendChild(mark);
        }
    }
}

function updatePiece() {    // 棋子渲染
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9 - (Math.abs(4 - row)); column++) {
            var tmpMin = ((3 >= row) ? 5 - row : 1);
            var tmpMax = ((3 >= row) ? 9 : 9 - (row - 4));  //id helper
            var id = (column + tmpMin).toString() + (9 - row).toString() + (tmpMax - column).toString();    //caculate the id place
            let hole = document.querySelector("#hole-" + id.toString());

            setHoleToEmpty(hole);
            if (player0.includes(id)) setHoleToPlayerPiece(hole, 0);
            if (player1.includes(id)) setHoleToPlayerPiece(hole, 1);
            if (player2.includes(id)) setHoleToPlayerPiece(hole, 2);
        }
    }
}

function updateButton() {    //button 是否可按
    let ways = [110, 9, -101, 101, -9, -110];
    let buttons = [document.querySelector("#right-up"), document.querySelector("#right-middle"), document.querySelector("#right-down"), document.querySelector("#left-up"), document.querySelector("#left-middle"), document.querySelector("#left-down")];
    let unavaiable = [null, null, null, null, null, null];
    if (!gameContinue || chooseHole.length === 0) {
        for (let i = 0; i < buttons.length; i++) {
            unavaiable[i] = true;
        }
    }
    else {
        unavaiable[0] = checkMove(1, 9, 2, 9, ways[0], 0);
        unavaiable[1] = checkMove(0, 9, 1, 9, ways[1], 2);
        unavaiable[2] = checkMove(0, 1, 2, 9, ways[2], 1);
        unavaiable[3] = checkMove(0, 9, 2, 1, ways[3], 1);
        unavaiable[4] = checkMove(0, 1, 1, 1, ways[4], 2);
        unavaiable[5] = checkMove(1, 1, 2, 1, ways[5], 0);
    }

    for (let i = 0; i < 6; i++) {
        buttons[i].disabled = unavaiable[i];
    }
}

function cancelChoose(id) {
    if (id) {
        let mark = document.querySelector("#mark-" + id);
        mark.setAttribute('be-click', (mark.getAttribute('be-click') === '0') ? '1' : '0');
        mark.setAttribute('stroke-opacity', '0');
        chooseHole.splice(chooseHole.indexOf(mark.getAttribute('id').slice(-3)), 1);
    }
    else {
        const times = chooseHole.length;
        for (let i = 0; i < times; i++) {
            let place = chooseHole[0];
            let mark = document.querySelector("#mark-" + place);
            mark.setAttribute('be-click', (mark.getAttribute('be-click') === '0') ? '1' : '0');
            mark.setAttribute('stroke-opacity', '0');
            chooseHole.splice(chooseHole.indexOf(mark.getAttribute('id').slice(-3)), 1);

        }
    }

}