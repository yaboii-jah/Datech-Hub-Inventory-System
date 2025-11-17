import {supabase} from './supabase-client.js'
import { getSession } from './supabase-client.js';

let orders = [{}];
let orderDetailsData = [{}];
let cartList = [{}];
let customerCart = [];
let session = await getSession();

async function retrieveOrder () { 
    const {data, error} = await supabase.from('orders').select(`*, Customer ( * )`);
    orders = data;
    if (error) {
        console.error(error)
    }
}

async function retrieveOrderDetails () { 
    try { 
        const {data, error} = await supabase.from('orderDetails').select(`*, product ( * ), orders ( * )`);
        orderDetailsData = data;
    } catch (error) { 
        console.error(error);
    }
}

async function retrieveCart () { 
  const {data, error} = await supabase.from('cart').select(`*, product (*), Customer (*)`);
  cartList = data;
  if (error) { 
    console.error(error);
  } 
}

function getCustomerCart () {
  if ( session ) { 
    customerCart = cartList.filter((c) => { 
      if (c.Customer.email === session.user.email ) {
        return true; 
      }
    })
  }
}

function generateOrderContainer (filter = 'All') {
    let html = '';
    if ( session ) { 
        orders.forEach((order, index) => {
            if (session.user.email === order.Customer.email) {
                if ( filter !== 'All') { 
                    if (order.status === filter) { 
                        html += `
                        <div class="order-container">
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
                                <div>
                                ${orderDetails(index)}
                                </div>
                                <div class="track-package">
                                    ${getOrderStatus(order)}
                                </div> 
                            </div>
                        </div>`
                    }
                } else { 
                    html += `
                    <div class="order-container">
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
                            <div>
                            ${orderDetails(index)}
                            </div>
                            <div class="track-package">
                                ${getOrderStatus(order)}
                            </div> 
                        </div>
                    </div>`

                }
            }
        });
    }
    document.querySelector('.orders-grid').innerHTML = html;
    trackCancelEventListener();
}

function orderDetails (index) { 
    let html = '';
    orderDetailsData.forEach((orderDetails) => {
       if (orders[index].orderID === orderDetails.orderID) { 
            html+= `
            <div class="order-details">
                <div class="product-image-section">
                    <img class="product-image" src="../Inventory-System/${orderDetails.product.image}">
                </div>

                <div class="product-details">
                    <p class="product-name">${orderDetails.product.name}</p>
                    ${checkOrderStatus(orderDetails)}
                    <p class="quantity">Quantity: ${orderDetails.quantity}</p>
                    <button class="buy-again-btn" data-id="${orderDetails.orderDetail_ID}"><img class="buy-again-icon" src="images/other-logo/buy-again-icon.svg">Buy it again</button>
                </div>
            </div>`
       }
    })
    return html;
}

function getOrderStatus (order) { 
    let status;
    const orderStatus = order.status
    if ( orderStatus === 'Cancelled') {
       status = `Reason : ${order.reason}` 
    } else if ( orderStatus === 'Shipped' || orderStatus === 'pending') { 
       status = `
            <button class="cancel-package-btn" data-id="${order.orderID}">Cancel Order</button>
            <button class="track-package-btn" data-id="${order.orderID}">Track Order</button>
       `
    } else if ( orderStatus === 'Delivered') { 
        status = `
            <button class="track-package-btn" data-id="${order.orderID}">Track Order</button>
        `
    }
    return status;
} 

function checkOrderStatus (orderDetails) {
    let status;
    const orderStatus = orderDetails.orders.status;
    const time = new Date();
    
    if ( orderStatus === 'pending' || orderStatus === 'Shipped') { 
        status = `<p class="delivery-date">Arriving on ${orderDetails.orders.orderEnd}</p>`
    } else if ( orderStatus === 'Delivered') { 
        status = `<p class="delivery-date">Delivered on ${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}</p>`
    } else if ( orderStatus === 'Cancelled') { 
        status = `<p class="delivery-date">Order Cancelled on ${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}</p>`
    }
    return status;
} 

function generateModal () { 
    document.querySelector('.modal').innerHTML = `
       <div class="modal-container">
            <div class="close-container">
                <span class="close">&times;</span>
            </div>
            <div>
                <p class="cancel-reminder">Are you sure to cancel this order?</p>
                <label class="cancel-label">What is the reason you want to cancel this order?</label>
                <textarea class="cancel-reason" rows="7" cols="63" placeholder="Why do you want to cancel this order"></textarea>
            </div>
            <div>
                <button class="cancel-yes">Yes</button>
                <button class="cancel-no">No</button>
            </div>
        </div>
    `
}

