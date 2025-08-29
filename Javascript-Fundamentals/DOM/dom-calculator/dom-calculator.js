  let result = '';
  let display = '';
  let miniDisplay = '';
  let tempNumber = '';

  let firstNum = '';
  let secondNum = '';
  let operation = '';

  
  function displayValue (value) { 
    display = document.querySelector('.result-display');
    tempNumber += value;
    display.innerHTML = tempNumber;
    
    if ( !operation) firstNum += value;
    else secondNum += value;
  }

  function add() { 
    display.innerHTML = Number(firstNum) + Number(secondNum);
    miniDisplay = document.querySelector('.mini-result');
    miniDisplay.innerHTML= display.innerHTML + '+'
    operation = '+';
    tempNumber = ''; 
    firstNum = display.innerHTML;
    secondNum = '';
  }

  function subtract () { 
    display.innerHTML = Number(firstNum) - Number(secondNum);
    miniDisplay = document.querySelector('.mini-result');
    miniDisplay.innerHTML = display.innerHTML + '-';
    operation = '-';
    tempNumber = '';
    firstNum = display.innerHTML;
    secondNum = '';

  }

  function multiply () { 
    if ( secondNum ) display.innerHTML = Number(firstNum) * Number(secondNum);
  
    miniDisplay = document.querySelector('.mini-result');
    miniDisplay.innerHTML = display.innerHTML + '*';
    operation = '*';
    tempNumber = '';
    firstNum = display.innerHTML;
    secondNum = '';

  }

  function divide () { 
    if ( secondNum ) display.innerHTML = Number(firstNum) / Number(secondNum);

    miniDisplay = document.querySelector('.mini-result');
    miniDisplay.innerHTML = display.innerHTML + '/';
    operation = '/';
    tempNumber = '';
    firstNum = display.innerHTML;
    secondNum = '';
  }

  function modulo () { 

  }


 /* fix the positive to negative vice versa function */
  function negative_positive () { 
     
    if (Math.sign(Number(display.innerHTML)) === 1 ) {  
      display.innerHTML = Number(display.innerHTML) * -1;
      if ( !operation) firstNum = display.innerHTML;
      else secondNum = display.innerHTML;
       
    } else if (Math.sign(Number(display.innerHTML)) === -1 ) { 
      display.innerHTML = Number(display.innerHTML) * -1;
       if ( !operation) firstNum = display.innerHTML;
       else secondNum = display.innerHTML;
       
    } else { 
      display.innerHTML = '0';
    }
  } 

  function delete_char () { 
    tempNumber = display.innerHTML = display.innerHTML.replace(display.innerHTML[display.innerHTML.length - 1], '');

    if ( !operation) firstNum = display.innerHTML;
    else secondNum = display.innerHTML;

  }

  /* fix the erase() and clear() function, wont work properly */
  function erase () {
    result = '';
    tempNumber = '';
    firstNum = '';
    secondNum = '';
    operation = '';

    display.innerHTML = '';
    miniDisplay.innerHTML = '';
  }

  function total () { 
   switch (operation) { 
    case '+': 
      result = `${firstNum} + ${secondNum} = `;
      miniDisplay.innerHTML = result;
      display.innerHTML = Number(firstNum) + Number(secondNum);
      break;

    case '/': 
      result = `${firstNum} / ${secondNum} = `;
      miniDisplay.innerHTML = result;
      display.innerHTML = Number(firstNum) / Number(secondNum);
      break;

    case '*': 
      result = `${firstNum} x ${secondNum} = `;
      miniDisplay.innerHTML = result;
      display.innerHTML = Number(firstNum) * Number(secondNum);
      break;

    case '-': 
      result = `${firstNum} - ${secondNum} = `;
      miniDisplay.innerHTML = result;
      display.innerHTML = Number(firstNum) - Number(secondNum);
      break;
   } 

    firstNum = Number(display.innerHTML);
    secondNum = '';

  }