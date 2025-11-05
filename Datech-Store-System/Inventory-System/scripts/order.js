import { supabase } from './supabase-client.js';

let orders = [];

async function retrieveOrders () { 
  const {data, error} = await supabase.from('orders').select(`*, Customer (*)`);
  if (error) { 
    console.error(error.message)
  } else { 
    orders = data;
  }
}

async function retrieveOrderDetails (orderID) { 
  const {data, error} = await supabase.from('orderDetails').select(`*, product (*)`).eq('orderID', orderID)
  if ( error ) { 
    console.error(error.message)
  }
  return data;
}

function generateDateFilter () {
  const time = new Date()
  const formattedTime = `${time.getFullYear()}-${time.getMonth()+1}-${dateFormat(time.getDate())}`

  document.querySelector('.date-filter').innerHTML = `
    <label>Date From :</Label>
    <input type="date" class="date-picker start-date" value="2025-10-25" min="2025-10-25" max="${formattedTime}">
    <label>Date To :</label>
    <input type="date" class="date-picker end-date" value="${formattedTime}" value="2025-10-25" min="2025-10-25" max="${formattedTime}">
  `
}

function dateFormat (date) {
  let dateFormat = date;
  if ( date < 10 ) { 
    dateFormat = `0${date}`
  }
  return dateFormat;
}

function generateOrders (limit = 10) {
  let html = '';
  let startingIndex = limit - 10;
  const filteredOrderDetails = orders.filter(orderFilters)
  console.log(filteredOrderDetails)
  for ( let i = startingIndex; i < limit; i++ ) {
    if (filteredOrderDetails[i] === undefined) { 
      break ;
    }
    html += `
    <div class="order-container">
      <div class="details customer-name"> <p>${filteredOrderDetails[i].Customer.firstName} ${filteredOrderDetails[i].Customer.lastName}</p></div>
      <div class="details"><p class="order-ID">${filteredOrderDetails[i].orderID}</p></div>
      <div class="details"><p class="total">${filteredOrderDetails[i].totalAmount}</p></div>
      <div class="details"><p class="order-date">${filteredOrderDetails[i].orderDate}</p></div>
      <div class="details"><p class="status">${filteredOrderDetails[i].status}</p></div>
      <div class="action-section">
        <button class="view-btn" data-id="${filteredOrderDetails[i].orderID}"><img class="view-icon" src="icons/view-icon.svg">View</button>
        <button class="update-btn" data-id="${filteredOrderDetails[i].orderID}"><img class="update-icon" src="icons/edit-icon.svg">Edit</button>
      </div>
    </div>`
  }
  document.querySelector('.order-list').innerHTML = html;
  generatePagination(orders)
  ordersEventListener();
}

