import {supabase} from './supabase-client.js'

function displaySalesChart () { 
  const ctx = document.querySelector('.sales-chart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [{
        label: '# of Sales',
        data: [0, 3200, 0, 0, 0, 0, 0, 4000, 0, 0, 0, 5000],
        borderWidth: 1,
        backgroundColor: 'rgb(255, 99, 132)'
      }]
    },
    options: {  
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio : false,
      responsive: true
    } 
  });
}

function displayCategorySales () { 
  const ctx = document.querySelector('.category-chart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['PSU', 'Motherboard', 'Processor', 'GPU', 'RAM', 'SSD', 'Chassis', 'Fan'],
      datasets: [{
        label: '# of Sales',
        data: [1200, 4000, 6500, 2200, 100, 2500, 15000, 4000],
        borderWidth: 0,
        backgroundColor: ['Blue', 'Green', 'Purple', 'Red', 'Yellow', 'Pink', 'Black', 'Orange']
      }]
    },
    options: {  
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio : false,
      responsive: true
    } 
  });
}

async function getDashboardTotal () { 
  const {data, error} = await supabase.rpc('get_dashboard_totals');
  if ( error ) {
    console.error(error.message)
  } else {
    replaceDashboardTotals(data)
  }
}

function replaceDashboardTotals (data) {
  document.querySelector('.users').innerHTML = data[0].total_users
  document.querySelector('.categories').innerHTML = data[0].total_categories
  document.querySelector('.products').innerHTML = data[0].total_products
  document.querySelector('.sales').innerHTML = data[0].total_sales
}

async function getRecentOrders () {
  const {data, error} = await supabase.rpc('get_recent_orders', {days_back : 7})
  if (error) { 
    console.error(error.message)
  } else {
    displayRecentOrders(data);
  }
}

function displayRecentOrders (data) {
  let html = '';
  data.forEach((order) => {
    html += ` 
      <div class="order-container">
        <p class="customer-name">${order.firstname} ${order.lastname}</p>
        <p class="orderID">${order.order_id}</p>
        <p class="total">&#8369; ${order.totalamount}</p>
        <p class="status">${order.status}</p>
      </div>
    `
  })
  document.querySelector('.order-list').innerHTML = html
}

async function getOutOfStockProducts () {
  const {data, error} = await supabase.from('product').select('*, category(*)').lte('stock', 5)
  if (error) {
    console.error(error.message) 
  } else {
    displayOutOfStock(data)
  }
}

function displayOutOfStock(data) {
  let html = '';
  data.forEach((product) => {
    html += ` 
    <div class="product-container">
      <p class="name">${product.name}</p>
      <p class="product-category">${product.category.categoryName}</p>
      <p class="product-price">&#8369; ${product.price}</p>
      <p class="product-stock">${product.stock}</p>
    </div>  
    `
  })
  document.querySelector('.product-list').innerHTML = html
}

getOutOfStockProducts();
getRecentOrders()
getDashboardTotal()
displaySalesChart()
displayCategorySales();
/*
  <div class="product-container">
    <p class="name">AMD Ryzen 5 3600 6 Core 12 Threads With Fan</p>
    <p class="product-category">Processor</p>
    <p class="product-price">&#8369; 120500</p>
    <p class="product-stock">0</p>
  </div>  
*/