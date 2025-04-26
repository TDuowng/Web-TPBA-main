document.addEventListener("DOMContentLoaded", function () {
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra trạng thái đăng nhập
  const userSection = document.getElementById("user-section");
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    userSection.innerHTML = `
                        <i class="fa-solid fa-user"></i>
                        <span style=" color: #333; font-weight: bold">${user.name} &nbsp; </span> <span id="or"> hoặc </span>
                        <a href="#" onclick="logout()" id="account" style="font-size: 12pt; margin-left: 8px; color: #b5292f; text-decoration: none; display: block; font-weight: bold">Đăng xuất</a>
                    `;
  }
});

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("loginTime");
  localStorage.removeItem("remember");
  window.location.reload(); // Tải lại trang để cập nhật giao diện
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const mobileUserArea = document.getElementById("mobile-user-area");

  if (user && user.name) {
    mobileUserArea.innerHTML = `
      &nbsp; Xin chào, <strong>${user.name} </strong>
    `;
  }
});

// Menu in tablet + laptop
$(document).ready(function () {
  $("#menu ul > li").hover(
    function () {
      $(this).find("ul").stop(true, true).slideDown(300);
    },
    function () {
      $(this).find("ul").stop(true, true).slideUp(300);
    }
  );
});

// Menu in mobile
$(document).ready(function () {
  $(".hamburger").click(function () {
    $("#mobile-menu").addClass("active");
  });

  $(".close-btn").click(function () {
    $("#mobile-menu").removeClass("active");
  });

  // Toggle submenu khi nhấn vào mục có submenu
  $(".mobile-nav li.has-sub > a").click(function (e) {
    e.preventDefault();
    $(this).siblings(".submenu").slideToggle(300);
    $(this).parent().siblings().find(".submenu").slideUp(3000);
  });
});
