import { products } from './product-list.js';
import { cart } from './cart-list.js'

localStorage.clear();
function generateProductHtml () {
  let html = '';
  products.forEach((product, index) => { 
   html += `
    <div class="product-container">
      <div>
        <img class="product-image" src="${product.image}" alt="">
      </div>
  
      <div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">&#8369;${product.price}</p>
        <select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div>
        <div class="addtocart-message"></div>
        <button class="addtocart-btn" data-name="${product.name}">Add to Cart</button>
      </div>
    </div>
   `
 document.querySelector('.product-list-grid')
 .innerHTML = html;
})
}

function addToCartEventListener () { 
  document.querySelectorAll('.addtocart-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      let cartMessageInterval;
      let cartTimer = 0;

      cartMessageInterval = setInterval(function () {
        
        let cartMessage = document.querySelectorAll('.addtocart-message')[index];
        if (cartTimer === 1500) { 
          clearInterval(cartMessageInterval);
          cartMessage.innerHTML = '';
          cartTimer = 0;
        } else { 
          cartMessage.innerHTML = `&#10004 Added`
          cartTimer+=100;
        }
      }, 100)
      addToCart(index);
      updateCartQuantity();
    })
  })
} 


function updateCartQuantity () { 
  document.querySelector('.cart-quantity-modal').innerHTML = cart.length;
}

function addToCart (btn_index) { 
  const data_name = document.querySelectorAll('.addtocart-btn')[btn_index].dataset.name;
  const productQuantity = document.querySelectorAll('.quantity')[btn_index].value;
  products.forEach((product, index) => { 
    if ( data_name === product.name ) {
      const products = cart.find(p => p.name === product.name);
        if ( products ) { 
          products.quantity += Number(productQuantity);
        } else { 
          cart.push({
          image: product.image,
          name: product.name,
          price: product.price,
          quantity: Number(productQuantity)
        })
      }
    }
  })
  saveData();
}

function saveData () { 
  localStorage.setItem('cart', JSON.stringify(cart));
}

generateProductHtml();
addToCartEventListener();
saveData();
updateCartQuantity();

