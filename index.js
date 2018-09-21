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

  function check(b) {
    const rows = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (var i=1; i<=2; ++i) {
      for (var r in rows) {
        var row = rows[r];
        if (board[row[0]] == i && board[row[1]] == i && board[row[2]] == i) {
          return i;
        }
      }
    }
    return 0;
  }

  function checkWin() {
    var i = check(board);
    if (i > 0) {
      gameStarted = false;
      winner = i;
      var text = winner == 1 && computerStarts || winner == 2 && !computerStarts ? 'YOU LOST' : 'YOU WON';
      console.log(text)
      $('#resultMessage').text(text);
    }
  }

  function doMove() {
    thinking = true;

    var cpu = computerStarts ? 1 : 2;
    var cnt = 0;
    var ev = function(b, turn) {
      var possibleMoves = [];
      for (var i=0; i<9; ++i) {
        if (b[i] == 0) {
          cnt++;
          if (cnt % 10000 == 0) {
            console.log(cnt);
          }
          var b2 = b.slice();
          b2[i] = turn;
          var v = check(board, cpu);

          if (v != 0) {
            if (turn != cpu) {
              return -1;
            }
            else {
              return 1;
            }
          }

          var w = ev(b2, turn == 1 ? 2 : 1);
          if (turn == cpu) {
            if (w == -1) {
              // bad move
            }
            else if (w == 1) {
              possibleMoves.unshift(i);              
            }
            else {
              possibleMoves.push(i);
            }
          }
          else {
            
          } 
        }
      }
      return 0;
      
    }
    console.log('tried', cnt);
    
    ev(board.slice(), cpu);

    for (var i=0; i<9; ++i) {
      if (board[i] == 0) {
        board[i] = computerStarts ? 1 : 2;
        $('#f'+i).text(board[i] == 1 ? 'O' : 'X');
        break;
      }
    }

    thinking = false;
    checkWin();
  }

  // Go!
  restartGame();
});
