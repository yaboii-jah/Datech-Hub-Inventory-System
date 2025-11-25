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
  document.querySelector('.upload-file').addEventListener('change', (event) => {
    uploadImage(event);
  })
}

async function uploadImage(event) {
  const file = event.target.files[0]; // get file from input

  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('Product Images') // bucket name
    .upload(fileName, file);

  if (error) {
    console.error(error);
  } else {
   getImageUrl(fileName);
  }
}

function getImageUrl (fileName) { 
  const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(fileName);
  console.log("Image URL:", publicUrl);
}

addEventListener ();
