const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

const defaultProfilePicture =
  "360_F_579552668_sZD51Sjmi89GhGqyF27pZcrqyi7cEYBH.jpg";

if (loggedInUser) {
  document.getElementById("profilePicture").src =
    loggedInUser.profilePicture || defaultProfilePicture;

  document.getElementById("username").value = loggedInUser.username;
  document.getElementById("email").value =
    loggedInUser.email || "example@example.com";
  document.getElementById("password").value = loggedInUser.password;
}

document.getElementById("changePictureButton").addEventListener("click", () => {
  document.getElementById("uploadPicture").click();
});

document.getElementById("uploadPicture").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("profilePicture").src = e.target.result;

      loggedInUser.profilePicture = e.target.result;

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      const accountIndex = accounts.findIndex(
        (account) => account.username === loggedInUser.username
      );
      if (accountIndex !== -1) {
        accounts[accountIndex].profilePicture = e.target.result;
        localStorage.setItem("accounts", JSON.stringify(accounts));
      }

      alert("Imaginea de profil a fost actualizată cu succes!");
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("editButton").addEventListener("click", () => {
  document.querySelectorAll("#accountForm input").forEach((input) => {
    input.disabled = false;
  });
  document.getElementById("saveButton").disabled = false;
});

document.getElementById("accountForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedUser = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    profilePicture: loggedInUser.profilePicture,
  };

  const accountIndex = accounts.findIndex(
    (account) => account.username === loggedInUser.username
  );
  if (accountIndex !== -1) {
    accounts[accountIndex] = updatedUser;
  }

  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
  alert("Datele au fost salvate cu succes!");

  document.querySelectorAll("#accountForm input").forEach((input) => {
    input.disabled = true;
  });
  document.getElementById("saveButton").disabled = true;
});

document.getElementById("backButton").addEventListener("click", () => {
  history.back();
});

document.getElementById("logoutButton").addEventListener("click", (event) => {
  event.preventDefault();

  localStorage.removeItem("loggedInUser");

  window.location.href = "index.html";
});
