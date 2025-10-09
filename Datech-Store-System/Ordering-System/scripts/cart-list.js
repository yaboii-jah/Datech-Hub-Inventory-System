export let cart = JSON.parse(localStorage.getItem('cart')) || []; 

export function setUpdateCart (updatedCart) { 
  cart = updatedCart;
  console.log(cart);
}

