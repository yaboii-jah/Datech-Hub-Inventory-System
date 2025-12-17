//localStorage.clear();
import {supabase} from './supabase-client.js'
let orders = [{}];
let orderDetailsData = [{}];

async function retrieveOrder () { 
    try { 
        const {data, error} = await supabase.from('orders').select(`*, Customer ( * )`);
        orders = data;
    } catch (error) { 
        console.error(error);
    }
}

async function retrieveOrderDetails () { 
    try { 
        const {data, error} = await supabase.from('orderDetails').select(`*, product ( * ), orders (*)`);
        orderDetailsData = data;
    } catch (error) { 
        console.error(error);
    }
}

function generateOrderContainer () {
  const urlParams = new URLSearchParams(window.location.search);
  const trackOrder = urlParams.get('orderID')
  let html = '';
  orders.forEach((order, index) => {
    if (order.orderID=== trackOrder) { 
      html += `
        <div class="first-section">
            <div class="order-placed">
              <p class="order-placed-text">Order Placed:</p>
              <p>${order.orderDate}</p>
            </div>
            <div class="order-total">
              <p class="order-total-text">Total</p>
              <p>&#8369;${order.totalAmount}</p>
            </div>
            <div class="order-id">
              <p class="order-id-text">Order ID:</p>
              <p>${order.orderID}</p>
            </div>
        </div>
        <div class="second-section">
            ${orderDetails(index)}
            <div class="track-container">
              <div class="order-stages"> 
                <p class="Preparing tracked"> Preparing </p>
                <p class="Shipped"> Shipped </p>
                <p class="Delivered"> Delivered </p>
              </div>  
              <div class="track">
                <div class="shade"></div>
              </div>
            </div>
        </div>`
      }
    });
    document.querySelector('.order-container').innerHTML = html;
}

function orderDetails (index) { 
    let html = '';
    orderDetailsData.forEach((orderDetails) => {
       if (orders[index].orderID === orderDetails.orderID) { 
            html+= `
            <div class="order-details">
                <div class="product-image-section">
                    <img class="product-image" src="${orderDetails.product.image}">
                </div>

                <div class="product-details">
                  <p class="product-name">${orderDetails.product.name}</p>
                  ${checkOrderStatus(orderDetails, orderDetails.orders.status)}
                  <p class="quantity">Quantity: ${orderDetails.quantity}</p>
                </div>
            </div>`
       }
    })
  return html;
}

function checkOrderStatus (orderDetails ,filter) {
    let status;
    
    if (filter === 'Delivered') { 
      status = `<p class="delivery-date">Delivered on ${orderDetails.orders.orderEnd}</p>`
    } else { 
      status = `<p class="delivery-date">Arriving on ${orderDetails.orders.orderEnd}</p>`
    }
    return status;
} 

// improve code structure for trackOrder\
function trackOrder () {
  const urlParams = new URLSearchParams(window.location.search);
  const trackOrder = urlParams.get('orderID')
  const index = orders.findIndex(order => order.orderID === trackOrder)

  let progressBar = document.querySelector('.shade');
  let progressBarWidth = parseInt(getComputedStyle(progressBar).width);

  if (orders[index].status === 'Shipped') { 
    progressBar.style.width = `${progressBarWidth + 375}px `
    document.querySelector('.Shipped').classList.add('tracked')
  } else if ( orders[index].status === 'Delivered') { 
    progressBar.style.width = "100%";
    document.querySelector('.Shipped').classList.add('tracked')
    document.querySelector('.Delivered').classList.add('tracked')
  }
}

await retrieveOrder();
await retrieveOrderDetails();
generateOrderContainer();
trackOrder();