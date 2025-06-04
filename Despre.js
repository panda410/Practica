document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  const offcanvasElement = document.getElementById("offcanvasCos");
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

  document.addEventListener("click", function (event) {
    if (
      !offcanvasElement.contains(event.target) &&
      !event.target.closest('[data-bs-toggle="offcanvas"]')
    ) {
      offcanvas.hide();
    }
  });
});
