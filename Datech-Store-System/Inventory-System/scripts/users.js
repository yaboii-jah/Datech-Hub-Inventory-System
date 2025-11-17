import {supabase} from './supabase-client.js'

let users;

async function retrieveUsers () { 
  const {data, error} = await supabase.from('users').select();
  if (error) { 
    console.error(error.message)
  } else { 
    users = data
    console.log(data)
  }
}

function generateUserHtml () { 
  let html = ''
  const filteredUsers = users.filter(UserFilters)
  console.log(filteredUsers)
  filteredUsers.forEach((user) => {
    if ( user === undefined) { 
      return;
    }
    html += `
    <div class="user-container" data-id="${user.userID}">
      <p class="name">${user.username}</p>
      <p class="role">${user.role}</p>
      <div class="status-section"><p class="status">${user.status}</p></div>
      <p class="last-login">${user.lastLogin}</p>
      <p class="password">${user.password}</p>
      <div class="action">
        <button class="edit-btn" data-id="${user.userID}"><img class="edit-icon" src="icons/edit-icon.svg">Edit</button>
        <button class="delete-btn" data-id="${user.userID}"> <img class="delete-icon" src="icons/delete-icon.svg"></button>
      </div>
    </div>
    `
  })
  document.querySelector('.user-list').innerHTML = html;
}

function UserFilters (user) {
  const searchElement = document.querySelector('.search-filter').value
  const roleElement = document.querySelector('.select-role').value
  const statusElement = document.querySelector('.status-filter').value
  let isValid = true;
  const userName = user.username;

  if (searchElement === '' && roleElement === 'default' && statusElement === 'default') {
    isValid = true;
    return isValid;
  } 

  if (roleElement === 'default')  isValid = true; 
  else if ( roleElement === user.role )  isValid = true;
  else return false;

  if (statusElement === 'default')  isValid = true; 
  else if ( statusElement === user.status )  isValid = true;
  else return false;

  const productNameArray = userName.replace(/ /g, "").toLowerCase().split('');
  for ( let i = 0; i < productNameArray.length; i=0) {
    let matchText = '';   
    for ( let z = 0; z < searchElement.length; z++ ) {
      matchText += productNameArray[z];
    }
    if (matchText === searchElement.toLowerCase()) {
      isValid = true;
      break;
    } else {
      productNameArray.splice(0, 1);
      isValid = false;
    }
  }  
  return isValid;
}

function filterEventListener () { 
  document.querySelector('.search-filter').addEventListener('input', () => {
    generateUserHtml();
  })
  document.querySelector('.status-filter').addEventListener('change', () => {
    generateUserHtml();
  })
  document.querySelector('.select-role').addEventListener('change', () => {
    generateUserHtml();
  })
}

function deleteUser(userID) {
  const choice = confirm('Do you want do remove this user?')
  if ( choice) { 
    users.forEach(async (user, index) => {
      if (user.userID === userID) { 
        users.splice(index, 1)
        await deleteUserDatabase(user.userID)
      } 
    })

    document.querySelectorAll('.user-container').forEach((container) => {
      const userDataID = container.dataset.id;
      if (Number(userDataID) === userID) {
        container.remove();
      }
    })
  }
}

function deleteUserEventListener () { 
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    const userID = btn.dataset.id;
    btn.addEventListener('click', () => {
      deleteUser(Number(userID))
    })
  })
}

async function deleteUserDatabase (userID) { 
  const {error} = await supabase.from('users').delete().eq('userID', userID)
  if (error) { 
    console.error(error.message)
  } else {
    alert('User Deleted!')
  }
}

function updateUser(userID) { 
  users.forEach((user) => {
    if (user.userID === userID) { 
    window.location.href = `./update-user.html?userID=${userID}`
    }
  })
}

function updateUserEventListener () { 
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    const userID = btn.dataset.id;
    btn.addEventListener('click', () => {
      updateUser(Number(userID))
    })
  })
}


function addUserEventListener () { 
  document.querySelector('.add-user-btn').addEventListener('click', () => {
    window.location.href = './add-user.html'
  })
}

await retrieveUsers();
generateUserHtml();
filterEventListener();
addUserEventListener();
deleteUserEventListener();
updateUserEventListener();
