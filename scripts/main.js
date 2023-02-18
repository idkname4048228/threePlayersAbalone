
const svg = document.getElementById('svg');
console.log(svg);
const holes = [];
var gameContinue = true;
var chooseHole = [];
var originalPieces = [["896", "786", "676", "995", "885", "775", "984", "874", "764"], ["269", "368", "467", "159", "258", "357", "148", "247", "346"], ["643", "632", "621", "533", "522", "511", "434", "423", "412"]];
var player0 = ["896", "786", "676", "995", "885", "775", "984", "874", "764"];
var player1 = ["269", "368", "467", "159", "258", "357", "148", "247", "346"];
var player2 = ["643", "632", "621", "533", "522", "511", "434", "423", "412"];
var players = [player0, player1, player2];
var nowPlayer = 0;
var moveDirection;
var gotPushPiece = [];

generateBoard();
bindingMarks();
bindingButtons();
updatePiece();
updateButton();