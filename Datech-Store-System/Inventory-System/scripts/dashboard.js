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

displaySalesChart()
displayCategorySales();
