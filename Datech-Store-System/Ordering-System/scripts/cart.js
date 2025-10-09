//localStorage.clear();
let cartList = [];
let cartTotal = 0;
cartList = JSON.parse(localStorage.getItem('cart')) || [];

function generateHTML () {
  let html = '';
  cartTotal = 0;
  cartList.forEach((product, index) => {
    cartTotal += Number(product.price) * Number(product.quantity);
    html += ` 
    <div class="cart-section-container">
      <div class="cart-image-section">
        <img class="cart-product-image" src="${product.image}" alt="">
      </div>

      <div class="cart-product-details-section">
        <p class="cart-product-name">${product.name}</p>
        <p class="cart-product-price">&#8369;${product.price}</p>
      </div>

      <div class="cart-quantity-section">
        <div class="cart-quantity-delete">
          <button class="subtract-quantity-btn" data-name="${product.name}">&#8722;</button>
          <input class="cart-product-quantity-input" value="${product.quantity}" readonly>
          <button class="add-quantity-btn" data-name="${product.name}">&#43;</button>
        </div>
        <button class="cart-trash-btn"><img class="cart-trash-icon" src="images/other-logo/trash-icon.svg"></button>
      </div>

      <div class="cart-total-price-section">
        <p class="cart-product-total">&#8369;${Number(product.price) * Number(product.quantity)}</p>
      </div>
    </div>`
  })
  document.querySelector('.third-section').innerHTML = html;
  document.querySelector('.cart-subtotal-span').innerHTML = `&#8369;${cartTotal}`;
} 

function addEventListeners () { 
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
      deleteProduct(index);
    })
  }

  document.querySelector('.checkout-btn').addEventListener('click', () => {
    confirmCheckout();
  })
}


function addQuantity (dataName) {
  cartList.forEach((product, index) => {
    if ( product.name === dataName ) {
      document.querySelectorAll('.subtract-quantity-btn')[index].removeAttribute("disabled", "");
      product.quantity++
      document.querySelectorAll('.cart-product-quantity-input')[index].value = product.quantity;
      document.querySelectorAll('.cart-product-total')[index].innerHTML = `&#8369;${Number(product.price) * Number(product.quantity)}`
    }
  })
  updateSubTotal();
}

function subtractQuantity (dataName) {
  cartList.forEach((product, index) => {
    if ( product.name === dataName ) {
      if (document.querySelectorAll('.cart-product-quantity-input')[index].value !== '1' ) {
          product.quantity--
          document.querySelectorAll('.cart-product-quantity-input')[index].value = product.quantity;
          document.querySelectorAll('.cart-product-total')[index].innerHTML = `&#8369;${Number(product.price) * Number(product.quantity)}`
      } else {
         document.querySelectorAll('.subtract-quantity-btn')[index].setAttribute("disabled", "");
      }
    }
  }) 
  updateSubTotal();
}

function updateSubTotal () {
  cartTotal = 0; 
  cartList.forEach((product, index) => { 
    cartTotal += Number(product.price) * Number(product.quantity);
  })
  document.querySelector('.cart-subtotal-span').innerHTML = `&#8369;${cartTotal}`;
  localStorage.setItem('cart', JSON.stringify(cartList));
  updateCartQuantity();
}

function deleteProduct (index) {
  cartList.splice(index, 1);
  generateHTML();
  addEventListeners();
  localStorage.setItem('cart', JSON.stringify(cartList));
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
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (choice) { 
        orders.push({
        orderPlaced :getDate(),
        total : cartTotal,
        orderID : await fetchUUID(),
        totalOrders : []
      })

      cartList.forEach((product) => {
        orders[orders.length - 1].totalOrders.push({
          image : product.image,
          name : product.name,
          quantity : product.quantity
        })
      });
      cartList = [];
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('cart', JSON.stringify(cartList));
      window.location.href = "./checkout.html"
    }
  } else { 
     alert('No items in the cart');
  }
}

function getDate() { 
  let time = new Date();
  let month = '';
  switch (time.getMonth()) { 
    case 1: 
      month = 'January';
      break;
    case 2: 
      month = 'February';
      break;
    case 3: 
      month = 'March';
      break;
    case 4: 
      month = 'April';
      break;
    case 5: 
      month = 'May';
      break;
    case 6: 
      month = 'June';
      break;
    case 7: 
      month = 'July';
      break;
    case 8: 
      month = 'August';
      break;
    case 9: 
      month = 'September';
      break;
    case 10: 
      month = 'October';
      break;
    case 11: 
      month = 'November';
      break;
    case 12: 
      month = 'December';
      break;
  }

  return `${month} ${time.getDate()} `
}

function updateCartQuantity () {
  document.querySelector('.cart-quantity-modal').innerHTML = cartList.length;
}

generateHTML();
addEventListeners();
updateCartQuantity();