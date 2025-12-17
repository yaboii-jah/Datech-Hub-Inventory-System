import { supabase, getSession } from './supabase-client.js'

let session = await getSession();
 
function authEventListener () {
  supabase.auth.onAuthStateChange((event, session ) => {
  if (event === 'SIGNED_IN') {
    window.location.href = 'index.html'
  } 
  if ( event === 'SIGNED_OUT') {
    window.location.href = 'index.html'
  }
  if (event === 'TOKEN_REFRESHED'){
    session = session 
  }
})
}

async function getCustomerInfo () { 
  const customerInfo = {
    email: document.querySelector('.email-input').value,
    password: document.querySelector('.password-input').value
  }
  logIn(customerInfo)
}

async function logIn (customerInfo) { 
  const {error} = await supabase.auth.signInWithPassword(customerInfo);
  if (error) { 
    console.error(error.message);
  } 
}

async function logOut () { 
  await supabase.auth.signOut();
}

function generateHTML () {
  console.log(session)
  if (!session) { 
    document.querySelector('.login-container').innerHTML = `
    <p class="login-header">Login</p>
    <div class="email-box">
      <input class="email-input" type="text" placeholder="Email">
    </div>
    <div class="password-box">
      <input class="password-input" type="password" placeholder="Password">
    </div>
    <a class="forgot-password" href="recover.html">Forgot your password?</a>
    <button class="signin-btn">Sign in</button>
    <a class="create-account" href="create-account.html">Create account</a>`
    signInEventListener();
  } else {
    document.querySelector('.login-container').innerHTML = `
    <button class="logout-btn">Log Out</button>`
    logOutEventListener();
  }
}

function signInEventListener () {
  document.querySelector('.signin-btn').addEventListener('click', () => {
    getCustomerInfo();
  })
}


function logOutEventListener () { 
  document.querySelector('.logout-btn').addEventListener('click', () => {
    logOut();
  })
}

authEventListener();
generateHTML();
