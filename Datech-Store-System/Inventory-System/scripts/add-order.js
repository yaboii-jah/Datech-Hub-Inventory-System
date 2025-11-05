import {supabase} from './supabase-client.js'

let orderDetails = []
let products = []
let targetProduct;

async function retrieveProducts () { 
  const {data, error} = await supabase.from('product').select(`* , category (categoryName)`).eq('status', 'Active')

  if (error) { 
    console.error(error.message)
  } else {
    products = data;
    console.log(products)
  }
}

function displayModal () {
  const modal = document.querySelector('.select-product-modal')
  modal.style.display = 'flex'

  window.addEventListener('click', (event) => {
      if (event.target == modal) {
      modal.style.display = "none";
      }
  })
  generateModal(modal)
}

function generateModal (modal) { 
modal.innerHTML = `
<div class= "product-modal">
  <input class="search-filter" type="text" placeholder="Search Product">
  <div class="product-list-container">
    <div class="products-header">
      <p>Product ID</p>
      <p>Product Name</p>
      <p>Price</p>
      <p>Stock</p>
      <p>Category</p>
    </div>

    <div class="product-list">
    </div>
    <div class="products-pagination-section">
      <div class="products-pagination">
        <button class="products-btn">1</button>
      </div>
    </div>
  </div>
</div>
 `
generateProductList();
searchFilterEventListener()
}

function searchFilterEventListener () { 
  document.querySelector('.search-filter').addEventListener('input', () => {
    generateProductList();
  })
}

function generateProductList(limit = 9) {
  let html = ''
  const startingIndex = limit - 9;
  const filteredData = products.filter(searchFilter)
  for ( let i = startingIndex; i < limit; i++)  {
    if (filteredData[i] === undefined) { 
      break;
    } 
    html += ` 
    <div class="product-container" data-id="${filteredData[i].product_ID}">
      <p class="modal-product-id">${filteredData[i].product_ID}</p>
      <p class="modal-product-name">${filteredData[i].name}</p>
      <p class="modal-product-price">&#8369; ${filteredData[i].price}</p>
      <p class="modal-product-stock">${filteredData[i].stock}</p>
      <p class="modal-product-category">${filteredData[i].category.categoryName}</p>
    </div>
    `
  }
  document.querySelector('.product-list').innerHTML = html
  productSelectEventListener();
  generatePagination(filteredData)
}

function generatePagination (filteredData) {
  let paginationElement = document.querySelector('.products-pagination');
  let paginationButton = 1;
  let limit = 9
  filteredData.forEach((data, index) => {
    if (index >= limit) { 
      paginationButton++
      limit+=9;
    }
  })

  let html = '';
  for (let i = 1; i <= paginationButton; i++) { 
    html += `<button class="products-btn page${i}">${i}</button>`
  }
  paginationElement.innerHTML = html;

  paginationEventListener();
}

function paginationEventListener () { 
  let tempVar = 9;
  document.querySelectorAll('.products-btn').forEach((button, index) => {
    const limit = tempVar
    button.addEventListener( 'click', () => {
      generateProductList(limit)
    })
    tempVar+=9;
  })
}

function searchFilter (product) { 
  let searchElement = document.querySelector('.search-filter').value;
  let isValid = false;
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

function productSelectEventListener () { 
  const productEventListener = document.querySelectorAll('.product-container');
  
  productEventListener.forEach((container) => {
    container.addEventListener('click', () => { 
      const dataID = container.dataset.id;
      replacedOrderValues(dataID)
    })
  })
}

function replacedOrderValues (dataID) {
  targetProduct = dataID
  const selectedProduct = products.find( p => { if (p.product_ID === Number(targetProduct)) return p})
  document.querySelector('.select-product').innerHTML = selectedProduct.name
  document.querySelector('.product-quantity').value = 1
  document.querySelector('.product-unit-price').innerHTML = selectedProduct.price
  document.querySelector('.product-subtotal').innerHTML = document.querySelector('.product-quantity').value * selectedProduct.price;
  document.querySelector('.select-product-modal').style.display = 'none'
}

function adjustSubTotalByQuantity (dataID) {
  if (document.querySelector('.select-product').innerHTML !== 'Select Product') {
    const selectedProduct = products.find( p => { if (p.product_ID === Number(dataID)) return p})
    document.querySelector('.product-subtotal').innerHTML = document.querySelector('.product-quantity').value * selectedProduct.price;
  } else { 
    alert('Please Select a Product');
    document.querySelector('.product-quantity').value = 0
  } 
}

function checkStock () { 

}


function addOrder () {
  if (document.querySelector('.select-product').innerHTML !== 'Select Product') { 
    const subtotal = Number(document.querySelector('.product-quantity').value) * Number(document.querySelector('.product-unit-price').innerHTML)
    const isOrder = orderDetails.find(order => {if (Number(targetProduct) === order.productID) return order})
    
    if ( isOrder ) { 
      orderDetails.forEach((order) => {
        if (Number(targetProduct) === order.productID) { 
          order.quantity+= Number(document.querySelector('.product-quantity').value);
          order.subTotal+= subtotal;
        }
      })
    } else { 
      orderDetails.push({
        productID : Number(targetProduct),
        quantity : Number(document.querySelector('.product-quantity').value),
        unitPrice : Number(document.querySelector('.product-unit-price').innerHTML),
        subTotal : subtotal
      })
    }
    generateOrderDetails()
    orderTotal();
  } else { 
    alert('Please Select a Product');
  }
}

function generateOrderDetails () {
  let html = ''
  orderDetails.forEach((orders) => {
    const selectedProduct = products.find( p => { if (p.product_ID === orders.productID) return orders })
    html += `
    <div class="order-details-container" data-id="${orders.productID}">
      <p class="product-name">${selectedProduct.name}</p>
      <p class="product-quantity-list">${orders.quantity}</p>
      <p class="product-price-list">&#8369; ${orders.unitPrice}</p>
      <p class="product-subtotal-list">&#8369; ${orders.subTotal}</p>
      <button class="delete-btn" data-id="${orders.productID}"><img class="delete-icon" src="icons/delete-icon.svg"></button>
    </div> 
    `
  })
  document.querySelector('.order-details-box').innerHTML = html
  deleteOrderDetailsEventListener();
}

function deleteOrderDetails (dataID) { 
  const deleteOrderDetailsElement = document.querySelector('.delete-btn');
  const index = orderDetails.findIndex(order => { if (order.productID === dataID) return true; })
  orderDetails.splice(index, 1);
  document.querySelectorAll('.order-details-container').forEach((container) => {
    const productID = Number(container.dataset.id);
    if ( productID === dataID) { 
      container.remove()
    }
  })
  orderTotal();
}

function deleteOrderDetailsEventListener () { 
  document.querySelectorAll('.delete-btn').forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', () => {
      const dataID = deleteBtn.dataset.id
      deleteOrderDetails(Number(dataID))
    })
  })
}

