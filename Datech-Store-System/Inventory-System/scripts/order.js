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

function generateOrders () {
  let html = '';
  orders.forEach((order, index) => { 
    html += `
    <div class="order-container">
      <div class="details customer-name"> <p>${order.Customer.firstName} ${order.Customer.lastName}</p></div>
      <div class="details"><p class="order-ID">${order.orderID}</p></div>
      <div class="details"><p class="total">${order.totalAmount}</p></div>
      <div class="details"><p class="order-date">${order.orderDate}</p></div>
      <div class="details"><p class="status">${order.status}</p></div>
      <div class="action-section">
        <button class="view-btn"><img class="view-icon" src="icons/view-icon.svg">View</button>
        <button class="update-btn"><img class="update-icon" src="icons/edit-icon.svg">Edit</button>
      </div>
    </div>`
  })
  document.querySelector('.order-list').innerHTML = html;
}

await retrieveOrders()
generateOrders();