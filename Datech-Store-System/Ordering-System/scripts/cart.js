//localStorage.clear();
import {supabase} from './supabase-client.js';
let cartList = [];
let cartTotal = 0;
let productList = [{}];

async function retrieveProducts () {
  try { 
    const {data, error} = await supabase.from('product').select();
    productList = data
  } catch (error) { 
    console.error(error)
  }
}

async function retrieveCart () { 
  const {data, error} = await supabase.from('cart').select(`*, product (*), Customer (*)`);
  if (error) { 
    console.error(error);
  } else { 
    cartList = data;
  }
}

function generateHTML () {
  if (cartList != '') {
    document.querySelector('.cart-section').innerHTML = `
      <div class="main-section">
      <div class="first-section"> 
        <p class="your-cart">Your cart</p>  
        <a class="continue-shopping-cart" href="index.html">Continue shopping</a>
      </div>

      <div class="second-section">
        <p class="cart-product-label">PRODUCT</p>
        <p class="cart-quantity-label">QUANTITY</p>
        <p class="cart-total-label">TOTAL</p>
      </div>  

      <div class="third-section">
     </div>

      <div class="cart-subtotal-section">
        <p class="cart-subtotal">Subtotal <span class="cart-subtotal-span"></span></p>
        <p class="cart-checkout-note">Tax included and shipping calculated at checkout</p>
        <button class="checkout-btn">Check out</button>
      </div>
    </div>
    `
    let html = '';
    cartTotal = 0;
    cartList.forEach((product, index) => { 
      cartTotal += Number(product.price) * Number(product.quantity);
      html += ` 
      <div class="cart-section-container">
        <div class="cart-image-section">
          <img class="cart-product-image" src="../Inventory-System/${product.product.image}" alt="">
        </div>

        <div class="cart-product-details-section">
          <p class="cart-product-name">${product.product.name}</p>
          <p class="cart-product-price">&#8369;${product.product.price}</p>
        </div>

        <div class="cart-quantity-section">
          <div class="cart-quantity-delete">
            <button class="subtract-quantity-btn" data-name="${product.product.name}">&#8722;</button>
            <input class="cart-product-quantity-input" value="${product.quantity}" readonly>
            <button class="add-quantity-btn" data-name="${product.product.name}">&#43;</button>
          </div>
          <button class="cart-trash-btn" data-name="${product.product.name}"><img class="cart-trash-icon" src="images/other-logo/trash-icon.svg"></button>
        </div>

        <div class="cart-total-price-section">
          <p class="cart-product-total">&#8369 ${product.subTotal}</p>
        </div>
      </div>`
    })
    document.querySelector('.third-section').innerHTML = html;
    document.querySelector('.cart-subtotal-span').innerHTML = `&#8369;${cartTotal}`;
    addEventListeners();
    updateSubTotal();
  } else { 
    document.querySelector('.cart-section').innerHTML = `
      <p class="cart-empty">Your cart is empty</p>
      <button class="continue-shopping"><a class="continue-shopping-link" href="index.html">Continue shopping</a></button>
    `
  }
} 

function addEventListeners () { 
  if (cartList != '') { 
    let addBtnElement = document.querySelectorAll('.add-quantity-btn')
    let subtractBtnElement = document.querySelectorAll('.subtract-quantity-btn');
    let cartBtnElement = document.querySelectorAll('.cart-trash-btn');

    for ( let i = 0; i < subtractBtnElement.length; i++) { 
      let dataName = addBtnElement[i].dataset.name;
      let index = i;
      subtractBtnElement[i].addEventListener('click', () => { 
        subtractQuantity(dataName);
      })
      addBtnElement[i].addEventListener('click', () => {  
        addQuantity(dataName);
      })
      cartBtnElement[i].addEventListener('click', () => {
        deleteProduct(dataName);
      })
    }

    document.querySelector('.checkout-btn').addEventListener('click', () => {
      confirmCheckout();
    })
  } 
}


function addQuantity (dataName) {
  cartList.forEach((product, index) => {
    if ( product.product.name === dataName ) {
      document.querySelectorAll('.subtract-quantity-btn')[index].removeAttribute("disabled", "");
      product.quantity++
      product.subTotal = product.quantity * product.product.price
      updateQuantity(product);
      document.querySelectorAll('.cart-product-quantity-input')[index].value = product.quantity;
      document.querySelectorAll('.cart-product-total')[index].innerHTML = `&#8369;${Number(product.product.price) * Number(product.quantity)}`
    }
  })
  updateSubTotal();
}