function orderTotal () { 
  let total = 0;
  orderDetails.forEach((order) => {
    total+=order.subTotal;
  })
  document.querySelector('.total-input').value = total;
}

async function createOrder () {
  let updatedProduct = []
  let isInput = true
  document.querySelectorAll('.first-name, .last-name, .address, .phone-number').forEach((element) => {
    if (element.value === '' || 0) { 
      isInput = false
    }
  })

  if (document.querySelector('.phone-number').value.length !== 11) { 
    isInput = false;
    alert('Phone number should be 11 digits')
    return;
  }

  if ( orderDetails.length === 0 ) { 
    isInput = false;
  }

  if ( isInput) { 
    let order;
    const customer = {
      firstName : document.querySelector('.first-name').value,
      lastName : document.querySelector('.last-name').value,
      address : document.querySelector('.address').value,
      phoneNumber : document.querySelector('.phone-number').value
    }

    const customerData = await insertCustomer(customer)

    order = {
      orderID : await fetchUUID(),
      totalAmount : Number(document.querySelector('.total-input').value),
      status : 'pending',
      customerID : getCustomerID(customerData),
      orderEnd : getOrderEnd()
    }

    orderDetails.forEach((orderDetail) => {
      orderDetail.orderID = order.orderID
    })

    orderDetails.forEach((orderDetails) => { 
      products.forEach((product) => {
        if (product.product_ID === orderDetails.productID) {
          updatedProduct.push({
            product_ID : product.product_ID,
            name : product.name,
            stock : product.stock - orderDetails.quantity,
            status : product.status,
            price : product.price,
            image: product.image,
            category_ID : product.category_ID
          })
        }
      })
    })

    await insertOrder(order)
    await insertOrderDetails(orderDetails)
    await updateProductDetails(updatedProduct)
    alert('Order Added!')
    setTimeout(window.location.href = "./order.html" , 1000)
  } else { 
    alert('Please Fill All The Details!')
  }
}

function getCustomerID (customerData) {
  let targetCustomerID = 0;
  customerData.forEach((customer) => { 
    if (customer.customerID > targetCustomerID) { 
      targetCustomerID = customer.customerID
    }
  })
  return targetCustomerID;
}

async function fetchUUID () { 
  try {
    const response = await fetch('https://www.uuidtools.com/api/generate/v4');
    const data = await response.json();
    console.log(data)
    return data[0];
  } catch (error) { 
     console.error(error.message);
  }
}

function getOrderEnd () { 
  let date = new Date();
  date.setDate(date.getDate() + 6)
  
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

async function insertCustomer (customer) { 
  const {data, error} = await supabase.from('Customer').insert(customer).select()
  if (error) { 
    console.error(error.message)
  } else { 
    return data;
  }
}

async function insertOrder (order) { 
  const {error} = await supabase.from('orders').insert(order)
  if (error) { 
    console.error(error.message)
  } 
}

async function insertOrderDetails (orderDetails) {
  const {error} = await supabase.from('orderDetails').insert(orderDetails)
  if (error) { 
    console.error(error.message)
  } 
}

async function updateProductDetails (updatedProductDetails) { 
  const {error} = await supabase.from('product').upsert(updatedProductDetails)
  if (error) { 
    console.error(error.message)
  } 
}

function EventListener () {
  document.querySelector('.add-order-btn').addEventListener('click', () => {
    addOrder();
  })
  document.querySelector('.select-product').addEventListener('click', () => {
    displayModal();
  })
  document.querySelector('.product-quantity').addEventListener('input', () => {
    const dataID = targetProduct
    adjustSubTotalByQuantity(dataID)
  })
  document.querySelector('.create-order-btn').addEventListener('click', () => {
    createOrder();
  })
}

await retrieveProducts();
EventListener()

/*

*/