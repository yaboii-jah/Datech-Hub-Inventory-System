let products = [
  {
   image: `images/drivetrain/m5120-rd.jpeg`,
   name: `Shimano Deore M5120 RD With Clutch`,
   price: `&#8369;1,650.00`
  }, 

  {
   image: `images/drivetrain/deckas-chainring.jpg`,
   name: `Deckas Chainring 104BCD `,
   price: `&#8369;400.00`
  },

  {
   image: `images/drivetrain/cassette_11-46.jpg`,
   name: `Shimano M4100 Cassette Sprocket 11-46T`,
   price: `&#8369;1,450.00`
  },

  {
   image: `images/drivetrain/m6100-rd.jpeg`,
   name: `Shimano Deore M6100 RD with Clutch`,
   price: `&#8369;1,600.00`
  },

  
  {
   image: `images/drivetrain/m6100-crankset.jpg`,
   name: `Shimano Deore M6100 Crankset 12spd`,
   price: `&#8369;2,350.00`
  },

  {
   image: `images/drivetrain/m8100-rd.jpeg`,
   name: `Shimano Deore M8100 RD with Clutch`,
   price: `&#8369;1,600.00`
  },

  {
   image: `images/drivetrain/m4100-shifter.jpeg`,
   name: `Shimano Deore M4100 Left Shifter`,
   price: `&#8369;850.00`
  },

  {
   image: `images/drivetrain/slx-crankset.jpeg`,
   name: `Shimano SLX Crankset `,
   price: `&#8369;3,560.00`
  },
];

let html = '';

products.forEach((product, index) => { 
   html += `
    <div class="product-container">
      <div>
        <img class="product-image" src="${product.image}" alt="">
      </div>
  
      <div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${product.price}</p>
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
        <button class="addtocart-btn">Add to Cart</button>
      </div>
    </div>
   `
 document.querySelector('.product-list-grid')
 .innerHTML = html;
})