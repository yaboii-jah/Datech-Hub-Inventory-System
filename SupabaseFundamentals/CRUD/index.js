import {supabase} from '../supabase-client.js'

 function getData () { 
  let email = document.querySelector('.email').value;
  let firstName = document.querySelector('.first-name').value;
  let lastName = document.querySelector('.last-name').value;

  insertData(email, firstName, lastName)
}

async function insertData (email, firstName, lastName) { 

  const {data, error} =  await supabase.from('user_details').insert({email : email, first_name : firstName, 
    last_name : lastName } ).single().select();

  if (error) { 
    console.log('there is an error inserting the data');
  } else {
    console.log(data);
  }  
}

function addEventListener () { 
  document.querySelector('.send-btn').addEventListener('click', () => {
    getData();
  })
}


fetchUUID ();
addEventListener ();
