import { products } from './product-list.js';
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