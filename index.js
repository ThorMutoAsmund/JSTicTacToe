// A $( document ).ready() block.
$( document ).ready(function() {
  var computerStarts = false;
  var board;
  var thinking = false;
  var gameStarted = true, winner = 0;
  $('.field').on('click', e => {
    var i = parseInt($(e.target).attr('id').substring(1));
    if (!thinking && gameStarted && board[i] == 0) {
      board[i] = computerStarts ? 2 : 1;
      $(e.target).text(board[i] == 1 ? 'O' : 'X');
      checkWin();
      if (gameStarted) {
        doMove();
      }
    }
  });
  $('#youStartRadio').on('click', () => {
    computerStarts = false;
    $('#computerStartsRadio').prop('checked', false);
  });
  $('#computerStartsRadio').on('click', () => {
    computerStarts = true;
    $('#youStartRadio').prop('checked', false);
  });
  $('#restartButton').on('click', () => {
    restartGame();
  });


  function restartGame() {
    console.log('Clearing game...');
    board = [0,0,0,0,0,0,0,0,0];
    $('.field').text('');
    gameStarted = true;
    winner = 0;
    $('#resultMessage').text('');

    if (computerStarts) {
      doMove();
    }
  }

  function checkTurnWon(b, turn) {
    const rows = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (var r in rows) {
      var row = rows[r];
      if (b[row[0]] == turn && b[row[1]] == turn && b[row[2]] == turn) {
        return true;
      }
    }
    return false;
  }

  function checkWin() {
    var winner = -1
    if (checkTurnWon(board, 1)) {
      winner = 1;
    }
    else if (checkTurnWon(board, 2)) {
      winner = 2;  
    }
    else if (board.every(c => c > 0)) {
      winner = 0;
    }
    
    if (winner > -1) {
      gameStarted = false;
      var text = winner == 0 ? 'DRAW' : ( 
        winner == 1 && computerStarts || winner == 2 && !computerStarts ? 'YOU LOST' : 'YOU WON');
      console.log(text)
      $('#resultMessage').text(text);
    }
  }

  function doMove() {
    thinking = true;

    var cpu = computerStarts ? 1 : 2;

    function inv(turn) {
      return turn == 1 ? 2 : 1;
    }

    var evalBoardSelf = function(b, turn) {
      // Check if the last (opponent) move returned in a win
      var v = checkTurnWon(b, inv(turn));
      if (v) {
        return 1000;
      }
      var moves = [];
      
      for (var i=0; i<9; ++i) {
        if (b[i] == 0) {
          var b2 = b.slice();
          b2[i] = turn;
          var e = evalBoardOpponent(b2, inv(turn))
          moves.push({pos: i, ev: e});
        }
      }

      if (moves.length == 0) {
        return 0;
      }

      var val = moves.reduce((a,c) => a + c.ev, 0) / moves.length;

      return -val;

      // var isNotWin = moves.length == 0 || moves.every(c => c.ev < 1);

      // return isNotWin ? 0 : -1;
    }

    var evalBoardOpponent = function(b, turn) {
      // Check if the last (self) move returned in a win
      var v = checkTurnWon(b, inv(turn));
      if (v) {
        return 1000;
      }
      var moves = [];
      
      for (var i=0; i<9; ++i) {
        if (b[i] == 0) {
          var b2 = b.slice();
          b2[i] = turn;
          var e = evalBoardSelf(b2, inv(turn))
          moves.push({pos: i, ev: e});
        }
      }

      if (moves.length == 0) {
        return 0;
      }

      var val = moves.reduce((a,c) => a + c.ev, 0) / moves.length;

      return -val;
      
      // var isNotWin = moves.length == 0 || moves.every(c => c.ev < 1);

      // return isNotWin ? 0 : -1;
    }

    var getMove = function(b, turn) {
      var moves = [];
      for (var i=0; i<9; ++i) {
        if (b[i] == 0) {
          var b2 = b.slice();
          b2[i] = turn;
          var e = evalBoardOpponent(b2, inv(turn))
          moves.push({pos: i, ev: e});
        }
      }

      return moves.reduce((a,c) => c.ev > a.ev ? c : a, {pos:0, ev:-1000});
    }

    var move = getMove(board.slice(), cpu);
    board[move.pos] = cpu;
    $('#f' + move.pos).text(board[move.pos] == 1 ? 'O' : 'X');

    thinking = false;
    checkWin();
  }

  // Go!
  restartGame();
});
