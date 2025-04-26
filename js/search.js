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

  // Kết hợp danh sách sản phẩm tĩnh và động, chuẩn hóa thuộc tính img
  function getAllProducts() {
    const staticProducts = getStaticProducts();
    const dynamicProducts = getDynamicProducts();
    const normalizedDynamicProducts = dynamicProducts.map((product) => ({
      name: product.name,
      price: product.price,
      img: product.image || "https://via.placeholder.com/100",
    }));
    const allProducts = [
      ...staticProducts,
      ...normalizedDynamicProducts,
    ].reduce((unique, product) => {
      if (!unique.some((p) => p.name === product.name)) {
        unique.push(product);
      }
      return unique;
    }, []);
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

    // Xác định trang hiện tại
    const currentPage = window.location.pathname;

    // Ẩn/hiện các section tĩnh tùy theo trang
    if (currentPage.includes("index.html")) {
      const staticSections = document.querySelectorAll(
        ".product:not(#product-list), .category, .avertisement"
      );
      staticSections.forEach((section) => {
        section.style.display =
          products.length > 0 || containerId === "product-list"
            ? "none"
            : "block";
      });
    } else if (currentPage.includes("garan.html")) {
      const staticProductSection = document.querySelector(".product");
      if (staticProductSection) {
        // Ẩn .product khi có kết quả tìm kiếm, hiển thị khi không có
        staticProductSection.style.display =
          products.length > 0 ? "none" : "block";
        console.log(
          `Set display of .product to ${staticProductSection.style.display}`
        );
      } else {
        console.error(
          "Static product section (.product) not found in garan.html"
        );
      }
    }

    // Xóa nội dung cũ trong container
    container.innerHTML = "";

    if (products.length === 0) {
      container.innerHTML = `
          <div class="empty-search">
            <img id="search-image" src="Images/search.png" alt="No results found" style="width: 200px; height: auto"/>
            <p style="margin-bottom: 20px;">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
            <a href="index.html"><button class="shop-now-btn">Xem tất cả món</button></a>
          </div>
        `;
    } else {
      container.innerHTML = `
          <div class="category">
            <h1>KẾT QUẢ TÌM KIẾM</h1>
          </div>
        `;
      products.forEach((product) => {
        const productHTML = `
            <div class="col-s-4 col-m-3 col-t-6">
              <div class="product-item">
                <img class="product-photo" src="${
                  product.img || "https://via.placeholder.com/100"
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
  function searchProducts(query, containerId) {
    const currentPage = window.location.pathname;
    let finalContainerId = containerId;
    if (currentPage.includes("index.html")) {
      finalContainerId = "product-list";
    } else if (
      currentPage.includes("garan.html") ||
      currentPage.includes("cart.html")
    ) {
      finalContainerId = "search-results";
    }

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
      const currentPage = window.location.pathname;
      if (!searchInput.value.trim()) {
        if (currentPage.includes("index.html")) {
          const staticSections = document.querySelectorAll(
            ".product:not(#product-list), .category, .avertisement"
          );
          staticSections.forEach((section) => {
            section.style.display = "block";
          });
          const container = document.getElementById("product-list");
          if (container) {
            container.innerHTML = "";
            if (typeof loadProducts === "function") {
              loadProducts("product-list");
            }
          }
        } else if (currentPage.includes("garan.html")) {
          const staticProductSection = document.querySelector(".product");
          const searchResults = document.getElementById("search-results");
          if (staticProductSection) {
            staticProductSection.style.display = "block";
            console.log(
              `Set display of .product to ${staticProductSection.style.display} (input cleared)`
            );
          }
          if (searchResults) {
            searchResults.innerHTML = "";
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

  /* Tìm kiếm trên mobile */
  const mobileSearchForm = document.getElementById("mobile-search-form");
  const mobileSearchInput = document.getElementById("mobile-search-input");

  if (mobileSearchForm && mobileSearchInput) {
    mobileSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = mobileSearchInput.value.trim();
      if (query) {
        searchProducts(query);
        document.getElementById("mobile-menu").classList.remove("active");
      }
    });
  }
});
