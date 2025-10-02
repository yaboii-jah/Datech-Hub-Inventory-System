import {supabase} from './supabase-client.js'
import {getUpdatedData} from './update-module.js';

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

/* finish the updateData, update the data on the database based on the product id of the 
   targetedData */

function replaceValues () { 
  let updatedProduct = {
    name: getUpdatedData().name,
    stock: getUpdatedData().stock,
    status: getUpdatedData().status,
    price: getUpdatedData().price,
    image: getUpdatedData().image, 
    category: getUpdatedData().category,
    product_ID: getUpdatedData().product_ID
  };

  document.querySelector('.product-name-input').value = updatedProduct.name;
  document.querySelector('.quantity-input').value = updatedProduct.stock;
  document.querySelector('.status-select').value = updatedProduct.status;
  document.querySelector('.price-input').value = updatedProduct.price;
  document.querySelector('.file-image-input').value = updatedProduct.image;
  document.querySelector('.category-select').value = updatedProduct.category;
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
      window.location.href = "./products.html";
    }
  } else { 
    alert('please fill out all the details');
  }
}

if (getUpdatedData() !== null) {
  replaceValues()
  document.querySelector('.add-product-button').addEventListener('click', () => {
    updateData();
  }) 
} else { 
  document.querySelector('.add-product-button').addEventListener('click', () => {
    addProduct();
  }) 
}

