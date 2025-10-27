const today = new Date();
today.setDate(today.getDate() + 6)

console.log(today)
console.log(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);