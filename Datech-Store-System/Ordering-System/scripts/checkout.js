//localStorage.clear();
import {supabase} from './supabase-client.js'
let orders = [{}];
let orderDetailsData = [{}];
let cartList = [{}];

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
        const {data, error} = await supabase.from('orderDetails').select(`*, product ( * )`);
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

function generateOrderContainer (filter = 'pending') {
    let html = '';
    orders.forEach((order, index) => {
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
                ${orderDetails(index)}
            </div>
        </div>`
        })
    document.querySelector('.orders-grid').innerHTML = html;
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
                    <p class="delivery-date">Arriving on: September 19</p>
                    <p class="quantity">Quantity: ${orderDetails.quantity}</p>
                    <button class="buy-again-btn" data-id="${orderDetails.orderDetail_ID}"><img class="buy-again-icon" src="images/other-logo/buy-again-icon.svg">Buy it again</button>
                </div>

                <div class="track-package">
                    <button class="track-package-btn">Track package</button>
                </div>
            </div>`
       }
       
    })
    return html;
}

// fix buyagain button
async function buyAgain (dataSet) {
   const choice = confirm('Are you sure you want to buy this product again?')
   if ( choice ) {
    let productsToBeAdded = []; 
        orderDetailsData.forEach((data, index) => { 
            if ( dataSet === data.orderDetail_ID) {
                productsToBeAdded.push({
                    product_ID: data.productID,
                    subTotal: data.subTotal,
                    quantity: data.quantity,
                    customer_ID: 1
                })
            }
        })

        cartList.forEach((cart) => {
            if (productsToBeAdded[0].product_ID === cart.product_ID) {
                updateCart(cart, productsToBeAdded)
                productsToBeAdded = []
            }
        })

        console.log(productsToBeAdded)
        if ( productsToBeAdded.length !== 0 ) {
           await insertCart(productsToBeAdded)
        }
        await retrieveCart();
        updateCartQuantity()
    }
}

async function insertCart (productsToBeAdded) { 
    const {error} = await supabase.from('cart').insert(productsToBeAdded);
    if (error) { 
        console.error(error);
    }
}

async function updateCart(cart, productsToBeAdded) {
    productsToBeAdded[0].quantity += cart.quantity
    productsToBeAdded[0].subTotal += cart.subTotal
    const {error} = await supabase.from('cart').update({quantity : productsToBeAdded[0].quantity, subTotal : productsToBeAdded[0].subTotal}).eq('cart_id', cart.cart_id);
    if (error) { 
        console.error(error);
    }
}

function updateCartQuantity () {
  document.querySelector('.cart-quantity-modal').innerHTML = cartList.length;
}

function addEventListener () {
    document.querySelectorAll('.buy-again-button').forEach((button, index) => {
        const dataSet = button.dataset.id;
        button.addEventListener('click', () => {
            buyAgain(Number(dataSet));
        });
    });
    document.querySelector('.btn-pending').addEventListener('click', () => {
       generateOrderContainer('pending')
    })
     document.querySelector('.btn-completed').addEventListener('click', () => {
       generateOrderContainer('completed')
    })
     document.querySelector('.btn-cancelled').addEventListener('click', () => {
       generateOrderContainer('cancelled')
    })

}

await retrieveOrder();
await retrieveOrderDetails();
await retrieveCart(); 
updateCartQuantity();
generateOrderContainer();
addEventListener();

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
