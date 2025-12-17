import {supabase} from './supabase-client.js'
let users = []

async function retrieveUsers () { 
  const {data, error} = await supabase.from('users').select();
  if (error) { 
    console.error(error.message)
  } else { 
    users = data;
  }
}

function setNavBarDetails () { 
  document.querySelector('.nav-bar').innerHTML = `
  <div class="left-section">
    <p class="page-name"></p>
    <p class="date">${getDate()}</p>
  </div>
  <div class="right-section">
    <div class="user-details">
      <p class="user-name">${getUserName()}</p>
      <p class="user-role">Store ${getUserRole()}</p>
    </div>
  </div>
  `
}

function getDate () { 
  const date = new Date()
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthName = month[date.getMonth()]
  let numDay;

  if ( date.getDate() <= 3) { 
    numDay = `${date.getDate()}rd`
  } else {
    numDay = `${date.getDate()}th`
  }

  return `${numDay} ${monthName} ${date.getFullYear()}`
}

function getUserRole () {
  let role;
  users.forEach((user) => {
    if (user.status === 'Active') {
      role = `${user.role}`
    }
  })
  return role;
}

function getUserName () {
  let username;
  users.forEach((user) => {
    if (user.status === 'Active') {
      username = `${user.firstName} ${user.lastName}`
    }
  })
  return username
}

function setPageName () {
  document.querySelector('.page-name').innerHTML = window.document.title
}

await retrieveUsers()
setNavBarDetails();
setPageName();

