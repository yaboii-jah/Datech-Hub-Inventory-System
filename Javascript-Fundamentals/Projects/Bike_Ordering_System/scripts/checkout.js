//localStorage.clear();
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function generateOrderContainer () {
    let html = '';

    orders.forEach((order, index) => {
        html += `
        <div class="order-container">
            <div class="first-section">
                <div class="order-placed">
                <p class="order-placed-text">Order Placed:</p>
                <p>${order.orderPlaced}</p>
                </div>
                <div class="order-total">
                <p class="order-total-text">Total</p>
                <p>&#8369;${order.total}</p>
                </div>
                <div class="order-id">
                <p class="order-id-text">Order ID:</p>
                <p>${order.orderID}</p>
                </div>
            </div>
            <div class="second-section"> 
                ${orderDetails(index)}
            </div>
        </div>`
        })
    document.querySelector('.orders-grid').innerHTML = html;
    saveData();
}

function orderDetails (index) { 
    let html = '';

    orders[index].totalOrders.forEach((orderDetails) => {
       html+= `
       <div class="order-details">
            <div class="product-image-section">
                <img class="product-image" src="${orderDetails.image}">
            </div>

            <div class="product-details">
                <p class="product-name">${orderDetails.name}</p>
                <p class="delivery-date">Arriving on: September 19</p>
                <p class="quantity">Quantity: ${orderDetails.quantity}</p>
                <button class="buy-again-btn"><img class="buy-again-icon" src="images/other-logo/buy-again-icon.svg">Buy it again</button>
            </div>

            <div class="track-package">
                <button class="track-package-btn">Track package</button>
            </div>
        </div>`
    })
    return html;
}

function saveData(){
    localStorage.setItem('orders', JSON.stringify(orders));
}

generateOrderContainer();

/*
    <div class="order-details">
        <div class="product-image-section">
            <img class="product-image" src="${orderDetails.image}">
        </div>

        <div class="product-details">
            <p class="product-name">${orderDetails.name}</p>
            <p class="delivery-date">Arriving on: September 19</p>
            <p class="quantity">Quantity: ${orderDetails.quantity}</p>
            <button class="buy-again-btn"><img class="buy-again-icon" src="images/other-logo/buy-again-icon.svg">Buy it again</button>
        </div>

        <div class="track-package">
            <button class="track-package-btn">Track package</button>
        </div>
    </div>`
*/
