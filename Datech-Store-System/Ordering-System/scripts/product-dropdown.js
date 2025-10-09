document.querySelectorAll('.nav-btn')[1].addEventListener("click", () => {
  showProductList();
})

function showProductList () { 
  document.querySelector('.products-list').classList.toggle('products-list-visible');
}