document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    if (nameInput.value.trim() === "") {
      nameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      nameInput.classList.remove("is-invalid");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    if (messageInput.value.trim() === "") {
      messageInput.classList.add("is-invalid");
      isValid = false;
    } else {
      messageInput.classList.remove("is-invalid");
    }

    if (isValid) {
      alert("Formularul a fost trimis cu succes!");
      form.reset();
    }
  });
});
