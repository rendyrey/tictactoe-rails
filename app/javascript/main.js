var baseUrl = 'http://localhost:3000/api/v1'
var csrfToken = document.querySelector("[name='csrf-token']").content;
var turn = document.getElementById("turn"),
boxes = document.querySelectorAll("#game-screen .cell"), X_or_O = 0;
var endTurnBtn = document.getElementById('end-turn');
var player1Elem = document.getElementById("player1-name");
var player2Elem = document.getElementById("player2-name");
var player1Name = '';
var player2Name = '';
const FIRST_PLAYER = 'X';
const SECOND_PLAYER = 'O';

function selectWinnerBoxes([b1, b2, b3], winner) {
  document.getElementById("cell" + b1).classList.add("btn-green");
  document.getElementById("cell" + b2).classList.add("btn-green");
  document.getElementById("cell" + b3).classList.add("btn-green");
  turn.innerHTML = winner + " is a winner";
  boxes.forEach((elem) => {
    elem.disabled = true
  })
}

let resetBtn = document.getElementById('restart')
resetBtn.onclick = () => {
  confirmation();
}

for (var i = 0; i < boxes.length; i++) {
  boxes[i].onclick = function () {
    if (X_or_O % 2 === 0) {
      playerMove(player1Name, this.dataset.position, this)
    } else {
      playerMove(player2Name, this.dataset.position, this)
    }
  };
}

const replay = () => {
  player1Elem.innerHTML = ''
  player2Elem.innerHTML = ''
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove("btn-green");
    boxes[i].innerHTML = "";
    turn.innerHTML = "Play";
    turn.style.fontSize = "25px";
    boxes[i].disabled = false;
  } 
}

const reset = () => {
  fetch(baseUrl + '/reset_game', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    }
    })
    .then(response => {
      if (!response.ok) {
        let err = new Error('HTTP Status Code: ' + response.status)
        err.response = response
        err.status = response.status
        throw err
      }

      return response.json()
    })
    .then(data => {
      location.reload()
    })
    .catch(error => {
      alert(error)
    })
}

function newGame(player1, player2) {
  const params = {
    player1: player1,
    player2: player2
  }

  fetch(baseUrl + '/new_game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(params)
    })
    .then(response => {
      if (!response.ok) {
        let err = new Error('HTTP Status Code: ' + response.status)
        err.response = response
        err.status = response.status
        throw err
      }
    })
    .then(data => {
      
    })
    .catch(error => {
      alert(error)
    })
}

function playerMove(playerName, position, elem) {
  const params = {
    player_name: playerName,
    position: position,
    symbol: X_or_O % 2 == 0 ? FIRST_PLAYER : SECOND_PLAYER
  }

  fetch(baseUrl + '/move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(params)
    })
    .then(response => {
      if (!response.ok) {
        let err = new Error('HTTP Status Code: ' + response.status)
        err.response = response
        err.status = response.status
        throw err
      }
      const firstPlayerTurn = (X_or_O % 2 == 0)
      elem.innerHTML = firstPlayerTurn ? "X" : "O";
      turn.innerHTML = (firstPlayerTurn ? "X" : "O") + " has made move"
      
      return response.json();
    })
    .then(data => {
      if (data.status === 'win') {
        selectWinnerBoxes(data.combination, data.log.player_name)
        endTurnBtn.disabled = true
      } else if (data.status === 'draw') {
        turn.innerHTML = "It's Draw"
        endTurnBtn.disabled = true
      }
    })
    .catch(error => {
      if (error.status == 403)
        illegalMovePopUp()
    })
}

const prompts = async () => {
  var { value: player1 } = await Swal.fire({
    title: "Enter Player 1 Name",
    input: "text",
    inputLabel: "For (X) Player",
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "Name should be filled!";
      }
    }
  });

  if (player1) {
    var { value: player2 } = await Swal.fire({
      title: "Enter Player 2 Name",
      input: "text",
      inputLabel: "For (O) Player",
      showCancelButton: false,
      closeClick: false,
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "Name should be filled!";
        }

        if (value === player1) {
          return "Name should not be the same!";
        }
      }
    });
  }

  if (player1 !== '' && player2 !== '') {
    player1Elem.innerHTML = `P1: ${player1} (X)`
    player2Elem.innerHTML = `P2: ${player2} (O)`
    player1Name = player1
    player2Name = player2
    newGame(player1, player2)
  }
}

let gameScreen = document.getElementById('game-screen');
let sessionId = gameScreen.dataset.session;

if (sessionId) {
  X_or_O = turn.dataset.activeTurn === FIRST_PLAYER ? 0 : 1;
} else {
  prompts();
}

const confirmation = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, reset game!"
  }).then((result) => {
    if (result.isConfirmed) {
      reset()
    }
  });
}

const illegalMovePopUp = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "That's illegal move"
  });
}

endTurnBtn.onclick = () => {
  const firstPlayerTurn = (X_or_O % 2 == 0)
  turn.innerHTML = (firstPlayerTurn ? "O" : "X") + " Turn Now";
  X_or_O += 1;
}