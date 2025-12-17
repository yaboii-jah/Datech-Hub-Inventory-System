import {supabase} from './supabase-client.js'
import {getUpdatedData} from './update-module.js';

let categoryData = [{}];
let imageEvent;
async function uploadImage() {
  
  const file = imageEvent

  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('Product Images') 
    .upload(fileName, file);

  if (error) {
    console.error(error);
  } else {
   return getImageUrl(fileName);
  }
}

function getImageUrl (fileName) {  
  const { data: { publicUrl } } = supabase.storage
  .from('Product Images')
  .getPublicUrl(fileName);
  return publicUrl 
}

function replaceValues () {
  document.querySelector('.product-name-input').value = getUpdatedData().name;
  document.querySelector('.quantity-input').value = getUpdatedData().stock;
  document.querySelector('.status-select').value = getUpdatedData().status;
  document.querySelector('.price-input').value = getUpdatedData().price;
  document.querySelector('.custom-file-upload').innerHTML = getUpdatedData().image
  document.querySelector('.category-select').value = getUpdatedData().category.category_ID
  document.querySelector('.add-product-button').innerHTML = 'Update Product';
  console.log(document.querySelector('.category-select'));
}

async function updateData () {
 let addedProduct = {
    name: document.querySelector('.product-name-input').value,
    stock: Number(document.querySelector('.quantity-input').value),
    status: document.querySelector('.status-select').value ,
    price: Number(document.querySelector('.price-input').value) ,
    image: getUpdatedData().image,
    category_ID: Number(document.querySelector('.category-select').value)
  };
  let hasValue = true;
  console.log(addedProduct.image)
  Object.values(addedProduct).forEach((product) => {
    if ( product === '' || product === 0) { 
      hasValue = false;
    }
  })

  if ( addedProduct.status === 'Inactive') {
    hasValue = true;
  }

  if (addedProduct.status === 'Active' && addedProduct.stock === 0) {
    alert('Please Increase The Stock')
    return
  }

  if (addedProduct.status === 'Out of Stock' && addedProduct.stock === 0) {
    hasValue = true;
  }

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

async function retrieveCategoryData () { 
  const { data, error} = await supabase.from('category').select();

  if (error) { 
    console.error('there is an error');
  } else {
    categoryData = data;
    updateCategoryOption();
  }
}

function updateCategoryOption () { 
  const categoryElement = document.querySelector('.category-select');
  
  let html;
  categoryData.forEach((category, index) => {
    html += `
      <option value="${category.category_ID}">${category.categoryName}</option>
    `
  })
  categoryElement.innerHTML = `
    <option value="" disabled selected>Select Product Category</option>
    ${html}
  `
}
function addEventListener() {
  document.querySelector('#file-upload').addEventListener('change', (event) => {
    imageEvent = event.target.files[0];
    document.querySelector('.custom-file-upload').innerHTML = imageEvent ? imageEvent.name : 'Select Image' 
  })
  document.querySelector('.add-product-button').addEventListener('click', () => {
    updateData();
  });
}

await retrieveCategoryData();
replaceValues()
addEventListener();