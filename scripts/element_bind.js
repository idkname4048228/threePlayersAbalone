// mark
function bindingMarks() {
    for (let row = 0; row < 9; row++) {
        var y = (100 - ((4 - row) * 10 * Math.sqrt(3))).toString(); //caculate the y axis
        for (let column = 0; column < 9 - (Math.abs(4 - row)); column++) {
            var x = (11 - (9 - (Math.abs(4 - row)))) * 10;  //caculate the x axis

            var tmpMin = ((3 >= row) ? 5 - row : 1);
            var tmpMax = ((3 >= row) ? 9 : 9 - (row - 4));  //id helper
            var id = (column + tmpMin).toString() + (9 - row).toString() + (tmpMax - column).toString();    //caculate the id place

            const mark = document.getElementById("mark-" + id);
            mark.addEventListener('mouseenter', () => { markEnter(mark) }, false);
            mark.addEventListener('mouseleave', () => { markLeave(mark) }, false);
            mark.addEventListener('click', () => { markClick(mark) }, false);
        }
    }
}

function markEnter(mark) {
    if (!gameContinue) return;
    let id = mark.getAttribute('id').slice(-3);
    if ((players[nowPlayer].includes(id)) && chooseHole.length < 3) {
        mark.setAttribute('stroke-opacity', '1');
    }
}

function markLeave(mark) {
    if (!gameContinue) return;
    if (mark.getAttribute('be-click') === '0')
        mark.setAttribute('stroke-opacity', '0');
}

function markClick(mark) {
    if (!gameContinue) return;
    let id = mark.getAttribute('id').slice(-3);
    if ((players[nowPlayer].includes(id)) && chooseHole.length < 3 && !chooseHole.includes(id)) {
        mark.setAttribute('be-click', (mark.getAttribute('be-click') === '0') ? '1' : '0');
        mark.setAttribute('stroke-opacity', '1');
        chooseHole.push(mark.getAttribute('id').slice(-3));
    } else {
        if (chooseHole.includes(mark.getAttribute('id').slice(-3))) {
            cancelChoose(mark.getAttribute('id').slice(-3));
        }
    }
    updateButton();
}

//button
function bindingButtons() {

    document.getElementById('end').addEventListener('click', function () {
        endButton();
    }, false);

    document.getElementById('restart').addEventListener('click', function () {
        restart();
    }, false);

    document.getElementById('left-up').addEventListener('click', function () {
        checkMove(1, 9, 2, 9, 11, 0);
        pieceMove(11);
    }, false);

    document.getElementById('right-up').addEventListener('click', function () {
        checkMove(0, 9, 1, 9, 110, 2);
        pieceMove(110);
    }, false);

    document.getElementById('left-middle').addEventListener('click', function () {
        checkMove(0, 1, 2, 9, -99, 1);
        pieceMove(-99);
    }, false);

    document.getElementById('right-middle').addEventListener('click', function () {
        checkMove(0, 9, 2, 1, 99, 1);
        pieceMove(99);
    }, false);

    document.getElementById('left-down').addEventListener('click', function () {
        checkMove(0, 1, 1, 1, -110, 2);
        pieceMove(-110);
    }, false);

    document.getElementById('right-down').addEventListener('click', function () {
        checkMove(1, 1, 2, 1, -11, 0);
        pieceMove(-11);
    }, false);

}
function endButton() {
    if (!gameContinue) return;
    gameOver();
}

function restart() {
    console.log("restart");
    players[0] = originalPieces[0];
    players[1] = originalPieces[1];
    players[2] = originalPieces[2];
    nowPlayer = 0;
    updatePiece();
    updateNowPlayer(nowPlayer);
    updateButton();
}