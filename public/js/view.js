/* public/js/view.js */
const View = (function () {
    const joinScreen = document.getElementById('join-screen');
    const gameScreen = document.getElementById('game-screen');
    const chatMessages = document.getElementById('chat-messages');
    const playersList = document.getElementById('players-list');
    const gameMasterPanel = document.getElementById('game-master-panel');
    const statusDiv = document.getElementById('status');
  
    return {
      showJoinScreen: function () {
        joinScreen.style.display = 'block';
        gameScreen.style.display = 'none';
      },
      showGameScreen: function () {
        joinScreen.style.display = 'none';
        gameScreen.style.display = 'block';
      },
      appendMessage: function (message) {
        const p = document.createElement('p');
        p.innerText = message;
        chatMessages.appendChild(p);
        // Auto-scroll
        chatMessages.scrollTop = chatMessages.scrollHeight;
      },
      updatePlayersList: function (players) {
        playersList.innerHTML = '';
        players.forEach(player => {
          const li = document.createElement('li');
          li.innerText = `${player.name} - Score: ${player.score}`;
          playersList.appendChild(li);
        });
      },
      showGameMasterPanel: function () {
        gameMasterPanel.style.display = 'block';
      },
      hideGameMasterPanel: function () {
        gameMasterPanel.style.display = 'none';
      },
      setStatus: function (status) {
        statusDiv.innerText = status;
      }
    };
  })();
  

