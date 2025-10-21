document.querySelector('.nav-bar-container').innerHTML = `
  <div class="nav-bar">
      <div class="img-section">
        <a href="index.html"><img src="images/shop-logo/supreme_bikes_logo.avif" alt=""></a>
      </div>

      <div class="links-section">
        <button class="nav-btn"><a class="nav-links" href="">Home</a></button>
        <button class="nav-btn">Products</button>
        <button class="nav-btn"><a class="nav-links" href="">New Products</a></button>
        <button class="nav-btn"><a class="nav-links" href="">Contact</a></button>
      </div>

      <div class="search-section">
         <div class="search">
            <img class="search-icon" src="images/other-logo/search-icon.svg">
            <input class="search-input" type="text" placeholder="Search">
         </div>
      </div>

      <div class="icons-section">
        <a class="nav-icons" href="login.html"><img class="profile-icon" src="images/other-logo/profile-icon.svg" alt=""></a>
        <a class="nav-icons" href="cart.html"><img class="cart-icon" src="images/other-logo/cart-icon.svg" alt=""><p class="cart-quantity-modal">0</p></a>
        <a class="nav-icons" href="checkout.html"><img class="order-icon" src="images/other-logo/order-icon.svg" alt=""></a>
      </div>
    </div>
`