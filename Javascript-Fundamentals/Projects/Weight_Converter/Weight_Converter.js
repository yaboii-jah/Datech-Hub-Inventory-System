function convert () { 
      let result = document.querySelector('.result');
      let inputElement =  document.querySelector('.input-number');
      let convertedNumber = Number(inputElement.value) * 0.45359237;

      result.innerHTML = `Your weight in kg is: ${Math.round(convertedNumber * 100) / 100}` 
    }
   