$(document).ready(function () {
  // Xử lý mở/đóng menu lọc
  $("#filter-btn").click(function () {
    const sidebar = $("#filter-sidebar");
    const overlay = $("#filter-overlay");
    const toggleBtn = $(".filter-toggle-btn");

    if (sidebar.hasClass("active")) {
      // Đóng menu
      sidebar.removeClass("active");
      overlay.removeClass("active");
      toggleBtn.removeClass("active");
      $(this).html('<i class="fa-solid fa-list"></i>');
    } else {
      // Mở menu
      sidebar.addClass("active");
      overlay.addClass("active");
      toggleBtn.addClass("active");
      $(this).html('<i class="fa-solid fa-xmark"></i>');
    }
  });

  // Đóng menu khi nhấn overlay
  $("#filter-overlay").click(function () {
    $("#filter-sidebar").removeClass("active");
    $(this).removeClass("active");
    $(".filter-toggle-btn").removeClass("active");
    $("#filter-btn").html('<i class="fa-solid fa-list"></i>');
  });

  // Xử lý mở rộng/thu gọn danh mục
  $(".menu-item-header").click(function () {
    const $content = $(this).next(".menu-item-content");
    if ($content.length) {
      $(".menu-item-content").not($content).slideUp();
      $content.slideToggle();
    }
  });
});
