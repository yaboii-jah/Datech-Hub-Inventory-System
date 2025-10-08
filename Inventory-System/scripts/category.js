import {supabase} from './supabase-client.js'

let dataRetrieved = [{}];
let categoryID;

async function insertData () { 
  const categoryValue = document.querySelector('.category-input')
  const statusValue = document.querySelector('.status-select').value
  const addBtnElement = document.querySelector('.add-category-button');
 
  if (addBtnElement.innerHTML === 'Add Category') {
    if (categoryValue.value !== '') { 
      const choice = confirm('Are you sure you want to add this category?');
      if (choice) {
        try {
          const {error} = await supabase.from('category').insert({categoryName : categoryValue.value, status : statusValue}).single();
          retrieveData(); 
          categoryValue.value = '';
          alert('Category Added!')
        } catch (err) { 
          console.error(err);
        }
      } 
    } else {  
      alert('Please fill the details') 
    }
  }

  if (addBtnElement.innerHTML === 'Update Category') { 
    if (categoryValue.value !== '') { 
      const choice = confirm('Are you sure you want to update this category?');
      if (choice) {
        try {
          const {error} = await supabase.from('category').update({categoryName : categoryValue.value, status : statusValue}).eq('category_ID', categoryID)
          retrieveData();
          categoryValue.value = '';
          addBtnElement.innerHTML = 'Add Category'
          alert('Category Updated!')
        } catch (err) { 
          console.error(err);
        }
      } 
    } else {  
      alert('Please fill the details')
    }
  }
}

async function retrieveData () {
  try { 
    const {data, error} = await supabase.from('category').select();
    dataRetrieved = data;
    generateCategoryHTML();
  } catch (err) { 
     console.error('An error occured', err)
  }
}

function generateCategoryHTML (limit = 10) {
  let html = '';
  let startingIndex = limit - 10;
  for ( let i = startingIndex ; i < limit; i++) {
    if (dataRetrieved[i] === undefined) { 
      break ;
    }
    html += `
      <div class="category-details">
        <p class="category-number">${i+1}</p>
        <p class="category-name">${dataRetrieved[i].categoryName}</p>
        <div class="status-box">
          ${categoryStatus(dataRetrieved[i].status)}
        </div>
        <div class="add-new-category-buttons">
          <button class="edit-btn" data-name="${dataRetrieved[i].categoryName}"><img class="edit-icon" src="icons/edit-icon.svg">Edit</button>
          <button class="delete-btn" data-name="${dataRetrieved[i].categoryName}"><img class="delete-icon" src="icons/delete-icon.svg"></button>
        </div>
      </div> 
    `
  }
  document.querySelector('.category-list').innerHTML = html;
  editEventListener();
  deleteEventListener();
  generatePagination(dataRetrieved);
}

function generatePagination (filteredData) {
  let paginationElement = document.querySelector('.pagination');
  let paginationButton = 1;
  let limit = 10
  filteredData.forEach((data, index) => {
    if (index >= limit) { 
      paginationButton++
      limit+=10;
    }
  })

  let html = '';
  for (let i = 1; i <= paginationButton; i++) { 
    html += `<button class="page-btn page${i}">${i}</button>`
  }
  paginationElement.innerHTML = html;

  paginationEventListener();
}

function paginationEventListener () { 
  document.querySelectorAll('.page-btn').forEach((button, index) => {
    index++
    button.addEventListener( 'click', () => {
      generateCategoryHTML(Number(index + "0"))
    })
  })
}

function updateCategory (dataSet) {
  dataRetrieved.forEach((data, index) => {
    if (data.categoryName === dataSet) {
      const { categoryName, status} = data;
      categoryID = data.category_ID;
      replaceValue(categoryName, status)
    }
  })
}

function replaceValue (categoryName, status) { 
  document.querySelector('.category-input').value = categoryName
  document.querySelector('.status-select').value = status;
  document.querySelector('.add-category-button').innerHTML = 'Update Category';
}

async function deleteCategory (data, index) {
  const categoryDetailsElement = document.querySelectorAll('.category-details')
  categoryDetailsElement[index].remove();

  const {error} = await supabase.from('category').delete().eq('categoryName', data)
  retrieveData();
  
  if (error) { 
    alert('There is some products who has this category!')
  } 


}

function categoryStatus (status) { 
  if (status === 'Active') { 
    return  `<p class="status">${status}</p>` 
  } else { 
    return  `<p class="status inactive">${status}</p>` 
  }
}

function addCategoryEventListener () { 
  document.querySelector('.add-category-button').addEventListener('click',() => {
    insertData();
  })
}

function editEventListener () { 
  document.querySelectorAll('.edit-btn').forEach((button, index) => {
    const dataSet = button.dataset.name;
    button.addEventListener('click', () => {
      updateCategory(dataSet);
    })
  })
}

function deleteEventListener () { 
 document.querySelectorAll('.delete-btn').forEach((button, index) => {
    const dataSet = button.dataset.name;
    button.addEventListener('click', () => {
      deleteCategory(dataSet, index);
    })
  })
}

addCategoryEventListener();
retrieveData();



/*
  <div class="category-details">
    <p class="category-number">1</p>
    <p class="category-name">Processor</p>
    <div class="status-box">
      <p class="status inactive">status</p>
    </div>
    <div class="add-new-category-buttons">
      <button class="edit-btn"><img class="edit-icon" src="icons/edit-icon.svg">Edit</button>
      <button class="delete-btn"><img class="delete-icon" src="icons/delete-icon.svg"></button>
    </div>
  </div> 
*/
