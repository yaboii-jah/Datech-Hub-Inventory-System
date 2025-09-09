//localStorage.clear();
let cartList = [];
let html = '';
let cartTotal = 0;
cartList = JSON.parse(localStorage.getItem('cart')) || [];
console.log(cartList)

function generateHTML () { 
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
          <input class="cart-product-quantity-input" type="number" value="${product.quantity}">
          <button class="cart-trash-btn"><img class="cart-trash-icon" src="images/other-logo/trash-icon.svg"></button>
        </div>
      </div>

      <div class="cart-total-price-section">
        <p class="cart-product-total">&#8369;${Number(product.price) * Number(product.quantity)}</p>
      </div>
    </div>`
  })
  document.querySelector('.third-section').innerHTML = html;
  document.querySelector('.cart-subtotal-span').innerHTML = `&#8369;${cartTotal}`;
}

generateHTML();