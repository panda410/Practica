document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const imagine = card.getAttribute("data-imagine");
    const imgElement = card.querySelector("img");

    if (imagine && imgElement) {
      imgElement.src = imagine;
    }
  });
});
