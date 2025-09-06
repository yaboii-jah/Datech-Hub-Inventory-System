let cartMessageInterval;

document.querySelectorAll('.addtocart-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    let cartTimer = 0;

    clearInterval(cartMessageInterval);
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
    updateCartQuantity(index)
  })
})

let quantity = 0;

function updateCartQuantity (index) {
  quantity += Number(document.querySelectorAll('.quantity')[index].value);
  document.querySelector('.cart-quantity-modal').innerHTML = quantity;
}
