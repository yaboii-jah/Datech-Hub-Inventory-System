import {supabase} from './supabase-client.js'

let dataRetrieved = [{}];
async function retrieveData () { 
  const { data, error} = await supabase.from('product').select();

  if (error) { 
    console.error('there is an error');
  } else {
    dataRetrieved = data;
  }
  generateProductHTML();
}
 
function generateProductHTML () { 
  const productContainerElement = document.querySelector('.product-container')
  let filteredData = dataRetrieved.filter(productFilters)
 
  let html = '';
  filteredData.forEach((productDetails, index) => {
    html += `
      <div class="product-details">
        <div class="product-name-image">
          <img class="product-image" src="${productDetails.image}">
          <p class="product-name">${productDetails.name}</p>
        </div>
          <p class="product-id">${productDetails.product_ID}</p>
          <p class="price">${productDetails.price}</p>
          <p class="stock">${productDetails.stock}</p>
          <p class="category">${productDetails.category}</p>
          <div class="status-box">
            ${productStatus(productDetails.status)}
          </div>
        <div class="action">
          <button class="edit-btn"><img class="edit-icon" src="icons/edit-icon.svg">Edit</button>
          <button class="delete-btn" data-name="${productDetails.name}"><img class="delete-icon" src="icons/delete-icon.svg"></button>
        </div>
      </div>
    `
  })
  productContainerElement.innerHTML = html;
  deleteEventListener();
}

function productFilters (product) {
  const categoryFilter = document.querySelector('.category-filter').value;
  const statusFilter = document.querySelector('.status-filter').value;
  let minPriceElement = Number(document.querySelector('.min-price-filter').value || 0);
  let maxPriceElement = Number(document.querySelector('.max-price-filter').value || 0);
  
  let isValid = false;

  if ( categoryFilter === 'default' && statusFilter === 'default' && minPriceElement === 0 && maxPriceElement === 0) {
    isValid = true;
    return isValid;
  } 
  // categoryFilter
  if (categoryFilter === 'default')  isValid = true; 
  else if ( categoryFilter === product.category )  isValid = true;
  else return false;

  // statusFilter
  if (statusFilter === 'default')  isValid = true; 
  else if ( statusFilter === product.status )  isValid = true;
  else return false;
 
  
  
  /* fix the filter when the min > 0 and max = 0, nothing appears it doesn't  work 
  also change the input value display to their current value when min > max
  */
  
  

  return isValid;
}

function productStatus (status) { 
  if (status === 'Active') { 
    return  `<p class="status">${status}</p>` 
  } else { 
    return  `<p class="status inactive">${status}</p>` 
  }
}

async function deleteProduct (data, index) {
  const productDetailsElement = document.querySelectorAll('.product-details')
  productDetailsElement[index].remove();
  await supabase.from('product').delete().eq('name', data)
  retrieveData();
}

function deleteEventListener() { 
  document.querySelectorAll('.delete-btn').forEach((button, index) => {
    let dataSet = button.dataset.name;
    button.addEventListener('click', () => {
      deleteProduct(dataSet, index);
    })
  })
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
}

retrieveData();
filterEventListener();
/*      <div class="product-details">
          <div class="product-name-image">
            <img class="product-image" src="../Javascript-Fundamentals/Projects/Bike_Ordering_System/images/drivetrain/m5120-rd.jpeg">
            <p class="product-name">Shimano Deore M5100 RD 46T </p>
          </div>
            <p class="product-id">bd8d3a46</p>
            <p class="price">1,350.00</p>
            <p class="stock">70</p>
            <p class="category">Rear Deralure</p>
            <div class="status-box">
              <p class="status">Inactive</p> 
            </div>
          <div class="action">
            <button class="edit-btn"><img class="edit-icon" src="icons/edit-icon.svg">Edit</button>
            <button class="delete-btn"><img class="delete-icon" src="icons/delete-icon.svg"></button>
          </div>
        </div>
*/ 