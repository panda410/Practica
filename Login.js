const defaultAccount = { username: "admin", password: "admin" };
const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

const adminExists = accounts.some(
  (account) => account.username === defaultAccount.username
);

if (!adminExists) {
  accounts.push(defaultAccount);
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const termsCheckbox = document.querySelector('input[name="terms"]');

  if (!termsCheckbox.checked) {
    alert("Bifeaza termenii si conditia pentru a continua ");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  const validAccount = accounts.find(
    (account) => account.username === username && account.password === password
  );

  if (validAccount) {
    localStorage.setItem("loggedInUser", JSON.stringify(validAccount));
    alert("Login successful!");
    window.location.href = "Acasa.html";
  } else {
    alert("Invalid username or password. Please try again.");
  }
});

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const isPasswordVisible = passwordInput.type === "password";

    passwordInput.type = isPasswordVisible ? "text" : "password";

    this.textContent = isPasswordVisible ? "🙈" : "👁️";
  });
