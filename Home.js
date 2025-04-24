const productsSection = document.getElementById("product");
const shoppingcart = document.getElementById("shoppingcart");
const countDisplay = document.getElementById("Start");
let mydata;
let shoppingCart = [];

fetch("Home.json")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then((products) => {
    mydata = products;
    products.forEach((product, i) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("col-md-6", "col-lg-3");
      productDiv.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top p-3" alt="${product.name}" style="height: 200px; object-fit: contain;">
          <div class="card-body d-flex flex-column">
            <h3 class="card-title h5">${product.name}</h3>
            <p class="card-text text-muted mb-4">Price: $${product.price.toLocaleString()} USD</p>
            <button onclick="SaveToCart(${i})" class="btn btn-primary mt-auto">
              <i class="bi bi-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
      productsSection.appendChild(productDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching products:", error.message);
  });

function SaveToCart(index) {
  if (!mydata || !mydata[index]) return;
  shoppingCart.push(mydata[index]);
  countDisplay.textContent = shoppingCart.length;
  displayCart();
  // Show the offcanvas
  const bsOffcanvas = new bootstrap.Offcanvas(shoppingcart);
  bsOffcanvas.show();
}

function displayCart() {
  const cartBody = shoppingcart.querySelector('.offcanvas-body');
  cartBody.innerHTML = '';
  
  if (shoppingCart.length === 0) {
    cartBody.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="bi bi-cart-x display-4"></i>
        <p class="mt-3">Your cart is empty</p>
      </div>
    `;
    return;
  }

  const cartList = document.createElement('div');
  cartList.classList.add('list-group', 'list-group-flush');
  let totalPrice = 0;

  shoppingCart.forEach((product, i) => {
    const item = document.createElement('div');
    item.classList.add('list-group-item');
    item.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${product.image}" alt="${product.name}" class="rounded" style="width: 64px; height: 64px; object-fit: cover;">
        <div class="flex-grow-1">
          <h6 class="mb-0">${product.name}</h6>
          <p class="text-muted mb-0">$${product.price.toLocaleString()} USD</p>
        </div>
        <button onclick="removeFromCart(${i})" class="btn btn-sm btn-outline-danger">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    cartList.appendChild(item);
    totalPrice += product.price;
  });

  cartBody.appendChild(cartList);
  cartBody.innerHTML += `
    <div class="mt-3 p-3 bg-light rounded">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Total:</h5>
        <h5 class="mb-0">$${totalPrice.toLocaleString()} USD</h5>
      </div>
      <button onclick="checkout()" class="btn btn-success w-100">
        <i class="bi bi-credit-card"></i> Proceed to Checkout
      </button>
    </div>
  `;
}

function removeFromCart(index) {
  shoppingCart.splice(index, 1);
  countDisplay.textContent = shoppingCart.length;
  displayCart();
}

function openShoppingCart() {
  const bsOffcanvas = new bootstrap.Offcanvas(shoppingcart);
  bsOffcanvas.show();
  displayCart();
}

function closeCart() {
  const bsOffcanvas = bootstrap.Offcanvas.getInstance(shoppingcart);
  if (bsOffcanvas) {
    bsOffcanvas.hide();
  }
}

function checkout() {
  if (shoppingCart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout...");
  shoppingCart = [];
  countDisplay.textContent = '0';
  displayCart();
  closeCart();
}