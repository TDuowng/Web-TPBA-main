$(document).ready(function () {
  // Kiểm tra jQuery có load được không
  if (typeof jQuery == "undefined") {
    console.error(
      "jQuery không load được. Kiểm tra đường dẫn CDN hoặc file local."
    );
  } else {
    console.log("jQuery loaded successfully:", jQuery.fn.jquery);
  }

  // Hover vào mục cha trong menu chính
  $("#menu ul > li").hover(
    function () {
      $(this).find("ul").stop(true, true).slideDown(300);
    },
    function () {
      $(this).find("ul").stop(true, true).slideUp(300);
    }
  );

  // Khởi tạo giỏ hàng từ localStorage
  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    if (!Array.isArray(cart)) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch (e) {
    console.error("Lỗi khi parse localStorage cart:", e);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  updateCartCount();

  // Xử lý sự kiện bấm nút "Đặt hàng ngay" và "ĐẶT MÓN"
  $(".buy-now, .dat-mon").click(function () {
    console.log("Nút được bấm"); // Debug

    // Lấy thông tin sản phẩm từ data attributes
    const img = $(this).data("img") || "";
    const name = $(this).data("name") || "";
    let price = parseInt($(this).data("price")) || 0;
    let quantity = 1;

    // Nếu là nút "Đặt hàng ngay", lấy số lượng từ input
    if ($(this).hasClass("buy-now")) {
      quantity = parseInt($("#quantity").val()) || 1;
    }

    // Kiểm tra dữ liệu hợp lệ
    if (!name || name.trim() === "" || price <= 0 || quantity <= 0) {
      return;
    }

    console.log("Thông tin sản phẩm:", { img, name, price, quantity }); // Debug

    // Cập nhật thông tin trong popup
    $("#popup-img").attr("src", img);
    $("#popup-name").text(name);
    $("#popup-price").text(price.toLocaleString("vi-VN") + "₫");
    $("#popup-quantity").text(quantity);

    // Thêm sản phẩm vào giỏ hàng
    const product = { img, name, price, quantity };
    const existingProduct = cart.find((item) => item.name === name);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push(product);
    }

    // Lưu vào localStorage
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Giỏ hàng sau khi thêm:", cart); // Debug
    } catch (e) {
      console.error("Lỗi khi lưu vào localStorage:", e);
    }

    // Cập nhật số lượng giỏ hàng
    updateCartCount();

    // Hiển thị popup
    $("#popup-cart").addClass("active");
    $("#popup-overlay").addClass("active");
  });

  // Gán sự kiện cho nút tăng/giảm số lượng
  $("#increase-btn").click(function () {
    increaseQuantity();
  });

  $("#decrease-btn").click(function () {
    decreaseQuantity();
  });
});

// Đóng popup
function closePopupCart() {
  $("#popup-cart").removeClass("active");
  $("#popup-overlay").removeClass("active");
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    if (!Array.isArray(cart)) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch (e) {
    console.error("Lỗi khi parse localStorage cart:", e);
    cart = [];
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  $(".count-product-cart").text(totalItems);
  $("#popup-cart-count").text(totalItems);
  console.log("Tổng số sản phẩm trong giỏ:", totalItems); // Debug
}

// Slider cho ảnh sản phẩm
let currentSlide = 0;
const slides = document.querySelectorAll(".slider-wrapper img");
const totalSlides = slides.length;
const slidesToShow = 3;
const slideWidth = 90; // Chiều rộng mỗi ảnh (80px) + gap (10px)

function updateSlider() {
  const offset = -currentSlide * slideWidth;
  document.querySelector(
    ".slider-wrapper"
  ).style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
  if (currentSlide < totalSlides - slidesToShow) {
    currentSlide++;
  } else {
    currentSlide = 0;
  }
  updateSlider();
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
  } else {
    currentSlide = totalSlides - slidesToShow;
  }
  updateSlider();
}

// Khởi tạo slider
updateSlider();

// Tăng/giảm số lượng
function increaseQuantity() {
  let quantity = parseInt(document.getElementById("quantity").value);
  document.getElementById("quantity").value = quantity + 1;
}

function decreaseQuantity() {
  let quantity = parseInt(document.getElementById("quantity").value);
  if (quantity > 1) {
    document.getElementById("quantity").value = quantity - 1;
  }
}
