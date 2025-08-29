let noteList = []; // container of the notes, arranged into array objects later
let taskNumber = 0;  // total number of notes

//localStorage.clear();
noteList = JSON.parse(localStorage.getItem("notedList")) || new Array(); // retrieving the values of noteList on the local storage to keep the data persistent even after the page reloads
taskNumber = JSON.parse(localStorage.getItem("taskNumber")) || 0; // retrieving the number of notes
document.querySelector('.grid-container').innerHTML = localStorage.getItem("gridContainerElement") || ` <button class="add">+</button>` // retrieving the innerHTML of class grid-container, to display the present notes

// basically this function is used to insert the value of the active container REALTIME character by character when typing on the container.
function addNoteChar() { 
  let gridContainerElement = document.querySelector('.grid-container');
  for ( let i = 0; i < taskNumber; i++) { 
    let noteContainerElement =  document.querySelectorAll('.note-container');
    let noteContainerIndexElement = noteContainerElement ?  noteContainerElement[i] : "";
    noteList[i] =  {id : i + 1, value: noteContainerIndexElement ? noteContainerIndexElement.value : ""}

    // this try catch is used to avoid having an pop out error message at the initial stage ( no notes have been added);
    try {
       noteContainerIndexElement.textContent = noteContainerIndexElement.value; /* this is used to get the attribute value of the an active textarea element and insert its value to the textContent ( its like an innerHTMl of an element but just the TEXT only, forget about the others) of that same textarea element, To maintain the value after reloading the page, even if you didn't press the add button*/ 
       noteContainerIndexElement.setAttribute("value", noteContainerIndexElement.value); // getting the realtime value of the textAreaElement and adding that value on the same element;
    } catch (err) { 
       console.log('noteContainerIndexElement has no definite value');
    }
  
  }
  localStorage.setItem("notedList", JSON.stringify(noteList)); 
  localStorage.setItem("gridContainerElement", gridContainerElement.innerHTML);
}

// this function generates an html template needed with pre-declared variables 
function generateHTML () { 
  let gridContainerElement = document.querySelector('.grid-container');

  addNoteChar();
  
  gridContainerElement.innerHTML = "";
  // inserting the generated html to the innerHtml of gridContainerElement 
  for ( let i = 0; i < taskNumber; i++) { 
    gridContainerElement.innerHTML += 
    `<textarea class="note-container" placeholder="Empty Note">${noteList[i].value}</textarea>`
  }
  gridContainerElement.innerHTML += 
  `<button class="add">+</button>` // after generating all the needed html, it will add an element button at the end of every note
   btnEventListener (); // add eventlistener to new addBtn element
   
   // add eventListeners to every note
   noteList.forEach((note, index) => {
    document.querySelectorAll('.note-container')[index].addEventListener('keyup', addNoteChar);
    document.querySelectorAll('.note-container')[index].addEventListener('dblclick', () => {
      deleteNote(index + 1);
    });
   })

  localStorage.setItem("taskNumber", JSON.stringify(taskNumber));
  localStorage.setItem("gridContainerElement", gridContainerElement.innerHTML);
}

// function that will add task, will call the generateHTML function above
function addTask () { 
  taskNumber++;
  generateHTML();
}

// function to delete the note
function deleteNote (index) { 
  let noteContainerElement =  document.querySelectorAll('.note-container');
  let noteContainerIndexElement = noteContainerElement[index-1];
  let choice = confirm('Do you want to delete this note?') // this show a message with ok ( true ) and cancel (false) option;
  
  if (choice) { 
    noteContainerIndexElement.remove(); // removed the target note
    taskNumber--; // deduct the number of task/note
    noteList.splice(index-1, 1); // remove the note in the noteList array object based on the parameter 
    generateHTML(); // will call the generateHTML to erase the innerHtml of grid container and generate again the HTML without the removed note
  }
  
}

//function to addEventListener on initial btn element after loading the page
function btnEventListener () { 
  document.querySelector('.add').addEventListener('click', addTask);
}
btnEventListener();