function generatePagination (filteredData) {
  let paginationElement = document.querySelector('.pagination');
  let paginationButton = 1
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

function orderFilters (order) { 
  const statusFilter = document.querySelector('.status-filter').value;
  let minPriceElement = Number(document.querySelector('.Min').value || 0);
  let maxPriceElement = Number(document.querySelector('.Max').value || 0);
  let currentTime = new Date()
  let startDate = new Date(document.querySelector('.start-date').value);
  let endDate = new Date(document.querySelector('.end-date').value);
  let formatedEndDate;
  let formatedStartDate;
  let targetDate = new Date(order.orderDate)
  let searchElement = document.querySelector('.search-filter').value;
  let isValid = false;

  if (!startDate.getTime()) {
    formatedStartDate = `${startDate.getFullYear() || 2025}-${startDate.getMonth()+1 || 10}-${startDate.getDate()+1 || 25}`
    document.querySelector('.start-date').value = formatedStartDate;
  }

  if (!endDate.getTime()) {
    formatedEndDate = `${endDate.getFullYear() || currentTime.getFullYear()}-${endDate.getMonth()+1 || currentTime.getMonth()+1}-${endDate.getDate()+1|| currentTime.getDate()}`
    document.querySelector('.end-date').value = formatedEndDate;
  }

  if ( statusFilter === 'default' && formatedStartDate === '2025-10-25' && formatedEndDate === '2025-10-29' && minPriceElement === 0 && maxPriceElement === 0 && searchElement === '') {
    isValid = true;
    return isValid;
  } 

  // statusFilter
  if (statusFilter === 'default')  isValid = true; 
  else if ( statusFilter === order.status )  isValid = true;
  else return false;

  // date filter 
  if (targetDate.getTime() >= startDate.getTime() && targetDate.getTime() <= endDate.getTime()) isValid = true
  else return false

  // priceFilter
  if (order.totalAmount >= minPriceElement && order.totalAmount <= maxPriceElement) isValid = true;
  else if ( order.totalAmount >= minPriceElement && maxPriceElement === 0)
  isValid = true; 
  else return false;
  
  // search filter
  const customerName = `${order.Customer.firstName} ${order.Customer.lastName}`
  const productNameArray = customerName.replace(/ /g, "").toLowerCase().split('');
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
  document.querySelector('.status-filter').addEventListener('input', () => {
    generateOrders();
  })
  document.querySelector('.Min').addEventListener('change', () => {
    generateOrders();
  })
  document.querySelector('.Max').addEventListener('change', () => {
    generateOrders();
  })
  document.querySelector('.start-date').addEventListener('change', () => {
    generateOrders();
  })
  document.querySelector('.end-date').addEventListener('change', () => {
    generateOrders();
  })
  document.querySelector('.search-filter').addEventListener('input', () => {
    generateOrders();
  })
}

async function generateViewModal (dataID) { 
  const targetOrder = orders.find((order) => { if(order.orderID === dataID) return order})
  const orderDetails = await retrieveOrderDetails(dataID)
  
  document.querySelector('.modal').innerHTML = `
    <div class="modal-container">
      <div class="close-container">
        <span class="close">&times;</span>
      </div>

      <div class="header-container">
        <span class="title">ORDER DETAILS</span>
      </div>

      <div class="initial-order-details">
        <div class="left-details">
          <p><span class="view-initial-details">Customer Name :</span> ${targetOrder.Customer.lastName}, ${targetOrder.Customer.firstName}</p>
          <p><span class="view-initial-details">Order Date :</span> ${targetOrder.orderDate}</p>
          <p><span class="view-initial-details">Status :</span> ${targetOrder.status}</p>
        </div>
        <div class="right-details"></div>
      </div>
      
      <div class="order-list-container"> 
        <div class="view-order-header-section">
          <p class="view-oder-header">PRODUCT</p>
          <p class="view-oder-header">QUANTITY</p>
          <p class="view-oder-header">TOTAL</p>
        </div>

        <div class="view-order-list">
          ${viewOrderList(orderDetails)}
        </div>
          
        <div class="view-order-pagination-section">
          <div class="view-order-pagination">
          </div>
        </div>

        <div class="view-order-total-section"><span class="view-order-total">Subtotal :</span> &#8369; ${targetOrder.totalAmount}</div>
      </div>
    </div>
  `
  generateViewOrderPagination(orderDetails, dataID)
  viewOrder()
}

function viewOrderList (orderDetails, limit = 3) { 
  console.log(limit)
  let html = ''
  const startingIndex = limit - 3;
  for ( let i = startingIndex; i < limit; i++) {
    if (orderDetails[i] === undefined) { 
      break;
    }
    html += `
    <div class="view-order-container">
      <div class="view-product-image-section"> 
        <img class="view-product-image" src="../Inventory-System/${orderDetails[i].product.image}">
      </div>
  
      <div class="view-order-product-details">
        <p class="view-product-name">${orderDetails[i].product.name}</p>
        <p class="view-product-price">&#8369; ${orderDetails[i].product.price} </p>
      </div>

      <div class="view-order-quantity">${orderDetails[i].quantity}</div>
      <div class="view-order-subtotal">&#8369; ${orderDetails[i].subTotal}</div>
    </div>`
  }
  return html;
}

function viewOrder () { 
  const modal = document.querySelector('.modal');
  const span = document.querySelector('.close');
  modal.style.display = 'flex'

  span.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  })
}

function generateViewOrderPagination (orderDetails, orderID) { 
  let paginationElement = document.querySelector('.view-order-pagination');
  let paginationButton = 0;
  let limit = 0;
  orderDetails.forEach((data, index) => {
    if (index >= limit) { 
      paginationButton++
      limit+=3;
    }
  })

  let html = '';
  for (let i = 1; i <= paginationButton; i++) { 
    html += `<button class="view-pagination-page-btn page${i}">${i}</button>`
  }
  paginationElement.innerHTML = html;

  viewOrderPaginationEventListener(orderDetails);
}

function viewOrderPaginationEventListener (orderDetails) {
  let tempVar = 3
  document.querySelectorAll('.view-pagination-page-btn').forEach((button, index) => {
    const limit = tempVar
    button.addEventListener( 'click', () => {
     document.querySelector('.view-order-list').innerHTML = viewOrderList(orderDetails, limit)
    })
    tempVar+=3
  })
}

function paginationEventListener () { 
  document.querySelectorAll('.page-btn').forEach((button, index) => {
    index++
    button.addEventListener( 'click', () => {
      generateOrders(Number(index + "0"))
    })
  })
}

function ordersEventListener () { 
  document.querySelectorAll('.view-btn').forEach((button, index) => {
    const orderID = button.dataset.id;
    button.addEventListener('click', () => { 
      generateViewModal(orderID)
    })
  })
}


await retrieveOrders()
generateDateFilter();
generateOrders();
filterEventListener();