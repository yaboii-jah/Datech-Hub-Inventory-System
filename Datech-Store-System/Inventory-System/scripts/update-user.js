import {supabase} from './supabase-client.js'

let users;

async function retrieveUsers () { 
  const {data, error} = await supabase.from('users').select();
  if (error) { 
    console.error(error.message)
  } else { 
    users = data;
  }
}

function setValues () { 
  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get('userID')
  
  users.forEach((user) => {
    if (user.userID === Number(userID)) {
      document.querySelector('.firstname-input').value = user.firstName,
      document.querySelector('.lastname-input').value = user.lastName,
      document.querySelector('.username-input').value = user.username,
      document.querySelector('.password-input').value = user.password,
      document.querySelector('.user-status').value = user.status,
      document.querySelector('.add-user-role').value = user.role
    }
  })
}

async function getValues () {
  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get('userID')
  
  const userDetails = {
    userID : Number(userID),
    username : document.querySelector('.username-input').value,
    role : document.querySelector('.add-user-role').value,
    status : document.querySelector('.user-status').value,
    password : document.querySelector('.password-input').value,
    firstName : document.querySelector('.firstname-input').value,
    lastName : document.querySelector('.lastname-input').value  
  }
  await updateUserDetails(userDetails)
  window.location.href = './users.html';
}

async function updateUserDetails (userDetails) {
  const {error} = await supabase.from('users').upsert(userDetails)
  if (error) {
    console.error(error.message)
  } else { 
    alert('User Updated!')
  }
}

function updateUserEventListener () {
  document.querySelector('.btn-add-user').addEventListener('click', () => {
    getValues();
  })
}

await retrieveUsers();
setValues();
updateUserEventListener();