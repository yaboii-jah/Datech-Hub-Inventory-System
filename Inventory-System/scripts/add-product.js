import {supabase} from './supabase-client.js'

async function addProduct () {
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
    const choice = confirm('Are you sure you want to add this product?')

    if (choice) { 
      const {data, error} = await supabase.from('product').insert(addedProduct).single();

      document.querySelectorAll('.product-name-input, .quantity-input, .status-select, .price-input, .file-image-input, .category-select').forEach((value) => {
        value.value = "";
      })
    }
  } else { 
    alert('please fill out all the details');
  }
}

document.querySelector('.add-product-button').addEventListener('click', () => {
  addProduct();
}) 