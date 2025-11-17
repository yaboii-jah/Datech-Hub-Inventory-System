import {supabase} from './supabase-client.js'

let salesReport = [{}]
let productReport = [{}]

function checkReportType (value) { 
  if (value === 'Sales') {
    generateSalesReportHeaders();
  } else if (value === 'Product') {
    generateProductReportHeaders();
  }
}

// Product Report
async function getProductReports () { 
  const {data, error} = await supabase.rpc('product_performance_report')
  if ( error ) {
    console.error(error.message)
  } else {
    productReport = data;
  }
}

async function generateProductReportHeaders () { 
  document.querySelector('.headers').innerHTML = ` 
    <p>Product</p>
    <div class="product-details">
      <p>Category</p>
      <p>Units Sold</p>
      <p>Total Sales</p>
      <p>Stocks</p> 
      <p>Status</p>
    </div>
  `
  await generateProductFilter()
  await getProductReports();
  generateProductsReport();
  productTypeEventListener();
}

function productFilters (product) { 
  const categoryFilter = document.querySelector('.category-filter').value;
  const statusFilter = document.querySelector('.status-filter').value;
  let isValid = false;

  if ( categoryFilter === 'default' && statusFilter === 'default') {
    isValid = true;
    return isValid;
  } 

  if (categoryFilter === 'default')  isValid = true; 
  else if ( categoryFilter === product.category )  isValid = true;
  else return false;

  if (statusFilter === 'default')  isValid = true; 
  else if ( statusFilter === product.status )  isValid = true;
  else return false;

  return isValid
}

function generateProductsReport (limit = 11) { 
  let html = '';
  let startingPoint = limit - 11;
  const filteredProductReport = productReport.filter(productFilters)
  for (let i = startingPoint; i < limit; i++) { 
    if (filteredProductReport[i] === undefined ) {
      break;
    }
    html += `
    <div class="report-container">
      <p class="product-name">${filteredProductReport[i].product}</p>
      <p class="product-category">${filteredProductReport[i].category}</p>
      <p class="units-sold">${filteredProductReport[i].units_sold}</p>
      <p class="product-total-sales">&#8369; ${filteredProductReport[i].total_sales}</p>
      <p class="stocks">${filteredProductReport[i].stocks}</p>
      <p class="status">${filteredProductReport[i].status}</p>
    </div>  
    `
  }
  document.querySelector('.report-list').innerHTML = html
  generatePagination(filteredProductReport);
}

async function generateProductFilter () { 
  document.querySelector('.filters').innerHTML = ` 
    <select class="category-filter" name="category">
    </select>
    <select class="status-filter" name="status" id="">
      <option value="default">All Status</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  `
  document.querySelector('.category-filter').innerHTML = await getCategories();
}

async function getCategories () {
  const {data, error} = await supabase.from('category').select().eq('status', 'Active');
  if (error) {
    console.error(error.message);
  } else {
    let html = '<option value="default">All Categories</option>'
    data.forEach((category) => { 
      html += `
      <option value="${category.categoryName}">${category.categoryName}</option>
      `
    })
    return html;   
  }
}

function productTypeEventListener () {
  document.querySelector('.category-filter').addEventListener('change', () => {
    generateProductsReport();
  })
  document.querySelector('.status-filter').addEventListener('change', () => {
    generateProductsReport();
  })
}

//Sales Report
async function getDailySummaryReports () {
  const startDate = document.querySelector('.start-date').value || '2025-10-25'
  const endDate = document.querySelector('.end-date').value || formattedTime
  
  console.log(endDate)
  const {data, error} = await supabase.rpc('get_daily_sales_summary', {
    start_date : startDate, 
    end_date : endDate
  })
  if (error) { 
    console.error(error.message)
  } else {
    salesReport = data
  }
}

async function generateSalesReportHeaders () { 
  document.querySelector('.headers').innerHTML = `
  <p>Date</p>
  <p>Orders</p>
  <p>Items Sold</p>
  <p>Total Sales</p>
  `
  generateDateFilter();
  await getDailySummaryReports();
  generateSalesReports();
  await salesTypeEventListener();
}

function generateDateFilter () {
  const time = new Date()
  const formattedTime = `${time.getFullYear()}-${time.getMonth()+1}-${dateFormat(time.getDate())}`
  document.querySelector('.filters').innerHTML = `
    <p>Date From: </p>
    <input class="start-date" type="date" value="2025-10-25" min="2025-10-25" max="${formattedTime}">
    <p>Date To: </p>
    <input class="end-date" type="date" value="${formattedTime}" value="2025-10-25" min="2025-10-25" max="${formattedTime}">
  `
}

function dateFormat (date) {
  let dateFormat = date;
  if ( date < 10 ) { 
    dateFormat = `0${date}`
  }
  return dateFormat;
}

function generateSalesReports (limit = 11) { 
  let html = '';
  let startingPoint = limit - 11;
  for (let i = startingPoint; i < limit; i++) { 
    if (salesReport[i] === undefined ) {
      break;
    }
    html += `
    <div class="report-container">
      <p class="sale-date">${salesReport[i].sale_date}</p>
      <p class="orders">${salesReport[i].total_orders}</p>  
      <p class="items-sold">${salesReport[i].total_items_sold}</p>
      <p class="total-sales">&#8369; ${salesReport[i].total_sales}</p>
    </div>  
    `
  }
  document.querySelector('.report-list').innerHTML = html
  generatePagination(salesReport);
}

function generatePagination (reportType) {
  let paginationElement = document.querySelector('.pagination');
  let paginationButton = 1
  let limit = 11
  reportType.forEach((data, index) => {
    if (index >= limit) { 
      paginationButton++
      limit+=11;
    }
  })

  let html = '';
  for (let i = 1; i <= paginationButton; i++) { 
    html += `<button class="page-btn page${i}">${i}</button>`
  }
  paginationElement.innerHTML = html;
  paginationEventListener(reportType);
}

function paginationEventListener (reportType) { 
  let tempVar = 11;
  document.querySelectorAll('.page-btn').forEach((button, index) => {
    const limit = tempVar;
    button.addEventListener( 'click', () => {
      if ( reportType === salesReport) { 
        generateSalesReports(limit)
      } else {
        generateProductsReport(limit)
      }
    })
    tempVar+=11
  })
}

async function salesTypeEventListener () {
  document.querySelector('.start-date').addEventListener('change', async () => {
    await getDailySummaryReports();
    generateSalesReports()
  })
  document.querySelector('.end-date').addEventListener('change', async () => {
    await getDailySummaryReports();
    generateSalesReports()
  })
}

function reportTypeEventListener () { 
  document.querySelector('.report-type').addEventListener('change', () => {
    checkReportType(document.querySelector('.report-type').value);
  })
}

reportTypeEventListener()
checkReportType('Sales')
