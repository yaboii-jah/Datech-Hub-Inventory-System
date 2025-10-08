import {supabase} from './supabase-client.js'

let categoryData = [{}];

async function addProduct () {
  let addedProduct = {
    name: document.querySelector('.product-name-input').value,
    stock: Number(document.querySelector('.quantity-input').value),
    status: document.querySelector('.status-select').value ,
    price: Number(document.querySelector('.price-input').value) ,
    image: document.querySelector('.file-image-input').value, 
    category_ID: Number(document.querySelector('.category-select').value)
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
      console.log(addedProduct);
      alert(`Product added to the inventory`)
      document.querySelectorAll('.product-name-input, .quantity-input, .status-select, .price-input, .file-image-input, .category-select').forEach((value) => {
        value.value = "";
      })
    }
  } else { 
    alert('please fill out all the details');
  }
}

async function retrieveCategoryData () { 
  const { data, error} = await supabase.from('category').select().eq('status', 'Active');

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
 
document.querySelector('.add-product-button').addEventListener('click', () => {
   addProduct();
});

retrieveCategoryData();

