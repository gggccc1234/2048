var board = new Array();
var score = 0;
var hasConflicted = new Array();

$(document).ready(function () {
    newgame();
})

function newgame() {
    init();
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
            }
            else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }
    var countnum = 0;
    var randx = -1;
    var randy = -1;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                countnum++;
            }
        }
    }
    var randnum = parseInt(Math.floor(Math.random() * countnum));
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                if (randnum > 0) {
                    randnum--;
                }
                else if (randnum == 0) {
                    randx = i;
                    randy = j;
                    break;
                }
            }
        }
        if (randx != -1 && randy != -1) {
            break;
        }
    }
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    board[randx][randy] = randNumber;
    showNumberAnimation(randx, randy, randNumber);
    return true;
}

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 65: if (moveLeft()) {
            generateOneNumber();
            isgameover();
        }; break;
        case 87: if (moveUp()) {
            generateOneNumber();
            isgameover();
        }; break;
        case 68: if (moveRight()) {
            generateOneNumber();
            isgameover();
        }; break;
        case 83: if (moveDown()) {
            generateOneNumber();
            isgameover();
        }; break;
        default: break;
    }
})

function isgameover(){
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('gameover!');
}

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontalleft(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontalleft(i, k, j, board) && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    updateBoardView();
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockHorizontalup(k, i, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[k][j] && noBlockHorizontalup(k, i, j, board) && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    updateBoardView();
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >=0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k >j ; k--) {
                    if (board[i][k] == 0 && noBlockHorizontalright(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontalright(i, k, j, board) && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    updateBoardView();
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    for (var i = 2; i >=0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 3; k >i; k--) {
                    if (board[k][j] == 0 && noBlockHorizontaldown(k, i, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[k][j] && noBlockHorizontaldown(k, i, j, board) && hasConflicted[i][j] == false) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    updateBoardView();
    return true;
}
