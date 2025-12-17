import {supabase} from './supabase-client.js'

let category = [{}];

async function dataRetrieve () {
  const {data, error} = await supabase.from('category').select().eq('status', 'Active');
  category = data;
  if (error) {
    console.error(error) 
  } else {
    generateProductDrop()
  }
}


function generateProductDrop () { 
  let html = '';
  category.forEach((category, data) => { 
    html += ` 
      <a href="">${category.categoryName}</a>
    `    
  })
  document.querySelector('.product-list').innerHTML = html
}

function showProductList () { 
  document.querySelectorAll('.nav-btn')[1].addEventListener("click", () => {
    document.querySelector('.products-list-container').classList.toggle('visible');
  })
}

dataRetrieve();
showProductList();

