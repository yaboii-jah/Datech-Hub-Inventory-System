let milliSeconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let interval = 0;

function format(unit, length = 2) {
  return unit.toString().padStart(length, '0');
}

function updateTime() {
  let timerElement = document.querySelector('.timer');


  timerElement.innerHTML = 
    `${format(hours)}:${format(minutes)}:${format(seconds)}:${format(milliSeconds, 2)}`;

  milliSeconds++;
  if (milliSeconds > 99) {
    milliSeconds = 0;
    seconds++;
  }
  if (seconds > 59) {
    seconds = 0;
    minutes++;
  }
  if (minutes > 59) {
    minutes = 0;
    hours++;
  }
  if (hours > 23) {
    hours = 0;
  }
}

function Start() {
  clearInterval(interval);
  interval = setInterval(updateTime, 10); 
}

function Stop() {
  clearInterval(interval);
}

function Reset() {
  let timerElement = document.querySelector('.timer');

  clearInterval(interval);

  milliSeconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;

  timerElement.innerHTML = `00:00:00:00`;
}