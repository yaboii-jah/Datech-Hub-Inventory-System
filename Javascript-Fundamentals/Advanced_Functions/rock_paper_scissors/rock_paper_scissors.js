let result = '';
let playerMove = '';
let computerMove = '';
let score = { 
  Wins: 0,  
  Losses: 0, 
  Ties: 0
};

  score = JSON.parse(localStorage.getItem("score")) || 0;
  document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;

function reset ( ) { 

  document.querySelector('.score').innerHTML = `
  Wins: ${score.Wins=0}, 
  Losses: ${score.Losses=0}, 
  Ties: ${score.Ties=0}`; 
localStorage.setItem("score", JSON.stringify(score));
}

let isAutoPlay = false;
let interval;

function autoPlay () { 
  let playBtnELement = document.querySelector('.autoplay-btn');
  if (!isAutoPlay) { 
    interval =  setInterval(function () { 
      playerMove = Math.random();
      
      if ( playerMove <= 1/3 ) { 
        playerMove = 'Rock';
      } else if ( playerMove > 1/3 && playerMove <= 2/3 ) {
        playerMove = 'Paper';
      } else if ( playerMove > 2/3 && playerMove <= 1 ) { 
        playerMove = 'Scissors';
      }
      isAutoPlay = true;
      gameResult(playerMove);
    }, 1000);
    playBtnELement.innerHTML = 'Stop Play';
  } else { 
    clearInterval(interval);
    isAutoPlay = false;
    playBtnELement.innerHTML = 'Auto Play';
  }

}

function gameResult ( playerMove) { 
  computerMove = Math.random();

  if ( computerMove <= 1/3 ) { 
    computerMove = 'Rock';
  } else if ( computerMove > 1/3 && computerMove <= 2/3 ) {
    computerMove = 'Paper';
  } else if ( computerMove > 2/3 && computerMove <= 1 ) { 
    computerMove = 'Scissors';
  }

  if (computerMove === playerMove ) { 
    document.querySelector('.result').innerHTML = 'Tie';
    if ( computerMove === 'Paper') { 
        document.querySelector('.your-pick').innerHTML = 'You <img class="paper-icon" src="icons/paper-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="paper-icon" src="icons/paper-emoji.png" alt=""> Computer';
    } else if ( computerMove === 'Rock') { 
        document.querySelector('.your-pick').innerHTML = 'You <img class="rock-icon" src="icons/rock-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="rock-icon" src="icons/rock-emoji.png" alt=""> Computer';
    } else if ( computerMove === 'Scissors') { 
        document.querySelector('.your-pick').innerHTML = 'You <img class="scissors-icon" src="icons/scissors-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="scissors-icon" src="icons/scissors-emoji.png" alt=""> Computer';
    } 
    score.Ties++;
    document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
  } else if ( playerMove === 'Rock' ) {
      if ( computerMove === 'Paper' ) {
        document.querySelector('.result').innerHTML = 'Loss';
        document.querySelector('.your-pick').innerHTML = 'You <img class="rock-icon" src="icons/rock-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="paper-icon" src="icons/paper-emoji.png" alt=""> Computer';
        score.Losses++;
        document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
      } else if ( computerMove === 'Scissors') { 
        document.querySelector('.result').innerHTML = 'Win';
        document.querySelector('.your-pick').innerHTML = 'You <img class="rock-icon" src="icons/rock-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="scissors-icon" src="icons/scissors-emoji.png" alt=""> Computer';
        score.Wins++;
        document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
      }
  } else if ( playerMove === 'Paper' ) {
      if ( computerMove === 'Scissors' ) {
        document.querySelector('.result').innerHTML = 'Loss';
        document.querySelector('.your-pick').innerHTML = 'You <img class="paper-icon" src="icons/paper-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="scissors-icon" src="icons/scissors-emoji.png" alt=""> Computer';
        score.Losses++;
        document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
      } else if ( computerMove === 'Rock') { 
        document.querySelector('.result').innerHTML = 'Win';
        document.querySelector('.your-pick').innerHTML = 'You <img class="paper-icon" src="icons/paper-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="rock-icon" src="icons/rock-emoji.png" alt=""> Computer';
        score.Wins++;
        document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
      }
  } else if ( playerMove === 'Scissors' ) {
      if ( computerMove === 'Rock' ) {
        document.querySelector('.result').innerHTML = 'Loss';
        document.querySelector('.your-pick').innerHTML = 'You <img class="scissors-icon" src="icons/scissors-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="rock-icon" src="icons/rock-emoji.png" alt=""> Computer';
        score.Losses++;
        document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
      } else if ( computerMove === 'Paper') { 
        document.querySelector('.result').innerHTML = 'Win';
        document.querySelector('.your-pick').innerHTML = 'You <img class="scissors-icon" src="icons/scissors-emoji.png" alt="">';
        document.querySelector('.computer-pick').innerHTML = '<img class="paper-icon" src="icons/paper-emoji.png" alt=""> Computer';
        score.Wins++;
        document.querySelector('.score').innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses}, Ties: ${score.Ties}`;
      }
  } 
  
  localStorage.setItem("score", JSON.stringify(score));
}

function eventListeners () { 
  let rockBtnElement = document.querySelector('.rock-btn');
  let paperBtnElement = document.querySelector('.paper-btn');
  let scissorsBtnElement = document.querySelector('.scissors-btn');
  let resetElement = document.querySelector('.reset-btn');
  let autoPlayElement = document.querySelector('.autoplay-btn');

  rockBtnElement.addEventListener('click', () => {
    gameResult('Rock');
  });

  paperBtnElement.addEventListener('click', () => {
    gameResult('Paper');
  });

  scissorsBtnElement.addEventListener('click', () => {
    gameResult('Scissors');
  });
  
  resetElement.addEventListener('click', () => {
    reset();
  });

  autoPlayElement.addEventListener('click', () => {
    autoPlay();
  });
}

eventListeners();