function subtractQuantity (dataName) {
  cartList.forEach((product, index) => {
    if ( product.product.name === dataName ) {
      if (document.querySelectorAll('.cart-product-quantity-input')[index].value !== '1' ) {
          product.quantity--
          product.subTotal-= product.product.price
          updateQuantity(product);
          document.querySelectorAll('.cart-product-quantity-input')[index].value = product.quantity;
          document.querySelectorAll('.cart-product-total')[index].innerHTML = `&#8369;${Number(product.product.price) * Number(product.quantity)}`
      } else {
         document.querySelectorAll('.subtract-quantity-btn')[index].setAttribute("disabled", "");
      }
    }
  }) 
  updateSubTotal();
}

async function updateQuantity (product) {
    const { error } = await supabase.from('cart').update({quantity : product.quantity, subTotal : product.subTotal}).eq('cart_id', product.cart_id);
}

function updateSubTotal () {
  cartTotal = 0; 
  cartList.forEach((product, index) => { 
    cartTotal += Number(product.product.price) * Number(product.quantity);
  })  
  document.querySelector('.cart-subtotal-span').innerHTML = `&#8369;${cartTotal}`;
  updateCartQuantity();
}

function deleteProduct (dataName) {
  cartList.forEach( async (product, index) => {
    if (product.product.name === dataName) {
      cartList.splice(index, 1);
      const {error} = await supabase.from('cart').delete().eq('cart_id', product.cart_id)
      if (error) { 
        console.error(error)
      }
    }
  })
  generateHTML();
  addEventListeners();
  updateCartQuantity();
}

async function fetchUUID () { 
  try {
    const response = await fetch('https://www.uuidtools.com/api/generate/v4');
    const data = await response.json();
    return data[0];
    
  } catch (error) { 
     console.log.error(error);
  }
}


 async function confirmCheckout () {
  if ( cartList.length !== 0) { 
    let choice = confirm('Are you sure you want to checkout?');
  
    if (choice) { 
      await insertOrders();
      await deleteCart();
      setTimeout(() => {window.location.href = "./checkout.html" }, 1000)
    }
  } else { 
     alert('No items in the cart');
  }
}

async function insertOrders () { 
  let orders = [];
  orders.push({
    orderID : await fetchUUID(),
    totalAmount : cartTotal,
    customerID : 1, 
    status : 'pending',
    orderEnd : getEndDate()
  })
  try { 
    const { error } = await supabase.from('orders').insert(orders[0])
    insertOrderDetails(orders);
    if (error) {
      console.error(error);
    }

  } catch (error) { 
    console.error(error)
  }
}

async function insertOrderDetails (orders) {
  let orderDetails = [];
  cartList.forEach((product) => {
    orderDetails.push({
      productID : product.product.product_ID,
      quantity : product.quantity,
      unitPrice : product.product.price,
      subTotal : product.subTotal,
      orderID :  orders[0].orderID
    })
  }); 
  try { 
    const {error} = await supabase.from('orderDetails').insert(orderDetails)
    updateProductStock(orderDetails)
    if (error) {
      console.error(error);
    }

  } catch (error) { 
    console.error(error);
  }
}

async function deleteCart () {
  cartList.forEach( async (product) => { 
     const {error} = await supabase.from('cart').delete().eq('cart_id', product.cart_id);
     if (error) {
      console.error(error);
    }
  })
}

async function updateProductStock (orderDetails) {
  let productUpdatedStock = []
   
  orderDetails.forEach((order) => {
    productList.forEach((product) => {
      if ( order.productID === product.product_ID) { 
        productUpdatedStock.push({
          product_ID : order.productID,
          name : product.name,
          stock : product.stock - order.quantity,
          status : product.status,
          price : product.price,
          image : product.image, 
          category_ID : product.category_ID
        })
      }
    })
  })

  console.log(productUpdatedStock);

  try { 
    const {error} = await supabase.from('product').upsert(productUpdatedStock)
    if (error) { 
      console.error(error)
    }
  } catch ( error) { 
    console.error(error);
  }
 
}

function getEndDate() {
  const date = new Date(); 
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 6}`
}

function updateCartQuantity () {
  document.querySelector('.cart-quantity-modal').innerHTML = cartList.length;
}

await retrieveProducts();
await retrieveCart();
generateHTML();
updateCartQuantity();

