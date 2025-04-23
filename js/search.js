document.addEventListener("DOMContentLoaded", () => {
  // Lấy danh sách sản phẩm tĩnh từ HTML
  function getStaticProducts() {
    const staticProducts = [];
    const productItems = document.querySelectorAll(".product-item");
    productItems.forEach((item) => {
      const name = item.querySelector(".product-name").textContent.trim();
      const priceText = item
        .querySelector(".product-price")
        .textContent.replace(/[^\d]/g, "");
      const price = parseInt(priceText);
      const img = item.querySelector(".product-photo").getAttribute("src");
      staticProducts.push({ name, price, img });
    });
    console.log("Static products:", staticProducts);
    return staticProducts;
  }

  // Lấy danh sách sản phẩm từ localStorage
  function getDynamicProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    console.log("Dynamic products:", products);
    return products;
  }

  // Kết hợp danh sách sản phẩm tĩnh và động
  function getAllProducts() {
    const staticProducts = getStaticProducts();
    const dynamicProducts = getDynamicProducts();
    const allProducts = [...staticProducts, ...dynamicProducts].reduce(
      (unique, product) => {
        if (!unique.some((p) => p.name === product.name)) {
          unique.push(product);
        }
        return unique;
      },
      []
    );
    console.log("All products:", allProducts);
    return allProducts;
  }

  // Hiển thị kết quả tìm kiếm
  function renderSearchResults(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    // Ẩn các section tĩnh và banner trên index.html
    const staticSections = document.querySelectorAll(
      ".product:not(#product-list), .category, .avertisement"
    );
    staticSections.forEach((section) => {
      section.style.display =
        products.length > 0 || containerId === "product-list"
          ? "none"
          : "block";
    });

    if (products.length === 0) {
      container.innerHTML = `
          <div class="empty-search">
            <img src="Images/search.png" alt="No results found" style="width: 270px; height: auto"/>
            <p style="margin-bottom: 20px;">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
            <a href="index.html"><button class="shop-now-btn">Xem tất cả món</button></a>
          </div>
        `;
    } else {
      container.innerHTML = `
          <div class="category">
            
          </div>
        `;
      products.forEach((product) => {
        const productHTML = `
            <div class="col-s-6 col-m-3 col-x-4">
              <div class="product-item">
                <img class="product-photo" src="${
                  product.img ||
                  products.image ||
                  "https://via.placeholder.com/100"
                }" alt="${product.name}" loading="lazy"/>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toLocaleString()} đ</div>
                <button class="dat-mon">ĐẶT MÓN</button>
              </div>
            </div>
          `;
        container.insertAdjacentHTML("beforeend", productHTML);
      });
    }

    // Cuộn đến container kết quả
    container.scrollIntoView({ behavior: "smooth", block: "start" });

    // Gắn lại sự kiện cho nút "ĐẶT MÓN"
    attachCartEvents();
  }

  // Hàm tìm kiếm
  function searchProducts(query, containerId = "product-list") {
    const finalContainerId =
      document.getElementById("search-results") &&
      window.location.pathname.includes("cart.html")
        ? "search-results"
        : containerId;
    const allProducts = getAllProducts();
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered products:", filteredProducts);
    renderSearchResults(filteredProducts, finalContainerId);
  }

  // Xử lý sự kiện tìm kiếm
  const searchForm = document.querySelector(".form-search");
  const searchInput = document.querySelector(".form-search-input");
  const filterBtn = document.querySelector(".filter-btn");

  if (searchForm && searchInput) {
    // Sự kiện submit form (nhấn Enter)
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      console.log("Form submitted with query:", query);
      searchProducts(query);
    });

    // Tìm kiếm theo thời gian thực
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      console.log("Input changed, query:", query);
      searchProducts(query);
    });

    // Khi xóa từ khóa, hiển thị lại các section tĩnh và banner
    searchInput.addEventListener("input", () => {
      if (!searchInput.value.trim()) {
        const staticSections = document.querySelectorAll(
          ".product:not(#product-list), .category, .avertisement"
        );
        staticSections.forEach((section) => {
          section.style.display = "block";
        });
        const container = document.getElementById("product-list");
        if (container) {
          container.innerHTML = ""; // Xóa kết quả tìm kiếm
          // Gọi lại loadProducts để render sản phẩm động
          if (typeof loadProducts === "function") {
            loadProducts("product-list");
          }
        }
      }
    });
  }

  // Sự kiện nhấn nút "Lọc"
  if (filterBtn) {
    filterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      console.log("Filter button clicked with query:", query);
      searchProducts(query);
    });
  } else {
    console.error("Filter button not found");
  }

  // Gắn sự kiện cho nút "ĐẶT MÓN"
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
    addToCart(product); // Từ cart.js
    showPopupCart(product); // Từ cart.js
  }
});
