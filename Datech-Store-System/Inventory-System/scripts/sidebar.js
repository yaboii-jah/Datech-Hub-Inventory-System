import {supabase} from './supabase-client.js'

let users = []

async function retrieveUsers () { 
  const {data, error} = await supabase.from('users').select();
  if (error) { 
    console.error(error.message)
  } else { 
    users = data;
  }
}

function checkUserRole () { 
  const activeUser = users.find((user) => {  if (user.status === 'Active') return user})

  if (activeUser.role === 'Admin') { 
    generateSideBar('Admin');
    generateProductExtension('Admin');
    generateOrderExtension();
    generateUserExtension();
  } else {
    generateSideBar('Staff');
    generateProductExtension('Staff');
    generateOrderExtension();
  }
  eventListener();
}


function generateSideBar (role) {
  if (role === 'Admin') {
    document.querySelector('.sidebar').innerHTML 
    = 
    ` 
      <div class="first-section">
          <img class="logo" src="./images/login/553500235_828562962933788_5955920113283277374_n.png">
      </div>

      <div class="second-section">
        <div class="side-dashboard sidebar-links">
          <img class="sidebar-image" src="icons/dashboard-icon.svg">
          <a class="sidebar-link" href="./dashboard.html">Dashboard</a>
        </div>
        <div class="side-products sidebar-links">
        </div>

        <div class="products-extension-section"></div>

        <div class="side-category sidebar-links">
          <img class="sidebar-image" src="icons/category-icon.svg">
          <a class="sidebar-link" href="./category.html">Category</a>
        </div>

        <div class="side-order sidebar-links">
        </div>

        <div class="orders-extension-section"></div>

        <div class="side-report sidebar-links">
          <img class="sidebar-image" src="icons/report-icon.svg">
          <a class="sidebar-link" href="./reports.html">Report</a>
        </div>

        <div class="side-users sidebar-links"></div>

        <div class="users-extension-section"></div>

        <div class="side-settings sidebar-links">
          <img class="sidebar-image" src="icons/settings-icon.svg">
          <a class="sidebar-link" href="">Settings</a>
        </div>
      </div>

      <div class="third-section">
        <div class="side-logout sidebar-links">
          <img class="sidebar-image" src="icons/logout-icon.svg">
          <button class="sidebar-logout-button">Logout</button>
        </div>
      </div> 
    `
  } else if (role === 'Staff') {
    document.querySelector('.sidebar').innerHTML 
    = 
    ` 
      <div class="first-section">
          <img class="logo" src="./images/login/553500235_828562962933788_5955920113283277374_n.png">
      </div>

      <div class="second-section">
        <div class="side-products sidebar-links">
        </div>

        <div class="products-extension-section"></div>

        <div class="side-order sidebar-links">
        </div>

        <div class="orders-extension-section"></div>

        <div class="side-settings sidebar-links">
          <img class="sidebar-image" src="icons/settings-icon.svg">
          <a class="sidebar-link" href="">Settings</a>
        </div>
      </div>

      <div class="third-section">
        <div class="side-logout sidebar-links">
          <img class="sidebar-image" src="icons/logout-icon.svg">
          <button class="sidebar-logout-button">Logout</button>
        </div>
      </div> 
    `
  }
}

async function logOut () { 
  const logOut = confirm('Are you sure you want to log out?')

  if (logOut) {
    let userID;

    users.forEach((user) => {
      if ( user.status === 'Active') {
        userID = user.userID;
      }
    })

    const {error} = await supabase.from('users').update({status : 'Inactive'}).eq('userID', userID)
    if (error) { 
      console.error(error.message)
    } else {
      window.location.href = './login.html'
    }
  }
}

function eventListener () {
  document.querySelector('.sidebar-logout-button').addEventListener('click', () => {
    logOut();
  })
}

function isProductExtension (role) { 
  if ( localStorage.getItem('isProductExtension') === 'true') { 
    if (role === 'Admin') {
      return ` 
        <div class="product-extension">
          <img class="product-dot-icon" src="icons/product-dot-icon.svg">
          <a class="extension-link" href="./add-product.html">Add product</a>
        </div>
        <div class="product-extension">
          <img class="product-dot-icon" src="icons/product-dot-icon.svg">
          <a class="extension-link" href="./products.html">Manage Products</a>
        </div> `
    } else if ( role === 'Staff' ) {
       return ` 
        <div class="product-extension">
          <img class="product-dot-icon" src="icons/product-dot-icon.svg">
          <a class="extension-link" href="./products.html">Manage Products</a>
        </div> `
    }
  } else { 
    return '';
  }
}

function isProductChevron () {
  if ( localStorage.getItem('isProductExtension') === 'true') { 
    return `icons/chevron-up-icon.svg`
  } else {
    return `icons/chevron-down-icon.svg`
  }
}

function generateProductExtension (role) { 
  document.querySelector('.side-products').innerHTML 
  =  `
  <img class="sidebar-image" src="icons/product-icon.svg">
  <button class="sidebar-product-button">Products</button>
  <img class="sidebar-image product-chevron-icon" src="${isProductChevron()}">
  `
  document.querySelector('.products-extension-section').innerHTML
  = `${isProductExtension(role)}`

  productExtensionEventListener(role);
}

