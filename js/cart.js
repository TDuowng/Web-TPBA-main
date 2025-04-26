document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const cartKey = user.username ? `cart_${user.username}` : "cart_guest";

  updateCartIcon(JSON.parse(localStorage.getItem(cartKey)) || []);

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existing = cart.find((item) => item.name === product.name);

    if (existing) {
      existing.quantity += product.quantity || 1;
    } else {
      cart.push({
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: product.quantity || 1,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartIcon(cart);
    showPopup(product, true);
  }

  function updateCartIcon(cart) {
    const total = cart.reduce((sum, p) => sum + p.quantity, 0);
    const cartCount = document.querySelector(".count-product-cart");
    if (cartCount) cartCount.textContent = total;
  }

  function showPopup(product, autoClose = false) {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const current = cart.find((p) => p.name === product.name);

    const popupImg = document.getElementById("popup-img");
    const popupName = document.getElementById("popup-name");
    const popupQty = document.getElementById("popup-quantity");
    const popupPrice = document.getElementById("popup-price");
    const popupTotalItems = document.getElementById("popup-cart-count");
    const popup = document.getElementById("popup-cart");
    const popupOverlay = document.getElementById("popup-overlay");

    if (
      popupImg &&
      popupName &&
      popupQty &&
      popupPrice &&
      popupTotalItems &&
      popup
    ) {
      popupImg.src = product.img;
      popupName.textContent = product.name;
      popupQty.textContent = current ? current.quantity : 1;
      popupPrice.textContent = product.price.toLocaleString() + "₫";
      popupTotalItems.textContent = cart.reduce((s, p) => s + p.quantity, 0);
      popup.style.display = "block";
      popupOverlay.style.display = "block";

      if (autoClose) {
        setTimeout(() => {
          popup.style.display = "none";
          popupOverlay.style.display = "none";
        }, 3000);
      }
    }
  }

  function closePopupCart() {
    const popupCart = document.getElementById("popup-cart");
    const popupOverlay = document.getElementById("popup-overlay");
    if (popupCart && popupOverlay) {
      popupCart.style.display = "none";
      popupOverlay.style.display = "none";
    }
  }

  // Hàm render giỏ hàng cho trang cart.html
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartContainer = document.getElementById("cart-container");

    if (cartContainer) {
      if (cart.length === 0) {
        cartContainer.innerHTML = `
                <div class="empty-cart">
                    <img src="Images/empty-cart.png" alt="Giỏ hàng trống" class="empty-cart-img" />
                    <p>Chưa có sản phẩm trong giỏ hàng của bạn.</p>
                    <a href="index.html"><button class="shop-now-btn">ĐẶT MÓN NGAY</button></a>
                </div>
            `;
        return;
      }

      let cartHTML = `
            <div class="cart-container container" style="margin: 0px; padding: 0px;">
                <!-- Giao diện bảng cho Desktop/Tablet -->
                <table class="cart-table desktop-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Thông tin sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody id="cart-body">
        `;

      let total = 0;
      cart.forEach((product, index) => {
        const itemTotal = product.price * product.quantity;
        total += itemTotal;
        const imageSrc =
          product.img || product.image || "https://via.placeholder.com/100";

        cartHTML += `
                <tr>
                    <td><img src="${imageSrc}" alt="${
          product.name
        }" style="width: 70px; height: 70px;" onerror="this.src='https://via.placeholder.com/50';"></td>
                    <td>${product.name}</td>
                    <td><strong>${product.price.toLocaleString()}₫</strong></td>
                    <td>
                        <div class="quantity-control">
                            <button onclick="decreaseQty(${index})">-</button>
                            <span>${product.quantity}</span>
                            <button onclick="increaseQty(${index})">+</button>
                        </div>
                    </td>
                    <td><strong>${itemTotal.toLocaleString()}₫</strong></td>
                    <td><span class="delete-btn" onclick="removeItem(${index})"><i class="fas fa-trash-alt"></i></span></td>
                </tr>
            `;
      });

      cartHTML += `
                    </tbody>
                </table>
                <!-- Giao diện card cho Mobile -->
                <div class="cart-items mobile-items">
        `;

      cart.forEach((product, index) => {
        const imageSrc =
          product.img || product.image || "https://via.placeholder.com/100";

        cartHTML += `
                <div class="cart-item">
                    <img src="${imageSrc}" alt="${
          product.name
        }" onerror="this.src='https://via.placeholder.com/50';">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-price">Giá: ${product.price.toLocaleString()}₫</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button onclick="decreaseQty(${index})">-</button>
                            <span>${product.quantity}</span>
                            <button onclick="increaseQty(${index})">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="removeItem(${index})">Xóa</button>
                    </div>
                </div>
            `;
      });

      cartHTML += `
                </div>
                <div class="cart-total" style="margin-top: 30px;">
                    <span>Tổng tiền:</span>
                    <span id="total-amount" style="font-weight: bold;">${total.toLocaleString()}₫</span>
                </div>
                <div class="cart-actions">
                    <a href="allproduct.html"><button class="btn-continue">Tiếp tục mua hàng</button></a>
                    <a href="deliver.html"><button class="btn-checkout">Tiến hành đặt hàng</button></a>
                </div>
            </div>
        `;

      cartContainer.innerHTML = cartHTML;
    }
  }

  // Hàm render đơn hàng cho trang deliver.html
  function renderOrderReview() {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const orderReviewContent = document.getElementById("order-review-content");
    const orderSubtotal = document.getElementById("order-subtotal");
    const orderTotal = document.getElementById("order-total");
    const shippingFeeElement = document.getElementById("shipping-fee");

    if (orderReviewContent) {
      if (cart.length === 0) {
        orderReviewContent.innerHTML = `
                <div class="empty-order">
                    <p>Chưa có sản phẩm trong đơn hàng của bạn.</p>
                </div>
            `;
        if (orderSubtotal) orderSubtotal.textContent = "0₫";
        if (orderTotal) orderTotal.textContent = "0₫";
        return;
      }

      let orderHTML = `
            <table class="order-table">
                <thead>
                    <tr>
                        <th style="text-align: left;">THÔNG TIN SẢN PHẨM</th>
                        <th>ĐƠN GIÁ</th>
                        <th>SỐ LƯỢNG</th>
                        <th>THÀNH TIỀN</th>
                    </tr>
                </thead>
                <tbody>
        `;
      let subtotal = 0;

      cart.forEach((product) => {
        const itemTotal = product.price * product.quantity;
        subtotal += itemTotal;
        const imageSrc =
          product.img || product.image || "https://via.placeholder.com/100";

        orderHTML += `
                <tr>
                    <td style="text-align: left;">
                        <div class="order-item">
                            <img src="${imageSrc}" alt="${
          product.name
        }" onerror="this.src='https://via.placeholder.com/50';">
                            <div class="order-item-info">
                                <span class="order-item-name">${
                                  product.name
                                }</span>
                                <div class="order-item-details mobile-only">
                                    <span>Số lượng: ${product.quantity}</span>
                                    <span>Thành tiền: ${itemTotal.toLocaleString()}₫</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="desktop-only">${product.price.toLocaleString()}₫</td>
                    <td class="desktop-only">${product.quantity}</td>
                    <td class="desktop-only">${itemTotal.toLocaleString()}₫</td>
                </tr>
            `;
      });

      orderHTML += `
                </tbody>
            </table>
        `;

      orderReviewContent.innerHTML = orderHTML;

      // Cập nhật tổng tiền hàng
      if (orderSubtotal) {
        orderSubtotal.textContent = `${subtotal.toLocaleString()}₫`;
      }

      // Tính tổng thanh toán (tổng tiền hàng + phí vận chuyển)
      const shippingFeeText = shippingFeeElement
        ? shippingFeeElement.textContent.replace(/[^\d]/g, "")
        : "0";
      const shippingFee = parseInt(shippingFeeText) || 0;
      const total = subtotal + shippingFee;

      if (orderTotal) {
        orderTotal.innerHTML = `<strong>${total.toLocaleString()}₫</strong>`;
      }
    }
  }

  window.increaseQty = function (index) {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart[index].quantity += 1;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartIcon(cart);
    renderCart();
  };

  window.decreaseQty = function (index) {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartIcon(cart);
    renderCart();
  };

  window.removeItem = function (index) {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart.splice(index, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartIcon(cart);
    renderCart();
  };

  function attachCartEvents() {
    document.querySelectorAll(".dat-mon").forEach((button) => {
      button.removeEventListener("click", handleAddToCart);
      button.addEventListener("click", handleAddToCart);
    });
  }

  function handleAddToCart() {
    const productItem = this.closest(".product-item");
    const name = productItem.querySelector(".product-name").textContent;
    const priceText = productItem
      .querySelector(".product-price")
      .textContent.replace(/[^\d]/g, "");
    const price = parseInt(priceText);
    const img = productItem.querySelector(".product-photo").getAttribute("src");

    const product = { name, price, img };
    addToCart(product);
    showPopup(product, false);
  }

  attachCartEvents();

  if (typeof $ !== "undefined") {
    $(".add-to-cart")
      .off("click")
      .on("click", function () {
        const product = {
          name: $(this).data("name"),
          img: $(this).data("img"),
          price: Number($(this).data("price")),
        };
        addToCart(product);
        showPopup(product, false);
      });
  }

  // Gọi hàm renderCart() cho trang cart.html
  renderCart();

  // Gọi hàm renderOrderReview() cho trang deliver.html
  renderOrderReview();

  const closePopupBtn = document.querySelector(".close-popup");
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", closePopupCart);
  }

  const productList = document.getElementById("product-list");
  if (productList) {
    const observer = new MutationObserver(() => {
      attachCartEvents();
    });
    observer.observe(productList, { childList: true, subtree: true });
  }
});

function goToCheckout() {
  window.location.href = "deliver.html";
}
