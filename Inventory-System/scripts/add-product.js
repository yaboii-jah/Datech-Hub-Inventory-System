import {supabase} from './supabase-client.js'

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

async function addProduct () {
  let addedProduct = {
    name: document.querySelector('.product-name-input').value,
    stock: Number(document.querySelector('.quantity-input').value),
    status: document.querySelector('.status-select').value ,
    price: Number(document.querySelector('.price-input').value) ,
    image: await uploadImage() || '', 
    category_ID: Number(document.querySelector('.category-select').value)
  };
  let hasValue = true;  
  console.log(addedProduct.image)
  Object.values(addedProduct).forEach((product) => {
    if ( product === '' || product === 0  ) { 
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
    const choice = confirm('Are you sure you want to add this product?')

    if (choice) { 
      const {data, error} = await supabase.from('product').insert(addedProduct).single();
      alert(`Product added to the inventory`)
      document.querySelectorAll('.product-name-input, .quantity-input, .status-select, .price-input, .file-image-input, .category-select').forEach((value) => {
        value.value = "";
      })
    }
  } else  { 
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

function addEventListener() {
  document.querySelector('#file-upload').addEventListener('change', (event) => {
    imageEvent = event.target.files[0];
    document.querySelector('.custom-file-upload').innerHTML = imageEvent ? imageEvent.name : 'Select Image' 
    console.log(imageEvent)
  })
  document.querySelector('.add-product-button').addEventListener('click', () => {
    addProduct();
  });
}

retrieveCategoryData();
addEventListener();

