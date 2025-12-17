import {supabase} from './supabase-client.js'
import {setUpdatedData} from './update-module.js';

let dataRetrieved = [{}];
let filteredData = [{}];
let categoryData = [{}];

async function retrieveData () { 
  const { data, error} = await supabase.from('product').
  select(`*, 
    category (
    *
    )` 
  );

  if (error) { 
    console.error('there is an error');
  } else {
    dataRetrieved = data;
    checkProductStatus()
    generateProductHTML();
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

async function checkProductStatus () {
  let productToBeUpdated =  []

  dataRetrieved.forEach((product) => {
    if (product.stock === 0 || product.status === 'Out of Stock') {
      product.status = 'Out of Stock'
      product.stock = 0;
      productToBeUpdated.push(structuredClone(product)) 
    }

    if (product.stock <= 5 && product.stock > 0) {
      product.status = 'Low Stock'
      productToBeUpdated.push(structuredClone(product)) 
    }
  })

  productToBeUpdated.forEach((product) => {
    delete product.category
  })
 
  if (productToBeUpdated.length !== 0 ) {
    updateProductStatus(productToBeUpdated)
  }
}

async function updateProductStatus (productToBeUpdated) {
  const {error} = await supabase.from('product').upsert(productToBeUpdated)
  if (error) { 
    console.error(error.message);
  }
}

function updateCategoryOption () { 
  const categoryFilterElement = document.querySelector('.category-filter');
  
  let html;
  categoryData.forEach((category, index) => {
    html += `
      <option value="${category.categoryName}">${category.categoryName}</option>
    `
  })
  categoryFilterElement.innerHTML = `
    <option value="default">All Category</option> 
    ${html}
  `
}
 

function generateProductHTML (limit = 10) {
  const productContainerElement = document.querySelector('.product-container')
  filteredData = dataRetrieved.filter(productFilters)

  let html = '';
  let startingIndex = limit - 10;
  for ( let i = startingIndex ; i < limit; i++) {
    if (filteredData[i] === undefined) { 
      break ;
    }
    html += ` 
      <div class="product-details">
        <div class="product-name-image">
          <img class="product-image" src="${filteredData[i].image}">
          <p class="product-name">${filteredData[i].name}</p>
        </div>
          <p class="product-id">${filteredData[i].product_ID}</p>
          <p class="price">${filteredData[i].price}</p>
          <p class="stock">${filteredData[i].stock}</p>
          <p class="category">${filteredData[i].category.categoryName}</p>
          <div class="status-box">
            ${productStatus(filteredData[i].status)} 
          </div>
        <div class="action">
          <button class="edit-btn" data-name="${filteredData[i].name}"><img class="edit-icon" src="icons/edit-icon.svg">Edit</button>
          <button class="delete-btn" data-name="${filteredData[i].name}"><img class="delete-icon" src="icons/delete-icon.svg"></button>
        </div>
      </div>
    `
  }
  productContainerElement.innerHTML = html;
  deleteEventListener();
  updateEventListener();
  generatePagination(filteredData);
}

function generatePagination (filteredData) {
  let paginationElement = document.querySelector('.pagination');
  let paginationButton = 1;
  let limit = 10
  filteredData.forEach((data, index) => {
    if (index >= limit) { 
      paginationButton++
      limit+=10;
    }
  })

  let html = '';
  for (let i = 1; i <= paginationButton; i++) { 
    html += `<button class="page-btn page${i}">${i}</button>`
  }
  paginationElement.innerHTML = html;

  paginationEventListener();
}

function paginationEventListener () { 
  document.querySelectorAll('.page-btn').forEach((button, index) => {
    index++
    button.addEventListener( 'click', () => {
      generateProductHTML(Number(index + "0"))
    })
  })
}

function productFilters (product) {
  const categoryFilter = document.querySelector('.category-filter').value;
  const statusFilter = document.querySelector('.status-filter').value;
  let minPriceElement = Number(document.querySelector('.min-price-filter').value || 0);
  let maxPriceElement = Number(document.querySelector('.max-price-filter').value || 0);
  let isValid = false;
  let searchElement = document.querySelector('.search-input').value;

  if ( categoryFilter === 'default' && statusFilter === 'default' && minPriceElement === 0 && maxPriceElement === 0 && searchElement === '') {
    isValid = true;
    return isValid;
  } 

  // categoryFilter
  if (categoryFilter === 'default')  isValid = true; 
  else if ( categoryFilter === product.category.categoryName )  isValid = true;
  else return false;

  // statusFilter
  if (statusFilter === 'default')  isValid = true; 
  else if ( statusFilter === product.status )  isValid = true;
  else return false;

  // priceFilter
  if (product.price >= minPriceElement && product.price <= maxPriceElement) isValid = true;
  else if ( product.price >= minPriceElement && maxPriceElement === 0)
  isValid = true; 
  else return false;
  
  // search filter
  const productNameArray = product.name.replace(/ /g, "").toLowerCase().split('');
  for ( let i = 0; i < productNameArray.length; i=0) {
    let matchText = '';   
    for ( let z = 0; z < searchElement.length; z++ ) {
      matchText += productNameArray[z];
    }
    if (matchText === searchElement.toLowerCase()) {
      isValid = true;
      break;
    } else {
      productNameArray.splice(0, 1);
      isValid = false;
    }
  }

  return isValid;
}

function filterEventListener () { 
  document.querySelector('.category-filter').addEventListener('input', () => {
    generateProductHTML();
  })
  document.querySelector('.status-filter').addEventListener('input', () => {
    generateProductHTML();
  })
  document.querySelector('.min-price-filter').addEventListener('change', () => {
    generateProductHTML();
  })
  document.querySelector('.max-price-filter').addEventListener('change', () => {
    generateProductHTML();
  })
  document.querySelector('.search-input').addEventListener('input', () => {
   generateProductHTML();
  })
}

function productStatus (status) { 
  if (status === 'Active') { 
    return  `<p class="status">${status}</p>` 
  } else if (status === 'Inactive') { 
    return  `<p class="status inactive">${status}</p>` 
  } else if ( status === 'Out of Stock') {
    return `<p class="status out-of-stock">${status}</p>` 
  } else if ( status === 'Low Stock') {
    return `<p class="status low-stock">${status}</p>` 
  }
}

function urlToPath(url, bucketName = 'Product Images') {
  const encodedBucket = encodeURIComponent(bucketName);
  const splitStr = `/object/public/${encodedBucket}/`;
  const path = url.split(splitStr)[1];
  const decodedPath = decodeURIComponent(path);

  return decodedPath; 
}

async function deleteProduct (data, index) {
  const choice = confirm('Are you sure you want to delete this product?')

  if (choice) {
    const productDetailsElement = document.querySelectorAll('.product-details')
    productDetailsElement[index].remove();

    dataRetrieved.forEach(async (product) => {
      if ( product.name === data) {
        const path = urlToPath(product.image, 'Product Images')
        console.log(path)
        await supabase.storage
        .from('Product Images')
        .remove([path]);
      }
    })

    const {error} = await supabase.from('product').delete().eq('name', data)
    if (error) { 
      console.error(error.message)
    }
    retrieveData();
  }
}

function deleteEventListener() { 
  document.querySelectorAll('.delete-btn').forEach((button, index) => {
    let dataSet = button.dataset.name;
    button.addEventListener('click', () => {
      deleteProduct(dataSet, index);
    })
  })
}

function updateProduct (dataSet) {
  filteredData.forEach((data, index) => {
    if (data.name === dataSet) {
      const {category, image, name, price, status, stock, product_ID} = data;
      setUpdatedData(category, image, name, price, status, stock, product_ID)
      window.location.replace("./update-product.html");
    }
  })
}

function updateEventListener () {
  document.querySelectorAll('.edit-btn').forEach((button) => { 
    const buttonDataSet = button.dataset.name
    button.addEventListener('click', () => {
      updateProduct(buttonDataSet);
    })
  })
}

await retrieveCategoryData();
filterEventListener();
await retrieveData();
updateEventListener();
