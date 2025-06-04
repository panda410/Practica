document
  .getElementById("createAccountForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newUsername = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!newUsername || !email || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    const existingAccount = accounts.find(
      (account) => account.username === newUsername || account.email === email
    );
    if (existingAccount) {
      alert(
        "This username or email is already taken. Please choose another one."
      );
      return;
    }

    accounts.push({
      username: newUsername,
      email: email,
      password: newPassword,
    });
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Account created successfully!");
    window.location.href = "index.html";
  });

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document
  .getElementById("toggleNewPassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("newPassword");
    const isPasswordVisible = passwordInput.type === "password";

    passwordInput.type = isPasswordVisible ? "text" : "password";

    this.textContent = isPasswordVisible ? "🙈" : "👁️";
  });

document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", function () {
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const isPasswordVisible = confirmPasswordInput.type === "password";

    confirmPasswordInput.type = isPasswordVisible ? "text" : "password";

    this.textContent = isPasswordVisible ? "🙈" : "👁️";
  });
