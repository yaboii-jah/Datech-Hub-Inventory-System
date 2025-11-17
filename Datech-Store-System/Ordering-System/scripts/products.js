import { supabase } from './supabase-client.js'

let dataRetrieved = [{}];
let category = [{}];
let filteredData = [{}];
let cart = [{}];
let customers = [{}];
const { data: { session } } = await supabase.auth.getSession();

async function retrieveData () { 
  try { 
    const {data, error} = await supabase.from('product').select(`*, category (*)`).eq('status', 'Active');

    dataRetrieved = data;
    generateProductHTML();
  } catch (error) { 
    console.error(error)
  }
}

async function retrieveCustomer () { 
  const {data, error} = await supabase.from('Customer').select();
  if (error) { 
    console.error(error.message);
  } else { 
    customers = data;
  }
}

async function retrieveCart () { 
  const {data, error} = await supabase.from('cart').select(`*, product (*), Customer (*)`);
  if (error) { 
    console.error(error);
  } else { 
    cart = data;
    updateCartQuantity();
  }
}

async function categoryRetrieve () {
  try { 
    const {data, error} = await supabase.from('category').select().eq('status', 'Active');
    category = data;
    showProductType();
  } catch (error) { 
    console.error(error);
  }
}

function showPriceFilter () {
  document.querySelector('.price-btn').addEventListener('click', () => {
    document.querySelector('.price-filter').classList.toggle('price-filter-visible');
  })
}

function showProductType () {
  let html = '';
  category.forEach((category, index) => { 
    html += `
      <option value="${category.categoryName}">${category.categoryName}</option>
    `
  })
  document.querySelector('.product-type-select').innerHTML = `
    <option value="default">All Products</option>
    ${html}
  `
}

