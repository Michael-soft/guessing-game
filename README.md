 Guessing Game

A real-time multiplayer guessing game built with Node.js, Express, and Socket.IO. This application allows players to join a game session that resembles a chat interface, with one player designated as the Game Master who creates a question and answer for the other players to guess. The game enforces a minimum of three players and automatically rotates the Game Master for subsequent rounds.

 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

Features

- Real-Time Communication:
  Uses Socket.IO for bi-directional real-time communication.

- Chat Interface Style:  
  The game session is designed like a chat where messages, guesses, and game notifications appear.

- **Game Master Role:**  
  The first player to join is automatically assigned as the Game Master and can create a question and answer for the round.

- **Minimum Player Requirement:**  
  The game requires at least three players (1 Game Master + 2 players) before starting a round.

- **Scoring & Attempts:**  
  Each player has 3 attempts to guess the answer; the first correct guess is rewarded with 10 points.

- **Timed Rounds:**  
  Each round lasts 60 seconds; if no correct guess is made within the time limit, the answer is revealed, and no points are awarded.

- **Automatic Transition:**  
  When a round concludes, the game automatically transitions to a new session, with the Game Master role rotating to the next available player.

- **Session Reset:**  
  The game session resets completely when all players leave.

## Technology Stack

- **Backend:**  
  - Node.js
  - Express framework  
  - Socket.IO for real-time communication

- **Frontend:**  
  - HTML, CSS, JavaScript  
  - MVC architecture (Model-View-Controller) for code organization and scalability

## Installation

### Prerequisites

- [Node.js and npm](https://nodejs.org/) installed on your machine.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/guessing-game.git
   cd guessing-game

