import {supabase} from './supabase-client.js'

let taskList = []; // container of the tasks
let taskListElement = document.querySelector('.task-list');
let inputTaskElement = document.querySelector('.input-task');
let tasklistInnerHTML = "";

//localStorage.clear();
function addTask  (event) { 
  if ( event === 'Enter') { 
    let value = {}
    if ( inputTaskElement.value !== "") { 
      taskList.push({value : inputTaskElement.value});
      value = { task_description : inputTaskElement.value};
      insertData(value)

      taskList.forEach((task, i ) => {
        taskList[i] =  { id : i + 1, value : task.value};
      });
      generateHTML();
      inputTaskElement.value = ""; 
      setLocalStorage();
    } 
  } 
}

function generateHTML () {
  let HTML = "";
  taskList.forEach((task, i) => { 
    HTML +=  
   `<div class="task-container">
         <p class="task">${task.value}</p> 
        <div>
          <button class="check-btn">&#10003;</button>
          <button class="remove-btn">&#10005;</button>
        </div>
    </div> `
  });
  taskListElement.innerHTML = HTML;
  configureLastContainerElement();
  addEventListenerTask();
}

function configureLastContainerElement ( ) { 
  let taskContainerElement = document.querySelectorAll('.task-container');
  if (taskContainerElement.length !== 0) { 
    taskContainerElement[taskContainerElement.length - 1].classList.add('last-task-container');
  }
}

function addEventListenerTask () { 
  for ( let i = 0; i < taskList.length; i++ ) { 
  let checkedBtnElement = document.querySelectorAll('.check-btn');
  let removeBtnElement = document.querySelectorAll('.remove-btn');
  let tempNum = taskList[i].id

  checkedBtnElement[i].addEventListener('click', () => { 
    checkedTask(tempNum);
  });
  removeBtnElement[i].addEventListener('click', () => { 
    removeTask(tempNum);
  });
  }
}

function checkedTask(number) { 
  let checkedBtnElement = document.querySelectorAll('.check-btn');
  let taskElement = document.querySelectorAll('.task');

  for ( let i = 0; i < taskList.length; i++) {  
    if (taskList[i].id === number ) { 
      checkedBtnElement[i].classList.toggle('checked-btn');
      taskElement[i].classList.toggle('checked-task'); 
    }
  }
  setLocalStorage();
}

async function removeTask (number) { 
  let taskContainerElement = document.querySelectorAll('.task-container');
  for ( let i = 0; i < taskList.length; i++) { 
    if (taskList[i].id === number ) {
      await deleteData(taskList[i].value)
      taskList.splice(i, 1);
      taskContainerElement[i].remove();
    }
  }
  configureLastContainerElement();
  setLocalStorage();
}

async function insertData (task_description) { 
  const {data, error} =  await supabase.from('task').insert(task_description).single().select();

  if (error) { 
    console.log('there is an error inserting the data');
  } else {
    console.log(data);
  }
}

async function deleteData (deleteTask) { 
  const {data, error} =  await supabase.from('task').delete().eq('task_description', deleteTask)

  if (error) { 
    console.log('there is an error inserting the data');
  } else {
    console.log(data);
  }
}



function setLocalStorage () { 
  tasklistInnerHTML = taskListElement.innerHTML;
  localStorage.setItem("taskList", JSON.stringify(taskList))
  localStorage.setItem("taskListElement", tasklistInnerHTML);
}

function getLocalStorage () { 
  taskList = JSON.parse(localStorage.getItem("taskList")) || [];
  taskListElement.innerHTML = localStorage.getItem("taskListElement") || "";
  addEventListenerTask ();
}

inputTaskElement.addEventListener('keyup', (event) => { 
  addTask(event.key);
}) 

getLocalStorage();