function generateProductHTML (limit = 12) {
  filteredData = dataRetrieved.filter(productFilters);
  let html = '';
  let startingIndex = limit - 12;
  for ( let i = startingIndex; i < limit; i++ ) {
    if (filteredData[i] === undefined) { 
      break ;
    }
    html += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="../Inventory-System/${filteredData[i].image}" alt="">
      </div>
  
      <div>
        <p class="product-name">${filteredData[i].name}</p>
        <p class="product-price">&#8369;${filteredData[i].price}  <span>${filteredData[i].stock} Available </span> </p>
        <select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div>
        <div class="addtocart-message"></div>
        <button class="addtocart-btn" data-name="${filteredData[i].name}">Add to Cart</button>
      </div>
    </div>
   ` 
  }
  document.querySelector('.product-list-grid').innerHTML = html;
  document.querySelector('.total-products').innerHTML  = `${filteredData.length} products`
  addToCartEventListener();
  generatePagination(filteredData)
}

function productFilters (product) {
  const availabilityFilter = document.querySelector('.availability-select').value;
  const productTypeFilter = document.querySelector('.product-type-select').value;
  let minPriceElement = Number(document.querySelector('.min-input').value || 0);
  let maxPriceElement = Number(document.querySelector('.max-input').value || 0);
  let isValid = false;
  let searchElement = document.querySelector('.search-input').value;

  if ( availabilityFilter === 'default' && productTypeFilter === 'default' && minPriceElement === 0 && maxPriceElement === 0 && searchElement === '') {
    isValid = true;
    return isValid;
  } 
  
  // availabilityFilter
  if (availabilityFilter === 'default')  isValid = true; 
  else if ( availabilityFilter === product.category.status )  isValid = true;
  else return false;
  // priceFilter
  if (product.price >= minPriceElement && product.price <= maxPriceElement) isValid = true;
  else if ( product.price >= minPriceElement && maxPriceElement === 0)
  isValid = true; 
  else return false;

  // productTypeFilter
  if (productTypeFilter === 'default')  isValid = true; 
  else if ( productTypeFilter === product.category.categoryName )  isValid = true;
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

function generatePagination (filteredData) {
  let paginationElement = document.querySelector('.pagination');
  let paginationButton = 0;
  let limit = 0;
  filteredData.forEach((data, index) => {
    if (index >= limit) { 
      paginationButton++
      limit+=12;
    }
  })

  let html = '';
  for (let i = 1; i <= paginationButton; i++) { 
    html += `<button class="page-btn page${i}">${i}</button>`
  }
  paginationElement.innerHTML = html;

  paginationEventListener();
}

function checkCart (btn_index) { 
  const data_name = document.querySelectorAll('.addtocart-btn')[btn_index].dataset.name;
  const productQuantity = document.querySelectorAll('.quantity')[btn_index].value;
  let targetProduct = dataRetrieved.find((product) => { if ( data_name === product.name ) return product})
  let targetCart = 0;

  cart.forEach((cart) => {
    if (cart.product.name === data_name) { 
      targetCart = cart;
    }
  })

  if (session) { 
    if ( targetCart === 0 && productQuantity <= targetProduct.stock) {
      addToCart(btn_index)
      return true;
    } else if (productQuantity > targetProduct.stock) {
      alert('Cannot add above the product stock');
      return false;
    }
    
    if (targetCart.quantity + Number(productQuantity) <= targetProduct.stock) { 
      addToCart(btn_index);
      return true;
    } else {
      console.log('hello')
      alert('Cannot add above the product stock');
      return false;
    }
  } else {
    window.location.href = "./login.html"
  }
}

function addToCart (btn_index) {
  console.log('hi')
  const data_name = document.querySelectorAll('.addtocart-btn')[btn_index].dataset.name;
  const productQuantity = document.querySelectorAll('.quantity')[btn_index].value;
  
  let productsToBeAdded = [];
  dataRetrieved.forEach( async (product, index) => { 
    if ( data_name === product.name ) {
      const products = cart.find(p => p.product.name === product.name && p.Customer.email === session.user.email);
        if ( products ) {
          products.quantity += Number(productQuantity)
          products.subTotal = Number(products.quantity) * product.price;
          await updateCart(products)
        } else { 
          const customer = customers.find(c => c.email === session.user.email)
          productsToBeAdded.push({
          product_ID: product.product_ID,
          subTotal : Number(productQuantity) * product.price,
          quantity: Number(productQuantity),
          customer_ID: customer.customerID
        })
        await insertCart(productsToBeAdded)
        await retrieveCart();
      }
    }
  })
  document.querySelectorAll('.addtocart-btn')[btn_index].setAttribute('disabled', '');
  document.querySelectorAll('.addtocart-btn')[btn_index].style.cursor = 'not-allowed'
  setTimeout(() => {
    document.querySelectorAll('.addtocart-btn')[btn_index].removeAttribute('disabled')
    document.querySelectorAll('.addtocart-btn')[btn_index].style.cursor = 'pointer'
  }, 1500)
}

async function insertCart (productsToBeAdded) {
  const {error} = await supabase.from('cart').insert(productsToBeAdded).single();
  if ( error ) { 
    console.error(error)
  } else { 
  }
} 

async function updateCart (product) {
  const {error} = await supabase.from('cart').update({quantity : product.quantity, subTotal : product.subTotal}).eq('cart_id', product.cart_id);
  if ( error ) { 
    console.error(error)
  } else { 
  }
}

function checkProductStatus () { 
  let updatedProductStock = []

  dataRetrieved.forEach((product, index) => {
    if ( product.stock === 0 ) {
      product.status = 'Out of Stock';
      delete product.category
      updatedProductStock.push(product) 
    }
  })
  updateProductStatus(updatedProductStock)

}

async function updateProductStatus (updatedProductStock) { 
  const {error} = await supabase.from('product').upsert(updatedProductStock);
  if (error) { 
    console.error(error.message)
  }
}


function paginationEventListener () {
  let limit = 12
  document.querySelectorAll('.page-btn').forEach((button, index) => {
    let tempVar = limit;
    button.addEventListener( 'click', () => {
      generateProductHTML(tempVar)
    })
    limit += 12;
  })
} 

function filterEventListener () { 
  document.querySelector('.availability-select').addEventListener('input', () => {
    generateProductHTML();
  })
  document.querySelector('.product-type-select').addEventListener('input', () => {
    generateProductHTML();
  })
  document.querySelector('.min-input').addEventListener('change', () => {
    generateProductHTML();
  })
  document.querySelector('.max-input').addEventListener('change', () => {
    generateProductHTML();
  })
  document.querySelector('.search-input').addEventListener('input', () => {
   generateProductHTML();
  })
}

function addToCartEventListener () { 
  document.querySelectorAll('.addtocart-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      let cartMessageInterval;
      let cartTimer = 0;

      if (checkCart(index)) { 
        cartMessageInterval = setInterval(function () {
          let cartMessage = document.querySelectorAll('.addtocart-message')[index];
          if (cartTimer === 1500) { 
            clearInterval(cartMessageInterval);
            cartMessage.innerHTML = '';
            cartTimer = 0;
          } else { 
            cartMessage.innerHTML = `&#10004 Added`
            cartTimer+=100;
          }
        }, 100)
      }
    })
  })
} 

function updateCartQuantity () {
  let customerCart = []
  if ( session ) { 
    customerCart = cart.filter((p) => {
      if (p.Customer.email === session.user.email) { 
        return true;
      }
    }) || [];
  }
  document.querySelector('.cart-quantity-modal').innerHTML = customerCart.length;
}

await retrieveCustomer();
await categoryRetrieve();
await retrieveData();
await retrieveCart();
checkProductStatus();
filterEventListener();
showPriceFilter();
updateCartQuantity();

