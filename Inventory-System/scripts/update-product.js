import {supabase} from './supabase-client.js'
import {getUpdatedData} from './update-module.js';

function replaceValues () {
  document.querySelector('.product-name-input').value = getUpdatedData().name;
  document.querySelector('.quantity-input').value = getUpdatedData().stock;
  document.querySelector('.status-select').value = getUpdatedData().status;
  document.querySelector('.price-input').value = getUpdatedData().price;
  document.querySelector('.file-image-input').value = getUpdatedData().image;
  document.querySelector('.category-select').value = getUpdatedData().category;
  document.querySelector('.add-product-button').innerHTML = 'Update Product';
}

async function updateData () {
 let addedProduct = {
    name: document.querySelector('.product-name-input').value,
    stock: Number(document.querySelector('.quantity-input').value),
    status: document.querySelector('.status-select').value ,
    price: Number(document.querySelector('.price-input').value) ,
    image: document.querySelector('.file-image-input').value, 
    category: document.querySelector('.category-select').value 
  };
  
  let hasValue = true;
  Object.values(addedProduct).forEach((product) => {
    if ( product === '' || product === 0) { 
      hasValue = false;
    }
  })

  if (hasValue) { 
    const choice = confirm('Are you sure you want to update this product?')

    if (choice) { 
      const {error} = await supabase.from('product').update(addedProduct).eq('product_ID', getUpdatedData().product_ID )
      localStorage.setItem('updatedData', null);
      window.location.replace("./products.html")
    }
  } else { 
    alert('please fill out all the details');
  }
}

document.querySelector('.add-product-button').addEventListener('click', () => {
  updateData();
}) 

replaceValues()