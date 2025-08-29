// do the modulo and dot function;
let num1 = '';
let num2 = '';
let operation = '';
let tempVar = '';
let result = document.querySelector('.result-display');
let mini_result = document.querySelector('.mini-result');

function addEventListeners () { 
  let buttons = document.querySelectorAll('.buttons');
  const actions = {
    divide,
    multiply,
    subtract,
    add,
    equal,
    clear,
    erase,  
    revert,
    dot
  };

  for ( i = 0; i < buttons.length; i++) {
    let argument = buttons[i].innerHTML
    
    if (Number.isNaN(Number(argument)) === false) { 
      buttons[i].addEventListener('click', () => { 
        getNumbers(Number(argument));
      });
    }
  }

  document.querySelectorAll('.buttons').forEach((button, index) => {
    const action = button.dataset.action;
    if (action) { 
      button.addEventListener('click', actions[action])
    }
  });
}

function getNumbers (value) {
  if ( operation === '') {
    mini_result.innerHTML = '';
    num1 += String(value);
    result.innerHTML = num1;
  } else {
    num2 += String(value);
    result.innerHTML = num2;
  }
}

function operators (num1, num2, operator) {
  let result;
  switch (operator) {  
    case "+": 
      result = num1 + num2; 
      break;
    case "-": 
      result = num1 - num2;
      break;
    case "*": 
      result = num1 * num2;
      break;
    case "/": 
      result = num1 / num2;
      break;
  }
  if ( num2 === 0) { 
    num2 = num1;
    console.log('hi');
    result = operators ( num1, num2, operator);
  }

  return result;
}

function add () {
  if ( num1 !== '' && num2 !== '') {
    result.innerHTML = operators(Number(num1), Number(num2), operation);
    num1 = Number(result.innerHTML);
    num2 = '';
  } 
  num1 = Number(result.innerHTML);
  operation = '+';
  mini_result.innerHTML = `${result.innerHTML} +`
}
 
function subtract () {
  if ( num1 !== '' && num2 !== '') {
    result.innerHTML = operators(Number(num1), Number(num2), operation);
    num1 = Number(result.innerHTML);
    num2 = '';
  } 
  num1 = Number(result.innerHTML);
  operation = '-';
  mini_result.innerHTML = `${result.innerHTML} -`
 
}

function multiply () {
  if ( num1 !== '' && num2 !== '') {
    result.innerHTML = operators(Number(num1), Number(num2), operation);
    num1 = Number(result.innerHTML);
    num2 = '';
  } 
  num1 = Number(result.innerHTML);
  operation = '*';
  mini_result.innerHTML = `${result.innerHTML} *`

}

function divide () {
  if ( num1 !== '' && num2 !== '') {
    result.innerHTML = operators(Number(num1), Number(num2), operation);
    num1 = Number(result.innerHTML);
    num2 = '';
  } 
  num1 = Number(result.innerHTML);
  operation = '/';
  mini_result.innerHTML = `${result.innerHTML} /`

}

function clear () { 
  num1 = '';
  num2 = '';
  result.innerHTML = '';
  mini_result.innerHTML = '';
  operation = '';
}

function erase () {
  let resultText = result.innerHTML;
  if ( operation === '') {
    num1 = resultText.slice(0, -1);
    result.innerHTML = num1;
  } else {
    num2 = resultText.slice(0, -1);
    result.innerHTML = num2;
  }
}

function equal () {
  switch (operation) { 
    case "+":
      mini_result.innerHTML = `${num1} + ${num2 = num2 ? num2 : num1} =`;
      result.innerHTML = operators(Number(num1), Number(num2), operation);
      num1 = '';
      num2 = '';
      operation = '';
      break;

    case "-":
      mini_result.innerHTML = `${num1} - ${num2 = num2 ? num2 : num1} =`;
      result.innerHTML = operators(Number(num1), Number(num2), operation);
      num1 = '';
      num2 = '';
      operation = '';
      break;

    case "*":
      mini_result.innerHTML = `${num1} * ${num2 = num2 ? num2 : num1} =`;
      result.innerHTML = operators(Number(num1), Number(num2), operation);
      num1 = '';
      num2 = '';
      operation = '';
      break;

    case "/":
      mini_result.innerHTML = `${num1} / ${num2 = num2 ? num2 : num1} =`;
      result.innerHTML = operators(Number(num1), Number(num2), operation);
      num1 = '';
      num2 = '';
      operation = '';
      break;
  }
}

function dot () { 
  let resultText = result.innerHTML;
  if ( operation === '') {
    num1 = resultText.slice(0, num1.length) + '.';
    result.innerHTML = num1;
  } else { 
    num2 = resultText.slice(0, num1.length) + '.';
    result.innerHTML = num2;
  }
}

function revert () { 
  let resultText = result.innerHTML;
  if ( operation === '') {
    if (Math.sign(Number(resultText)) === 1) { 
      num1 = resultText.slice(0, 0) + '-' + resultText.slice(0);
    } else { 
      num1 = resultText.slice(1);
    }
    result.innerHTML = num1;
  } else { 
    if (Math.sign(Number(resultText)) === 1) { 
      num2 = resultText.slice(0, 0) + '-' + resultText.slice(0);
    } else { 
      num2 = resultText.slice(1);
    }
    result.innerHTML = num2;
  }
}
addEventListeners ()

