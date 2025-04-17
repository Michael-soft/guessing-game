/* public/js/model.js */
const Model = (function () {
    let players = [];
    let messages = [];
    let gameState = {
      inProgress: false,
      question: null,
      duration: 60,
    };
  
    return {
      getPlayers: () => players,
      addPlayer: (player) => players.push(player),
      setPlayers: (newPlayers) => { players = newPlayers; },
      getMessages: () => messages,
      addMessage: (msg) => messages.push(msg),
      getGameState: () => gameState,
      setGameState: (state) => { gameState = state; }
    };
  })();
  






// class GameModel {
//     constructor() {
//         this.reset();
//     }

//     reset() {
//         this.targetNumber = Math.floor(Math.random() * 100) + 1;
//         this.attempts = 0;
//         this.gameOver = false;
//     }

//     makeGuess(guess) {
//         if (this.gameOver) {
//           return null;
//         }
        
//         this.attempts++;
        
//         if (guess === this.targetNumber) {
//             this.gameOver = true;
//             return {
//                 message: `Congratulations! You've guessed the number in ${this.attempts} attempts!`,
//                 correct: true
//             };
//         }
        
//         return {
//             message: guess < this.targetNumber ? 'Too low!' : 'Too high!',
//             correct: false
//         };
//     }

//     getAttempts() {
//         return this.attempts;
//     }

//     isGameOver() {
//         return this.gameOver;
//     }
// }
