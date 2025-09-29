import { cart } from './cart-list.js'
import { products } from './product-list.js';
//localStorage.clear();
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

saveData();
updateCartQuantity();
