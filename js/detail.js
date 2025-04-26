document.addEventListener("DOMContentLoaded", () => {
  const slide = document.querySelector(".product-slide");
  const items = document.querySelectorAll(".product-item");
  const next = document.querySelector(".related-next-btn");
  const prev = document.querySelector(".related-prev-btn");
  const itemWidth = items[0].offsetWidth + 20; // khoảng cách giữa items
  const itemsPerView = 3;

  // Clone phần tử đầu & cuối để tạo loop
  const firstItems = [...items]
    .slice(0, itemsPerView)
    .map((el) => el.cloneNode(true));
  const lastItems = [...items]
    .slice(-itemsPerView)
    .map((el) => el.cloneNode(true));

  firstItems.forEach((el) => slide.appendChild(el));
  lastItems.reverse().forEach((el) => slide.insertBefore(el, slide.firstChild));

  let currentIndex = itemsPerView;
  const totalItems = slide.children.length;

  slide.style.transform = `translateX(-${itemWidth * currentIndex}px)`;

  function moveSlide(index) {
    slide.style.transition = "transform 0.4s ease-in-out";
    slide.style.transform = `translateX(-${itemWidth * index}px)`;
    currentIndex = index;
  }

  next.addEventListener("click", () => {
    if (currentIndex >= totalItems - itemsPerView) return;
    moveSlide(currentIndex + 1);
  });

  prev.addEventListener("click", () => {
    if (currentIndex <= 0) return;
    moveSlide(currentIndex - 1);
  });

  slide.addEventListener("transitionend", () => {
    if (currentIndex >= totalItems - itemsPerView) {
      slide.style.transition = "none";
      currentIndex = itemsPerView;
      slide.style.transform = `translateX(-${itemWidth * currentIndex}px)`;
    }
    if (currentIndex <= 0) {
      slide.style.transition = "none";
      currentIndex = totalItems - itemsPerView * 2;
      slide.style.transform = `translateX(-${itemWidth * currentIndex}px)`;
    }
  });

  window.addEventListener("resize", () => {
    slide.style.transition = "none";
    slide.style.transform = `translateX(-${itemWidth * currentIndex}px)`;
  });
});

//Thay đổi ảnh sản phẩm khi click vào thumbnail

document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".slider-wrapper img");
  const mainImg = document.getElementById("main-product-img");

  thumbnails.forEach((img) => {
    img.addEventListener("click", () => {
      mainImg.src = img.src;
    });
  });
});

img.addEventListener("click", () => {
  mainImg.style.opacity = 0.5;
  setTimeout(() => {
    mainImg.src = img.src;
    mainImg.style.opacity = 1;
  }, 150);
});
