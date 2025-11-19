import { supabase } from './supabase-client.js';

let users = []

async function retrieveUsers () { 
  const {data, error} = await supabase.from('users').select();
  if (error) { 
    console.error(error.message)
  } else { 
    users = data;
  }
}

async function logIn () { 
  const username = document.querySelector('.username');
  const password = document.querySelector('.password');
  let userID;
  let isValid = false

  users.forEach((user) => {
    if (username.value === user.username && password.value === user.password ) { 
      isValid = true;
      userID = user.userID;
    }
  })

  if (isValid) {
    await updateUserStatus(userID)
    window.location.href = './dashboard.html'
  }  else {
    alert('Invalid Details')
  } 

}

async function updateUserStatus (userID) {
  const {error} = await supabase.from('users').update({status : 'Active'}).eq('userID', userID)
  if (error) { 
    console.error(error.message)
  }
}

function logInEventListener () { 
  document.querySelector('.login-btn').addEventListener('click', () => {
    logIn();
  })
}

await retrieveUsers();
logInEventListener();

