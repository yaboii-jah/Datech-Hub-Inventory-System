import {supabase} from './supabase-client.js'

async function getValues () {
  const userDetails = {
    username : document.querySelector('.username-input').value,
    role : document.querySelector('.add-user-role').value,
    status : document.querySelector('.user-status').value,
    password : document.querySelector('.password-input').value,
    firstName : document.querySelector('.firstname-input').value,
    lastName : document.querySelector('.lastname-input').value  
  }
  await insertUserDetails(userDetails)
  window.location.href = './users.html';
}

async function insertUserDetails (userDetails) {
  const {error} = await supabase.from('users').insert(userDetails)
  if (error) {
    console.error(error.message)
  } else { 
    alert('User Added!')
  }
}

function addUserEventListener () {
  document.querySelector('.btn-add-user').addEventListener('click', () => {
    getValues();
  })
}

addUserEventListener();