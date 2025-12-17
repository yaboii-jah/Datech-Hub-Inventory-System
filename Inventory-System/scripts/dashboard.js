import {supabase} from './supabase-client.js'

let salesChart;

function checkSalesFilter() {
  const salesFilter =  document.querySelector('.sales-dropdown')
  salesFilter.addEventListener('change', () => {
    const value = salesFilter.value
    const ctx = document.querySelector('.sales-chart');
    
    switch (value) {
      case 'year' :
        salesChart.destroy()
        getMonthlySales()
        break
      case 'month' :
        salesChart.destroy()
        getDailySales()
        break;
      case 'week' :
        salesChart.destroy()
        getWeeklySales()
    }
  })
}

async function getMonthlySales () {
  const {data, error} = await supabase.rpc('get_monthly_sales_this_year')
  if (error) {
    console.error(error.message)
  } else {
    let label = []
    let chartData = []

    for ( const sales of data) {
      label.push(sales.month_name)
      chartData.push(sales.total_sales)
    }
    displaySalesChart(label, chartData)
  }
}

async function getDailySales () {
  const {data, error} = await supabase.rpc('get_daily_sales_current_month')
  if (error) {
    console.error(error.message)
  } else {
    let label = []
    let chartData = new Array(getDaysInMonth()).fill(0)
    
    for ( let i = 1; i <= getDaysInMonth(); i++ ) {
      label.push(i)
      for ( let z = 0; z < data.length; z++ ) {
        const currentDate = new Date(data[z].sale_date)
        if (label[i - 1] === currentDate.getDate() + 1) {
          chartData[i - 1] = data[z].total_sales
        }
      }
    }
    displaySalesChart(label, chartData)
  }

  function getDaysInMonth () { 
    const date = '27'
    const year = '2025'

    return new Date(date, year, 0).getDate()

  }
}

async function getWeeklySales () {
  const {data, error} = await supabase.rpc('get_weekly_sales_full')
  if (error) {
    console.error(error.message)
  } else {
    let label = []
    let chartData = new Array(7).fill(0)
    
    for ( let i = 0; i < 7; i++ ) {
      const date = new Date(data[i].sale_date)
      label.push(date.getDate() + 1)
      for ( let z = 0; z < data.length; z++ ) {
        const currentDate = new Date(data[z].sale_date)
        if (label[i - 1] === currentDate.getDate() + 1) {
          chartData[i - 1] = data[z].total_sales
        }
      }
    }
    displaySalesChart(label, chartData)
  }
}

function displaySalesChart (label, data) { 
  const ctx = document.querySelector('.sales-chart');

  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: label,
      datasets: [{
        label: '# of Sales',  
        data: data,
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
  document.querySelector('.sales').innerHTML = data[0].total_sales || '0'
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

checkSalesFilter()
getMonthlySales()
getOutOfStockProducts();
getRecentOrders()
getDashboardTotal()
