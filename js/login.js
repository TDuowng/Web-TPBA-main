document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo tài khoản admin mặc định
  const initializeAdmin = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const hasAdmin = users.some((user) => user.role === "admin");
    if (!hasAdmin) {
      const adminUser = {
        name: "Admin",
        email: "admin@taopho.com",
        username: "admin",
        phone: "0123456789",
        password: "admin123",
        role: "admin",
      };
      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  initializeAdmin();

  // Logic xử lý đăng nhập
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  // Kiểm tra trạng thái đăng nhập khi tải trang
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    const loginTime = localStorage.getItem("loginTime");
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - parseInt(loginTime);
    const maxSessionTime = 24 * 60 * 60 * 1000; // 24 giờ

    if (timeDiff < maxSessionTime) {
      if (user.role === "admin") {
        window.location.href = "admin/admin.html";
      } else {
        window.location.href = "index.html";
      }
      return;
    } else {
      // Lưu giỏ hàng của user trước khi xóa
      const cart =
        JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
      localStorage.removeItem("user");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("remember");
      localStorage.removeItem(`cart_${user.username}`);
    }
  }

  // Xử lý sự kiện submit form
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        (u.username === username ||
          u.email === username ||
          u.phone === username) &&
        u.password === password
    );

    if (user) {
      const userData = {
        username: user.username,
        name: user.name,
        role: user.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("loginTime", new Date().getTime().toString());

      if (remember) {
        localStorage.setItem("remember", "true");
      } else {
        localStorage.removeItem("remember");
      }

      // Tải giỏ hàng của user
      const cart =
        JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));

      if (user.role === "admin") {
        window.location.href = "admin/admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      errorMessage.textContent =
        "Email/số điện thoại/tên tài khoản hoặc mật khẩu không đúng!";
      errorMessage.style.display = "block";
    }
  });
});

// Hàm đăng xuất
function logout() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // Lưu giỏ hàng của user
    const cart =
      JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
  }
  localStorage.removeItem("user");
  localStorage.removeItem("loginTime");
  localStorage.removeItem("remember");
  localStorage.removeItem(`cart_${user.username}`);
  window.location.reload();
}
