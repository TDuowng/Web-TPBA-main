// Lấy dữ liệu từ localStorage
function getProducts() {
  const products = localStorage.getItem("products");
  if (!products) {
    localStorage.setItem("products", JSON.stringify(initialProducts));
    return initialProducts;
  }
  let parsedProducts = JSON.parse(products);
  const seen = new Set();
  parsedProducts = parsedProducts.filter((product) => {
    const key = `${product.name}|${product.category}|${product.price}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  parsedProducts = parsedProducts.map((product, index) => ({
    ...product,
    id: index + 1,
  }));
  if (parsedProducts.length === 0) {
    localStorage.setItem("products", JSON.stringify(initialProducts));
    return initialProducts;
  }
  localStorage.setItem("products", JSON.stringify(parsedProducts));
  return parsedProducts;
}

// Lưu dữ liệu vào localStorage
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Load sản phẩm vào danh sách (trang chủ hoặc quản trị)
function loadProducts(containerId) {
  const products = getProducts();
  console.log(`Load danh sách sản phẩm cho container: ${containerId}`);
  console.log("Dữ liệu sản phẩm:", products);

  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = "";

  if (containerId === "product-list") {
    // Trang chủ: Hiển thị dạng card
    products.forEach((product) => {
      const div = document.createElement("div");
      div.className = "col-s-4 col-m-3 col-t-6";
      div.innerHTML = `
          <div class="product-item">
            <img class="product-photo" src="${
              product.image || "https://via.placeholder.com/150"
            }" alt="${product.name}" />
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toLocaleString()} đ</div>
            <button class="dat-mon" data-id="${product.id}">ĐẶT MÓN</button>
          </div>
        `;
      container.appendChild(div);
    });
    console.log(`Đã load ${products.length} sản phẩm vào trang chủ`);
  } else {
    // Trang quản trị: Hiển thị dạng bảng
    let tbody = document.getElementById("product-table-body");
    if (!tbody) {
      console.error(`Không tìm thấy tbody với id: product-table-body`);
      tbody = document.createElement("tbody");
      tbody.id = "product-table-body";
      container.appendChild(tbody);
    }
    console.log("Tbody element:", tbody);
    tbody.innerHTML = "";
    products.forEach((product) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.price.toLocaleString()}</td>
          <td><img src="${
            product.image || "https://via.placeholder.com/50"
          }" alt="${product.name}"></td>
          <td>
            <button class="btn-edit" onclick="openModal('edit', ${
              product.id
            })"><i class="fas fa-edit"></i></button>
            <button class="btn-delete" onclick="deleteProduct(${
              product.id
            })"><i class="fas fa-trash"></i></button>
          </td>
        `;
      tbody.appendChild(tr);
    });
    console.log(`Đã load ${products.length} sản phẩm vào bảng`);
  }
}

// Giữ lại các hàm chỉnh sửa cho trang quản trị
function openModal(mode, id = null) {
  const modal = document.getElementById("product-modal");
  const form = document.getElementById("product-form");
  const title = document.getElementById("modal-title");
  const preview = document.getElementById("image-preview");

  modal.style.display = "block";
  title.textContent = mode === "add" ? "Thêm sản phẩm" : "Sửa sản phẩm";

  if (mode === "edit") {
    const products = getProducts();
    const product = products.find((p) => p.id === id);
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-id").value = product.id;
    preview.src = product.image || "https://via.placeholder.com/100";
    preview.style.display = "block";
  } else {
    form.reset();
    document.getElementById("product-id").value = "";
    preview.style.display = "none";
  }
}

function closeModal() {
  document.getElementById("product-modal").style.display = "none";
}

function deleteProduct(id) {
  if (confirm("Xóa sản phẩm này?")) {
    let products = getProducts();
    products = products.filter((p) => p.id !== id);
    saveProducts(products);
    loadProducts("product-table");
  }
}

// Sự kiện cho trang quản trị
document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Nút Lưu được nhấn!");
      const name = document.getElementById("product-name").value;
      const category = document.getElementById("product-category").value;
      const price =
        parseInt(document.getElementById("product-price").value) || 0;
      const description = document.getElementById("product-description").value;
      const preview = document.getElementById("image-preview");
      const image = preview.style.display === "block" ? preview.src : "";
      const id = document.getElementById("product-id").value;

      console.log("Dữ liệu lấy từ form:", {
        name,
        category,
        price,
        description,
        image,
        id,
      });

      let products = getProducts();
      const duplicate = products.find(
        (p) => p.name === name && p.category === category && p.price === price
      );
      if (duplicate && !id) {
        alert(
          "Sản phẩm đã tồn tại! Vui lòng chỉnh sửa hoặc thêm sản phẩm khác."
        );
        return;
      }

      if (id && id !== "") {
        const productId = parseInt(id);
        const product = products.find((p) => p.id === productId);
        if (product) {
          product.name = name;
          product.category = category;
          product.price = price;
          product.description = description;
          product.image = image;
        } else {
          console.error("Không tìm thấy sản phẩm với id:", id);
        }
      } else {
        const newId = products.length
          ? Math.max(...products.map((p) => p.id)) + 1
          : 1;
        products.push({ id: newId, name, category, price, description, image });
      }

      console.log("Danh sách sản phẩm sau khi cập nhật:", products);
      saveProducts(products);
      loadProducts("product-table");
      loadProducts("product-list");
      closeModal();
    });

    document
      .getElementById("product-image")
      .addEventListener("change", function (e) {
        const preview = document.getElementById("image-preview");
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
  }
});

// Event delegation cho nút "ĐẶT MÓN"
// Sử dụng hàm addToCart từ cart.js
document.addEventListener("click", function (event) {
  const button = event.target.closest(".dat-mon");
  if (button) {
    const productId = parseInt(button.getAttribute("data-id"));
    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    if (product) {
      const formattedProduct = {
        name: product.name,
        price: product.price,
        img: product.image || "https://via.placeholder.com/150",
      };
      // Gọi hàm addToCart từ cart.js (được định nghĩa trong cart.js)
      if (typeof window.addToCart === "function") {
        window.addToCart(formattedProduct);
      } else {
        console.error("Hàm addToCart từ cart.js không được tìm thấy!");
      }
    } else {
      console.error(`Không tìm thấy sản phẩm với id: ${productId}`);
    }
  }
});