function productExtensionEventListener (role) { 
  document.querySelector('.sidebar-product-button').addEventListener('click', () => {
    const productExtensionElement = document.querySelector('.products-extension-section')

    if(productExtensionElement.innerHTML === '') {
      if ( role === 'Admin') {
        productExtensionElement.innerHTML = `
        <div class="product-extension">
          <img class="product-dot-icon" src="icons/product-dot-icon.svg">
          <a class="extension-link" href="./add-product.html">Add product</a>
        </div>
        <div class="product-extension">
          <img class="product-dot-icon" src="icons/product-dot-icon.svg">
          <a class="extension-link" href="./products.html">Manage Products</a>
        </div> `
      } else if ( role === 'Staff') {
         productExtensionElement.innerHTML = `
          <div class="product-extension">
            <img class="product-dot-icon" src="icons/product-dot-icon.svg">
            <a class="extension-link" href="./products.html">Manage Products</a>
          </div> `
        }
        localStorage.setItem('isProductExtension', 'true')
        document.querySelector('.product-chevron-icon').setAttribute('src', isProductChevron());
    } else {
      productExtensionElement.innerHTML = '';
      localStorage.setItem('isProductExtension', 'false')
      document.querySelector('.product-chevron-icon').setAttribute('src', isProductChevron());
    }
  })
}

function generateOrderExtension () {
  document.querySelector('.side-order').innerHTML 
  = `
  <img class="sidebar-image" src="icons/order-icon.svg">
  <button class="sidebar-order-button">Orders</button>
  <img class="sidebar-image category-chevron-icon" src="${isOrderChevron()}">
  `
  document.querySelector('.orders-extension-section').innerHTML
  = `${isOrderExtension()}`

  orderExtensionEventListener();
}

function isOrderExtension () { 
  if ( localStorage.getItem('isOrdersExtension') === 'true') { 
    return ` 
    <div class="orders-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./add-order.html">Add Order</a>
    </div>
    <div class="orders-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./order.html">Manage Orders</a>
    </div> `
   } else { 
    return '';
   }
}

function isOrderChevron () {
  if ( localStorage.getItem('isOrdersExtension') === 'true') { 
    return `icons/chevron-up-icon.svg`
  } else {
    return `icons/chevron-down-icon.svg`
  }
}

function orderExtensionEventListener () { 
  document.querySelector('.sidebar-order-button').addEventListener('click', () => {
    const ordersExtensionElement = document.querySelector('.orders-extension-section')

    if(ordersExtensionElement.innerHTML === '') {
      ordersExtensionElement.innerHTML = `
      <div class="orders-extension">
        <img class="product-dot-icon" src="icons/product-dot-icon.svg">
        <a class="extension-link" href="./add-order.html">Add Order</a>
      </div>
      <div class="orders-extension">
        <img class="product-dot-icon" src="icons/product-dot-icon.svg">
        <a class="extension-link" href="./order.html">Manage Orders</a>
      </div> `
      localStorage.setItem('isOrdersExtension', 'true')
      document.querySelector('.category-chevron-icon').setAttribute('src', isOrderChevron());
    } else {
      ordersExtensionElement.innerHTML = '';
      localStorage.setItem('isOrdersExtension', 'false')
      document.querySelector('.category-chevron-icon').setAttribute('src', isOrderChevron());
    }
  })
}

function isUserExtension () { 
  if ( localStorage.getItem('isUsersExtension') === 'true') { 
    return ` 
    <div class="users-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./add-user.html">Add Users</a>
    </div>
    <div class="users-extension">
      <img class="product-dot-icon" src="icons/product-dot-icon.svg">
      <a class="extension-link" href="./users.html">Manage Users</a>
    </div> `
   } else { 
    return '';
   }
}

function isUserChevron () {
  if ( localStorage.getItem('isUsersExtension') === 'true') { 
    return `icons/chevron-up-icon.svg`
  } else {
    return `icons/chevron-down-icon.svg`
  }
}

function generateUserExtension () { 
  document.querySelector('.side-users').innerHTML 
  =  `
   <img class="sidebar-image" src="icons/users-icon.svg">
   <button class="sidebar-users-button">Users</button>
   <img class="sidebar-image users-chevron-icon" src="${isUserChevron()}">
  `
  document.querySelector('.users-extension-section').innerHTML
  = `${isUserExtension()}`

  UserExtensionEventListener();
}

function UserExtensionEventListener () { 
  document.querySelector('.sidebar-users-button').addEventListener('click', () => {
    const usersExtensionElement = document.querySelector('.users-extension-section')

    if(usersExtensionElement.innerHTML === '') {
      usersExtensionElement.innerHTML = `
      <div class="users-extension">
        <img class="product-dot-icon" src="icons/product-dot-icon.svg">
        <a class="extension-link" href="./add-user.html">Add Users</a>
      </div>
      <div class="users-extension">
        <img class="product-dot-icon" src="icons/product-dot-icon.svg">
        <a class="extension-link" href="./users.html">Manage Users</a>
      </div> `
      localStorage.setItem('isUsersExtension', 'true')
      document.querySelector('.users-chevron-icon').setAttribute('src', isUserChevron());
    } else {
      usersExtensionElement.innerHTML = '';
      localStorage.setItem('isUsersExtension', 'false')
      document.querySelector('.users-chevron-icon').setAttribute('src', isUserChevron());
    }
  })
} 

await retrieveUsers()
checkUserRole();