import { supabase } from './supabase-client.js'

async function getCustomerDetails () {
  let isEmpty = false;
  let customerToBeAdded = {
    firstName : document.querySelector('.firstname-input').value,
    lastName : document.querySelector('.lastname-input').value,
    address : document.querySelector('.address-input').value,
    email : document.querySelector('.email-input').value,
    password : document.querySelector('.password-input').value
  }

  document.querySelectorAll('.firstname-input, .lastname-input, .address-input, .email-input, .password-input').forEach((input) => {
    if (input.value === '') {
      isEmpty = true
    }
  })
  
  if (isEmpty) { 
    alert('Please fill up all the details')
  } else { 
    await insertCustomerDetails(customerToBeAdded)
    document.querySelectorAll('.firstname-input, .lastname-input, .address-input, .email-input, .password-input').forEach((input) => {
      input.value = '';
    })
  }
}

async function insertCustomerDetails (customerDetails) { 
  const {error} = await supabase.from('Customer').insert(customerDetails);

  if (error) {
    console.error(error.message)
  } else { 
    await signUpNewUser(customerDetails)
  }
}

async function signUpNewUser (customerDetails) { 
  const {data, error} = await supabase.auth.signUp({
    email: customerDetails.email,
    password: customerDetails.password,
    options: {
      emailRedirectTo: 'http://localhost:5500/Datech-Store-System/Ordering-System/index.html',
    },
  })
  if (error) { 
    console.log(error.message)
  }

  alert('Signup successful! Please check your email to confirm.')
  await supabase.auth.signOut()
}

function addEventListener () { 
  document.querySelector('.create-btn').addEventListener('click',   (createBtn) => {
    getCustomerDetails();
  })
}

addEventListener();