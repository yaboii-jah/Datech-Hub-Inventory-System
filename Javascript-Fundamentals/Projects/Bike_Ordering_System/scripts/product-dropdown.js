document.querySelectorAll('.nav-btn')[2].addEventListener("click", () => {
  showProductList();
})

function showProductList () { 
  document.querySelector('.products-list').classList.toggle('products-list-visible');
}