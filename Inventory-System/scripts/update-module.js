//localStorage.clear();
//sessionStorage.clear();
let updatedData = {};

export function setUpdatedData (category, image, name, price, status, stock, product_ID) { 
  updatedData = {
    category: category,
    image: image,
    name: name,
    price: price,
    status: status,
    stock: stock,
    product_ID: product_ID
  }
  sessionStorage.setItem('updatedData', JSON.stringify(updatedData));
  
} 

export function getUpdatedData () {
  return JSON.parse(sessionStorage.getItem('updatedData'));
}