const svg = document.getElementById('svg');
const holes = [];
var gameContinue = true;
var chooseHole = [];
var player0 = ["986", "876", "766", "995", "885", "775", "894", "784", "674"];
var player1 = ["629", "638", "647", "519", "528", "537", "418", "427", "436"];
var player2 = ["463", "362", "261", "353", "252", "151", "344", "243", "142"];
var players = [player0, player1, player2]
var nowPlayer = 0;
var moveDirection;
var gotPushPiece = [];
for (let row = 0; row < 9; row++) {
    holes.push([]);
    var y = (100 - ((4 - row) * 10 * Math.sqrt(3))).toString(); //caculate the y axis
    for (let cloumn = 0; cloumn < 9 - (Math.abs(4 - row)); cloumn++) {
        var tmpMin = ((3 >= row) ? 5 - row : 1);
        var tmpMax = ((3 >= row) ? 9 : 9 - (row - 4));  //id helper
        const hole = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        const mark = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        holes[row].push(hole);
        var x = (11 - (9 - (Math.abs(4 - row)))) * 10;  //caculate the x axis
        var id = (9 - row).toString() + (cloumn + tmpMin).toString() + (tmpMax - cloumn).toString();    //caculate the id place

        function setElementToHole(hole) {
            hole.setAttribute('id', "hole-" + id);
            hole.setAttribute('x', (x + (20 * cloumn)).toString().padStart(2, 0));
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
        function setElementToMark(mark) {
            mark.setAttribute('id', "mark-" + id);
            mark.setAttribute('x', (x + (20 * cloumn)).toString());
            mark.setAttribute('y', y);
            mark.setAttribute('stroke-opacity', '0');
            mark.setAttribute('be-click', '0');
            mark.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#select');
        }
        setElementToHole(hole);
        setElementToMark(mark);

        if (player0.includes(id)) setHoleToPlayerPiece(hole, 0);
        if (player1.includes(id)) setHoleToPlayerPiece(hole, 1);
        if (player2.includes(id)) setHoleToPlayerPiece(hole, 2);

        mark.addEventListener('mouseenter', () => { markEnter(mark) });
        mark.addEventListener('mouseleave', () => { markLeave(mark) });
        mark.addEventListener('click', () => { markClick(mark) });

        svg.appendChild(hole);
        svg.appendChild(mark);
    }
}

checkButton();

document.getElementById('end').addEventListener('click', function () {
    endButton();
}, false);

document.getElementById('right-up').addEventListener('click', function () {
    rightUp();
}, false);
document.getElementById('right-middle').addEventListener('click', function () {
    rightMiddle();
}, false);

document.getElementById('right-down').addEventListener('click', function () {
    rightDown();
}, false);

document.getElementById('left-up').addEventListener('click', function () {
    leftUp();
}, false);

document.getElementById('left-middle').addEventListener('click', function () {
    leftMiddle();
}, false);

document.getElementById('left-down').addEventListener('click', function () {
    leftDown();
}, false);

function rightUp() {
    checkRightUp();
    pieceMove(110);
}

function rightMiddle() {
    checkRightMiddle();
    pieceMove(9);
}

function rightDown() {
    checkRightDown();
    pieceMove(-101);
}

function leftUp() {
    checkLeftUp();
    pieceMove(101);
}

function leftMiddle() {
    checkLeftMiddle();
    pieceMove(-9);
}

function leftDown() {
    checkLeftDown();
    pieceMove(-110);
}
function pieceMove(val) {
    console.log("gotPush", gotPushPiece);
    let changePlayer = players[nowPlayer];
    for (let i = 0; i < chooseHole.length; i++) {
        let place = chooseHole[i];
        let number = parseInt(place, 10);
        number += val;
        changePlayer[changePlayer.indexOf(place)] = number.toString();
    }
    if (gotPushPiece.length != 0) {
        for (let i = gotPushPiece.length - 1; i >= 0; i--) {
            let id = gotPushPiece[i];
            for (let j = 1; j < 3; j++) {
                if (players[(nowPlayer + j) % 3].includes(id)) {
                    let number = parseInt(id, 10);
                    number += val;
                    if (checkOutOfBoundary(number.toString()))
                        players[(nowPlayer + j) % 3].splice(players[(nowPlayer + j) % 3].indexOf(id), 1);
                    else
                        players[(nowPlayer + j) % 3][players[(nowPlayer + j) % 3].indexOf(id)] = number.toString();
                }
            }
        }
        gotPushPiece = [];
    }
    cancelChoose(null);
    updatePiece();
    checkButton();
    printPlayers();
    checkEnd();
    nowPlayer += 1;
    nowPlayer %= 3;
}

function checkEnd() {
    if (player0.length + player1.length + player2.length == 21) {
        gameOver();
    }
}

function endButton() {
    gameOver();
}

function gameOver() {
    gameContinue = false;
    let winner = nowPlayer;
    for (let i = 1; i < 3; i++) {
        if (players[winner].length <= players[(nowPlayer + i) % 3].length)
            winner = (nowPlayer + i) % 3;
    }
    alert("Game Over!\nWinner is player" + winner);
}

function printPlayers() {
    console.log(player0);
    console.log(player1);
    console.log(player2);
}

function checkOutOfBoundary(id) {
    console.log(id.length);
    if (id.length !== 3) return true;
    for (let i = 0; i < id.length; i++) {
        if (id.slice(i, i + 1) == 0) return true;
        console.log(id.slice(i, i + 1) == 0);
    }
    return false;
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
    console.log(chooseHole);
    checkButton();
}

function checkOneline() {
    let result = false;
    let place = chooseHole[0];
    let recode = -1;
    for (let word = 0; word < 3; word++) {
        let tmp = true;
        for (let i = 1; i < chooseHole.length; i++) {
            tmp = tmp && (place.slice(word, word + 1) == chooseHole[i].slice(word, word + 1));
        }
        result = result || tmp;
        if (result && recode == -1) recode = word;
    }
    if (result && chooseHole.length == 2) {
        if (recode == 0) {
            if (Math.abs(parseInt(place.slice(1, 2), 10) - parseInt(chooseHole[1].slice(1, 2), 10)) != 1) result = false;
        }
        else {
            if (Math.abs(parseInt(place.slice(recode - 1, recode), 10) - parseInt(chooseHole[1].slice(recode - 1, recode), 10)) != 1) result = false;
        }
    }
    if (result && chooseHole.length == 3) {
        for (let i = 1; i < 3; i++) {
            if (recode == 0) {
                if (Math.abs(parseInt(place.slice(1, 2), 10) - parseInt(chooseHole[i].slice(1, 2), 10)) == 3) result = false;
            }
            else {
                if (Math.abs(parseInt(place.slice(recode - 1, recode), 10) - parseInt(chooseHole[i].slice(recode - 1, recode), 10)) == 3) result = false;
            }
        }

    }
    moveDirection = chooseHole.length > 1 ? recode : -1;
    return result;
}

function setHoleToEmpty(hole) {
    hole.setAttribute("fill", 'url(#hole-color)')
    hole.setAttribute('stroke', '#888888');
    hole.setAttribute('stroke-width', '1.5');
}

function updatePiece() {
    for (let row = 0; row < 9; row++) {
        for (let cloumn = 0; cloumn < 9 - (Math.abs(4 - row)); cloumn++) {
            var tmpMin = ((3 >= row) ? 5 - row : 1);
            var tmpMax = ((3 >= row) ? 9 : 9 - (row - 4));  //id helper
            var id = (9 - row).toString() + (cloumn + tmpMin).toString() + (tmpMax - cloumn).toString();    //caculate the id place
            let hole = document.querySelector("#hole-" + id.toString());

            setHoleToEmpty(hole);
            if (player0.includes(id)) setHoleToPlayerPiece(hole, 0);
            if (player1.includes(id)) setHoleToPlayerPiece(hole, 1);
            if (player2.includes(id)) setHoleToPlayerPiece(hole, 2);
        }
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

function checkButton() {
    let ways = [110, 9, -101, 101, -9, -110];
    let buttons = [document.querySelector("#right-up"), document.querySelector("#right-middle"), document.querySelector("#right-down"), document.querySelector("#left-up"), document.querySelector("#left-middle"), document.querySelector("#left-down")];
    let unavaiable = [null, null, null, null, null, null];
    if (!gameContinue || chooseHole.length === 0) {
        for (let i = 0; i < buttons.length; i++) {
            unavaiable[i] = true;
        }
    }
    else {
        unavaiable[0] = checkRightUp();
        unavaiable[1] = checkRightMiddle();
        unavaiable[2] = checkRightDown();
        unavaiable[3] = checkLeftUp();
        unavaiable[4] = checkLeftMiddle();
        unavaiable[5] = checkLeftDown();
    }

    for (let i = 0; i < 6; i++) {
        buttons[i].disabled = unavaiable[i];
    }
}
// 以下是檢查是否能動
function checkRightUp() {
    return checkMove(0, 9, 1, 9, 110, 2);
}

function checkRightMiddle() {
    return checkMove(1, 9, 2, 1, 9, 0);
}

function checkRightDown() {
    return checkMove(0, 1, 2, 1, -101, 1);
}

function checkLeftUp() {
    return checkMove(0, 9, 2, 9, 101, 1);
}

function checkLeftMiddle() {
    return checkMove(1, 1, 2, 9, -9, 0);
}

function checkLeftDown() {
    return checkMove(0, 1, 1, 1, -110, 2);
}

function checkMove(boundaryA, limitA, boundaryB, limitB, val, leadingNum) {
    gotPushPiece = [];
    if (!checkOneline()) return true;
    for (let i = 0; i < chooseHole.length; i++) {
        if (chooseHole[i].slice(boundaryA, boundaryA + 1) == limitA || chooseHole[i].slice(boundaryB, boundaryB + 1) == limitB) return true;   //檢查邊緣
        let place = parseInt(chooseHole[i], 10);
        let id = (place + val).toString();

        if (players[nowPlayer].includes(id) && !chooseHole.includes(id)) return true;   //檢查撞自己
        if (chooseHole.includes(id)) continue;
        let otherPiece = 0;

        if (players[(nowPlayer + 1) % 3].includes(id) || players[(nowPlayer + 2) % 3].includes(id)) {
            if (moveDirection == leadingNum) {
                gotPushPiece.push(id);
                otherPiece += 1;
                for (let j = 0; j < 2; j++) {
                    id = (parseInt(id, 10) + val).toString();
                    if (players[nowPlayer].includes(id)) return true;   //檢查撞自己
                    if (players[(nowPlayer + 1) % 3].includes(id) || players[(nowPlayer + 2) % 3].includes(id)) {
                        otherPiece += 1;
                        gotPushPiece.push(id);
                    } else break;
                    // if (id.slice(boundaryA, boundaryA + 1) == limitA || id.slice(boundaryB, boundaryB) == limitB) break;  //檢查邊緣
                    if (otherPiece >= chooseHole.length) return true;       //看推不推得動

                }
            } else return true;
        }
    }
    return false;
}