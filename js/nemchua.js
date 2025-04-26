document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const cartKey = user.username ? `cart_${user.username}` : "cart_guest";

  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");
  const quantityInput = document.getElementById("quantity");

  increaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });

  decreaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  const buyNowBtn = document.querySelector(".buy-now");

  buyNowBtn.addEventListener("click", () => {
    const img = buyNowBtn.getAttribute("data-img");
    const name = buyNowBtn.getAttribute("data-name");
    const price = parseInt(buyNowBtn.getAttribute("data-price"));
    const quantity = parseInt(quantityInput.value);

    const product = {
      img,
      name,
      price,
      quantity,
    };

    const currentQuantity = addToCart(product);
    showPopupCart(product, currentQuantity);
  });

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingIndex = cart.findIndex(
      (item) => item.name.toLowerCase() === product.name.toLowerCase()
    );

    let currentQuantity;
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += product.quantity;
      currentQuantity = cart[existingIndex].quantity;
    } else {
      cart.push(product);
      currentQuantity = product.quantity;
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    return currentQuantity;
  }

  function showPopupCart(product, currentQuantity) {
    document.getElementById("popup-img").src = product.img;
    document.getElementById("popup-name").textContent = product.name;
    document.getElementById("popup-price").textContent =
      product.price.toLocaleString("vi-VN") + "₫";
    document.getElementById("popup-quantity").textContent = currentQuantity;
    document.getElementById("popup-cart-count").textContent = getCartCount();

    document.getElementById("popup-cart").style.display = "block";
    document.getElementById("popup-overlay").style.display = "block";

    setTimeout(closePopupCart, 3000);
  }

  function getCartCount() {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function updateCartCount() {
    const count = getCartCount();
    const countElements = document.querySelectorAll(".count-product-cart");
    countElements.forEach((el) => (el.textContent = count));
  }

  function closePopupCart() {
    document.getElementById("popup-cart").style.display = "none";
    document.getElementById("popup-overlay").style.display = "none";
  }

  document
    .querySelector(".button-x span")
    .addEventListener("click", closePopupCart);
  document
    .getElementById("popup-overlay")
    .addEventListener("click", closePopupCart);

  updateCartCount();
});
