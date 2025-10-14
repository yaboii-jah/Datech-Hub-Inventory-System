function isProductExtension () { 
  if ( localStorage.getItem('isProductExtension') === 'true') { 
    return ` 
    <div class="product-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./add-product.html">Add product</a>
    </div>
    <div class="product-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./products.html">Manage Products</a>
    </div> `
   } else { 
    return '';
   }
}

function isChevron () {
  if ( localStorage.getItem('isProductExtension') === 'true') { 
    return `icons/chevron-up-icon.svg`
  } else {
    return `icons/chevron-down-icon.svg`
  }
}

document.querySelector('.sidebar').innerHTML 
  = 
  ` <div class="first-section">
      </div>

    <div class="second-section">
      <div class="side-dashboard sidebar-links">
        <img class="sidebar-image" src="icons/dashboard-icon.svg">
        <a class="sidebar-link" href="">Dashboard</a>
      </div>
      <div class="side-products sidebar-links">
        <img class="sidebar-image" src="icons/product-icon.svg">
        <button class="sidebar-product-button">Products</button>
        <img class="sidebar-image product-chevron-icon" src="${isChevron()}">
      </div>

      <div class="products-extension-section">${isProductExtension()}</div>

      <div class="side-category sidebar-links">
        <img class="sidebar-image" src="icons/category-icon.svg">
        <a class="sidebar-link" href="./category.html">Category</a>
      </div>
      <div class="side-order sidebar-links">
        <img class="sidebar-image" src="icons/order-icon.svg">
        <a class="sidebar-link" href="./order.html">Orders</a>
        <img class="sidebar-image category-chevron-icon" src="icons/chevron-down-icon.svg">
      </div>
      <div class="side-order sidebar-links">
         <img class="sidebar-image" src="icons/report-icon.svg">
        <a class="sidebar-link" href="">Report</a>
      </div>
    </div>

    <div class="third-section">
      <div class="side-settings sidebar-links">
        <img class="sidebar-image" src="icons/settings-icon.svg">
        <a class="sidebar-link" href="">Settings</a>
      </div>
      <div class="side-logout sidebar-links">
        <img class="sidebar-image" src="icons/logout-icon.svg">
        <a class="sidebar-link" href="">Logout</a>
      </div>
    </div> 
  `
document.querySelector('.sidebar-product-button').addEventListener('click', () => {
  const productExtensionElement = document.querySelector('.products-extension-section')

  if(productExtensionElement.innerHTML === '') {
    productExtensionElement.innerHTML = `
    <div class="product-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./add-product.html">Add product</a>
    </div>
    <div class="product-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./products.html">Manage Products</a>
    </div> `
    localStorage.setItem('isProductExtension', 'true')
    document.querySelector('.product-chevron-icon').setAttribute('src', isChevron());
  } else {
    productExtensionElement.innerHTML = '';
    localStorage.setItem('isProductExtension', 'false')
    document.querySelector('.product-chevron-icon').setAttribute('src', isChevron());
  }
})

/*  
  <div class="products-extension-section activated">     
    <div class="product-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="add-product.html">Add product</a>
    </div>
    <div class="product-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="add-product.html">Manage Products</a>
    </div>
  </div>




.products-extension-section {
  display: flex;
  flex-direction: column;
}

.extension-link { 
  color: white;
  font-size: 14px;
  text-decoration: none;
}

.extension-link:hover {
  opacity: 0.8;
}

.product-extension {
  display: flex;
  align-items: center;
  margin-left: 40px;
}

.product-dot-icon {
  width: 25px;
}
*/