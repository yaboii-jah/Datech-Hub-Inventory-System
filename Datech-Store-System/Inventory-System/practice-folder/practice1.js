import {supabase} from '../scripts/supabase-client.js'


async function getSalesReport () { 
  const {data, error} =  await supabase.rpc('get_daily_sales_summary', { 
    start_date : '2025-10-25',
    end_date : '2025-11-17'
  });
  if (error) { 
    console.error(error.message)
  } else {
    getMonthlySales(data)
  }
}

function getMonthlySales (data) {
  let chartDate = Array(12).fill(0);

  for (let item of data) {
    const month = new Date(item.sale_date).getMonth(); 
    chartDate[month] += item.total_sales;
  }
  displayChart(chartDate)
}

function displayChart (chartDate) { 
  const ctx = document.querySelector('.myChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [{
        label: '# of Sales',
        data: chartDate,
        borderWidth: 1,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)'
      }]
    },
    options: {  
      scales: {
        y: {
          beginAtZero: true
        }
      },
    } 
  });
}

getSalesReport();
