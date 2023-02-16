function checkOneline() {
    let result = false; //最後結果
    let place = chooseHole[0];  //先確定一個標準
    let recode = -1;    //強力的邊(大於一個棋子的邊)
    for (let word = 0; word < 3; word++) {  //id的每個方向(共三個)
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
    updateButton();
    printPlayers();
    checkEnd();
    nowPlayer += 1;
    nowPlayer %= 3;
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

function printPlayers() {
    console.log(player0);
    console.log(player1);
    console.log(player2);
}

function checkEnd() {
    if (player0.length + player1.length + player2.length == 21) {
        gameOver();
    }
}

function gameOver() {
    gameContinue = false;
    let winner = nowPlayer;
    for (let i = 1; i < 3; i++) {
        if (players[winner].length < players[(nowPlayer + i) % 3])
            winner = (nowPlayer + i) % 3;
    }
    alert("Game Over!\nWinner is player" + winner);
}
