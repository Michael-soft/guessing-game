const socket = io();

const Controller = (function (Model, View) {
  // Grab DOM elements
  const joinBtn = document.getElementById('join-btn');
  const usernameInput = document.getElementById('username');
  const sendBtn = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-input');
  const createBtn = document.getElementById('create-btn');
  const startBtn = document.getElementById('start-btn');
  const questionInput = document.getElementById('question');
  const answerInput = document.getElementById('answer');

  let isGameMaster = false;

  // Player joins by clicking the join button
  joinBtn.addEventListener('click', function () {
    const username = usernameInput.value.trim();
    if (!username) {
      alert('Please enter your name.');
      return;
    }
    socket.emit('joinSession', { name: username });
    View.showGameScreen();
  });

  // Sending messages or guesses based on game state
  sendBtn.addEventListener('click', function () {
    const text = chatInput.value.trim();
    if (!text) {
      return;
    }
    // During an active game session, treat input as a guess.
    if (Model.getGameState().inProgress) {
      socket.emit('guess', { guess: text });
    } else {
      // Otherwise, treat it as a general message
      socket.emit('message', { text: text });
    }
    chatInput.value = '';
  });

  // Game Master creates a question and its answer.
  createBtn.addEventListener('click', function () {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    if (!question || !answer) {
      alert('Please fill in both question and answer.');
      return;
    }
    socket.emit('createQuestion', { question, answer });
    // Clear fields after submitting
    questionInput.value = '';
    answerInput.value = '';
  });

  // (Optional) If a separate start button is desired.
  startBtn.addEventListener('click', function () {
    // You could trigger a start event if needed.
  });

  // Socket.IO event handlers

  // When assigned as Game Master, show the Game Master panel.
  socket.on('assignedGameMaster', function () {
    isGameMaster = true;
    View.showGameMasterPanel();
    View.appendMessage('You are assigned as Game Master.');
  });

  // Update the players list when changes occur.
  socket.on('updatePlayers', function (players) {
    Model.setPlayers(players);
    View.updatePlayersList(players);
  });

  // When the game starts, display the question and update the status.
  socket.on('gameStarted', function (data) {
    Model.setGameState({ inProgress: true, question: data.question, duration: data.duration });
    View.appendMessage(`Game Started! Question: ${data.question}`);
    View.setStatus('Game in progress. You have 3 attempts to guess.');
  });

  // When the game ends either with a winner or timeout.
  socket.on('gameOver', function (data) {
    Model.setGameState({ inProgress: false, question: null, duration: 60 });
    if (data.winner) {
      View.appendMessage(`Game Over! Winner: ${data.winner.name} (Answer: ${data.answer})`);
    } else {
      View.appendMessage(`Game Over! Time expired. Answer was: ${data.answer}`);
    }
    View.setStatus('Game session ended. A new session will start shortly.');
    if (isGameMaster) {
      View.hideGameMasterPanel();
      isGameMaster = false;
    }
  });

  // Display any general messages sent from the server.
  socket.on('message', function (data) {
    View.appendMessage(data.text);
  });

  // New session event to update scores and players when a new round begins.
  socket.on('newSession', function (data) {
    Model.setPlayers(data.players);
    View.updatePlayersList(data.players);
  });

})(Model, View);







// class GameController {
//     constructor(model, view) {
//         this.model = model;
//         this.view = view;

//         // Bind event handlers
//         this.view.submitButton.addEventListener('click', () => this.handleGuess());
//         this.view.newGameButton.addEventListener('click', () => this.startNewGame());
//         this.view.guessInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 this.handleGuess();
//             }
//         });
//     }

//     handleGuess() {
//         const guess = this.view.getGuess();
        
//         if (isNaN(guess) || guess < 1 || guess > 100) {
//             this.view.updateMessage('Please enter a valid number between 1 and 100');
//             return;
//         }

//         const result = this.model.makeGuess(guess);
        
//         if (result) {
//             this.view.updateMessage(result.message, result.correct);
//             this.view.updateAttempts(this.model.getAttempts());
            
//             if (result.correct) {
//                 this.view.disableInput();
//                 this.view.showNewGameButton();
//             }
//         }
        
//         this.view.clearInput();
//     }

//     startNewGame() {
//         this.model.reset();
//         this.view.updateMessage('');
//         this.view.updateAttempts(0);
//         this.view.enableInput();
//         this.view.hideNewGameButton();
//         this.view.clearInput();
//     }
// }

// // Initialize the game
// const model = new GameModel();
// const view = new GameView();
// const controller = new GameController(model, view);
