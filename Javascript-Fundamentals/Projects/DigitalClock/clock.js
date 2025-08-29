
function updateTime () { 
  let seconds = new Date();
  let secondsElement = document.querySelector('.seconds');
  let minutes = new Date();
  let minutesElement = document.querySelector('.minutes');
  let hours = new Date();
  let hoursElement = document.querySelector('.hours');
  
  secondsElement.innerHTML = setTimeFormat(String(seconds.getSeconds()));
  minutesElement.innerHTML = setTimeFormat(String(minutes.getMinutes()));
  hoursElement.innerHTML = hours.getHours() > 12 ? setTimeFormat(String(hours.getHours() - 12)) : setTimeFormat(String(hours.getHours()));

  let timeSystemElement = document.querySelector('.time-system');
  
  timeSystemElement.innerHTML = setTimeSystem(hours.getHours() / 12 )
}

function setTimeFormat (time) {
  return time.length > 1  ? time : `0${time}`;
}

function setTimeSystem (format) { 
  let value;

  if ( format > 0 && format <= 1) { 
     value = 'AM';
     if ( format === 1) { 
      value = 'PM'
     }
  }
  
  if ( format > 1 && format <= 2) { 
     value = 'PM';
     if ( format === 2) { 
      value = 'AM'
     }
  }
  
  return value;
}

setInterval(updateTime, 1000); 
