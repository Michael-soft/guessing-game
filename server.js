// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from the public folder
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;

// Game session object to hold the state for the current game.
let gameSession = {
  players: [],
  gameMasterId: null,
  question: null,
  answer: null,
  inProgress: false,
  timer: null,
};

// When a client connects
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // When a player joins the session by entering their name
  socket.on('joinSession', (data) => {
    // Check if a game is currently in progress. If yes, reject the join.
    if (gameSession.inProgress) {
      socket.emit('message', { text: 'Game is currently in progress. Please wait for the current game to finish.' });
      return;
    }
    
    // Validate non-empty name
    if (!data.name || typeof data.name !== 'string') {
      return;
    }
    
    // Create a new player with 3 attempts and initial score 0
    const player = { id: socket.id, name: data.name, score: 0, attempts: 3 };
    gameSession.players.push(player);

    // Broadcast the updated players list to all connected clients
    io.emit('updatePlayers', gameSession.players);

    // First player is assigned as Game Master
    if (gameSession.players.length === 1) {
      gameSession.gameMasterId = socket.id;
      io.to(socket.id).emit('assignedGameMaster');
    }
  });

  // Game Master creates a question and an answer
  socket.on('createQuestion', (data) => {
    // Only allow the Game Master to create a question
    if (socket.id !== gameSession.gameMasterId) {
      return;
    }
    
    // Check for minimum players: gameSession.players length should be at least 3.
    if (gameSession.players.length < 3) {
      io.to(socket.id).emit('message', { text: "Minimum of 3 players are required to start the game." });
      return;
    }
    
    // Validate that both question and answer are provided.
    if (!data.question || !data.answer) {
      return;
    }

    gameSession.question = data.question;
    gameSession.answer = data.answer;
    gameSession.inProgress = true;

    // Reset each player's attempts to 3 before a new round
    gameSession.players.forEach(player => (player.attempts = 3));

    // Start the game by broadcasting the question (do not reveal the answer)
    io.emit('gameStarted', { question: gameSession.question, duration: 60 });

    // Start a 60-second timer for the game session
    gameSession.timer = setTimeout(() => {
      if (gameSession.inProgress) {
        io.emit('gameOver', { winner: null, answer: gameSession.answer });
        transitionSession();
      }
    }, 60000);
  });

  // When a player sends a guess
  socket.on('guess', (data) => {
    if (!gameSession.inProgress) {
      return;
    }
    const player = gameSession.players.find(p => p.id === socket.id);
    if (!player) {
      return;
    }

    // Validate if the player still has attempts left.
    if (player.attempts <= 0) {
      socket.emit('message', { text: 'No attempts left.' });
      return;
    }
    player.attempts--;

    // Check if the guess is correct (case-insensitive comparison)
    if (data.guess && data.guess.toLowerCase() === gameSession.answer.toLowerCase()) {
      player.score += 10;  // Award 10 points
      gameSession.inProgress = false;
      clearTimeout(gameSession.timer);
      io.emit('gameOver', { winner: player, answer: gameSession.answer });
      transitionSession();
    } else {
      // Inform the player of a wrong guess and remaining attempts
      socket.emit('message', { text: 'Wrong guess! Attempts left: ' + player.attempts });
    }
  });

  // Handle disconnects: remove the leaving player and update the game master if needed.
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    gameSession.players = gameSession.players.filter(p => p.id !== socket.id);
    // If the game master disconnects, assign the next available player (if any)
    if (socket.id === gameSession.gameMasterId && gameSession.players.length > 0) {
      gameSession.gameMasterId = gameSession.players[0].id;
      io.to(gameSession.gameMasterId).emit('assignedGameMaster');
    }
    io.emit('updatePlayers', gameSession.players);

    // If all players leave, reset the game session completely.
    if (gameSession.players.length === 0) {
      resetSession();
    }
  });

  // Function to transition to a new game session and assign a new Game Master.

  function transitionSession() {
    // Rotate game master: if the current is the last, cycle to the first player.
    let currentGMIndex = gameSession.players.findIndex(p => p.id === gameSession.gameMasterId);
    if (currentGMIndex === -1 || currentGMIndex === gameSession.players.length - 1) {
      if (gameSession.players.length > 0) {
        gameSession.gameMasterId = gameSession.players[0].id;
        io.to(gameSession.gameMasterId).emit('assignedGameMaster');
      }
    } else {
      gameSession.gameMasterId = gameSession.players[currentGMIndex + 1].id;
      io.to(gameSession.gameMasterId).emit('assignedGameMaster');
    }
    // Clear the round-specific data so that a new game can begin.
    gameSession.question = null;
    gameSession.answer = null;
    gameSession.inProgress = false;
    gameSession.timer = null;

    // Notify clients that a new session is ready (scores persist).
    io.emit('newSession', { players: gameSession.players });
  }

  // Reset the session when no players remain.
  function resetSession() {
    gameSession = {
      players: [],
      gameMasterId: null,
      question: null,
      answer: null,
      inProgress: false,
      timer: null,
    };
  }
});

http.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});