async function buyAgain (dataSet) {
   const targetProduct = orderDetailsData.find((order) => { if (dataSet === order.orderDetail_ID) return order; })

   if ( targetProduct.quantity <= targetProduct.product.stock) {
        const choice = confirm('Are you sure you want to buy this product again?')
        if ( choice ) {
            const productsToBeAdded = { 
                product_ID: targetProduct.productID,
                subTotal: targetProduct.subTotal,
                quantity: targetProduct.quantity,
                customer_ID: targetProduct.orders.customerID
            }

            customerCart.forEach((cart) => {
                if (productsToBeAdded.product_ID === cart.product_ID) {
                    updateCart(cart, productsToBeAdded)
                    productsToBeAdded = []
                }
            })
            if ( productsToBeAdded.length !== 0 ) {
            await insertCart(productsToBeAdded)
            }
            await retrieveCart();
            getCustomerCart();
            updateCartQuantity()
        }
    } else { 
        alert('Cannot add beyond the product stock')
    }
}

async function insertCart (productsToBeAdded) { 
    const {error} = await supabase.from('cart').insert(productsToBeAdded);
    if (error) { 
        console.error(error);
    }
}

async function updateCart(cart, productsToBeAdded) {
    productsToBeAdded.quantity += cart.quantity
    productsToBeAdded.subTotal += cart.subTotal
    const {error} = await supabase.from('cart').update({quantity : productsToBeAdded.quantity, subTotal : productsToBeAdded.subTotal}).eq('cart_id', cart.cart_id);
    if (error) { 
        console.error(error);
    }   
}

function trackCancelEventListener () {
    document.querySelectorAll('.buy-again-btn').forEach((button, index) => {
        const dataSet = button.dataset.id;
        button.addEventListener('click', () => {
            buyAgain(Number(dataSet));
        });
    });
   
    document.querySelectorAll('.track-package-btn').forEach((button) => {
       const dataId = button.dataset.id;
       button.addEventListener('click', () => {
           window.location.href = `./track-package.html?orderID=${dataId}`
       })
    })

    document.querySelectorAll('.cancel-package-btn').forEach((button, index) => {
       const dataId = button.dataset.id;
       button.addEventListener('click', () => {
            showModal(dataId);
       })
    })
}

function showModal (dataID) { 
   const orderStatus = orders.find(order => order.orderID === dataID) 

   if ( orderStatus.status !== 'Shipped') { 
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

        document.querySelector('.cancel-yes').addEventListener('click', async () => {
                await cancelOrder(dataID);
        })

        document.querySelector('.cancel-no').addEventListener('click', () => {
            modal.style.display = 'none'
        })
   } else { 
        alert(`Order is already shipped`);
   }
}

async function cancelOrder (dataID) {
   const orderStatus = orders.find(order => order.orderID === dataID)
   const modal = document.querySelector('.modal');
   const cancelReason = document.querySelector('.cancel-reason').value
   const updatedProductStock = [];

   if ( orderStatus.status === 'pending') { 
        if (cancelReason !== '') { 
            orderDetailsData.forEach((order) => {
                if (order.orderID === dataID) {
                    updatedProductStock.push({
                        product_ID : order.productID,
                        name : order.product.name,
                        stock : order.product.stock + order.quantity,
                        status : order.product.status,
                        price : order.product.price,
                        image : order.product.image,
                        category_ID : order.product.category_ID
                    })
                }
            })
            updateProductStock(updatedProductStock);
            await updateOrderStatus(dataID, cancelReason);
            await retrieveOrder();
            modal.style.display = 'none'
            alert('Order Successfully Cancelled!')
            window.location.href = "./checkout.html"
        } else { 
            alert('Please provide an explanation')
        }
   } 
}

async function updateProductStock (updatedProductStock) { 
    const {productError} = await supabase.from('product').upsert(updatedProductStock)
    if (productError) { 
        console.error(productError);
    }
}

async function updateOrderStatus (dataID, reason) { 
    const {orderError} = await supabase.from('orders').update({status : 'Cancelled', reason : reason}).eq('orderID', dataID);
    if (orderError) { 
        console.error(orderError);
    }
}

function updateCartQuantity () {
  document.querySelector('.cart-quantity-modal').innerHTML = customerCart.length;
}

function addEventListener () {
    document.querySelector('.btn-pending').addEventListener('click', () => {
       generateOrderContainer('pending')
    })
     document.querySelector('.btn-completed').addEventListener('click', () => {
       generateOrderContainer('Delivered')
    })
     document.querySelector('.btn-cancelled').addEventListener('click', () => {
       generateOrderContainer('Cancelled')
    })
      document.querySelector('.btn-shipped').addEventListener('click', () => {
       generateOrderContainer('Shipped')
    })
      document.querySelector('.btn-all').addEventListener('click', () => {
       generateOrderContainer('All')
    })
}

await retrieveOrder();
await retrieveOrderDetails();
await retrieveCart();
getCustomerCart();
updateCartQuantity();
generateOrderContainer();
generateModal();
addEventListener();