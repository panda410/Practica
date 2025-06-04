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

let produse = [];
let cos = [];

async function loadProduse() {
  try {
    const response = await fetch("Produse.json");
    produse = await response.json();

    produse.forEach((produs) => {
      const reducere = Math.floor(Math.random() * 30) + 10;
      produs.reducere = reducere;
      produs.pretRedus = (produs.pret * (1 - reducere / 100)).toFixed(2);
    });
  } catch (error) {
    console.error("Eroare la încărcarea produselor:", error);
  }
}

function activeazaButoaneCos() {
  document.querySelectorAll(".adauga-cos").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      adaugaInCos(id);
    });
  });
}

function adaugaInCos(id) {
  const produs = produse.find((p) => p.id === id);
  if (!produs) return;

  const idx = cos.findIndex((item) => item.id === id);
  if (idx > -1) {
    cos[idx].cantitate += 1;
  } else {
    cos.push({
      id: produs.id,
      nume: produs.nume,
      pretRedus: parseFloat(produs.pretRedus),
      imagine: produs.imagine,
      cantitate: 1,
    });
  }

  actualizeazaBadgeCos();
  afiseazaCosInOffcanvas();
}

function getCos() {
  return cos;
}

function setCos(nouCos) {
  cos = nouCos;
}

function actualizeazaBadgeCos() {
  const totalProduse = cos.reduce((acc, item) => acc + item.cantitate, 0);
  const badge = document.querySelector(".bi-cart3 + .badge");
  if (badge) badge.textContent = totalProduse;
}

function afiseazaCosInOffcanvas() {
  const continut = document.getElementById("continutCos");
  if (!continut) return;

  if (cos.length === 0) {
    continut.innerHTML = `<div class="text-center text-secondary">Coșul este gol.</div>`;
    return;
  }

  let total = 0;
  let html = `<ul class="list-group list-group-flush mb-3">`;
  cos.forEach((item, index) => {
    const subtotal = item.pretRedus * item.cantitate;
    total += subtotal;
    html += `
      <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img src="${item.imagine}" alt="${
      item.nume
    }" class="img-thumbnail me-3" style="width: 50px; height: 50px;">
          <span>${item.nume} <span class="badge bg-info ms-2">${
      item.cantitate
    } x ${item.pretRedus.toFixed(2)} RON</span></span>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-warning btn-sm ms-3 scade-cantitate" data-index="${index}">-</button>
          <button class="btn btn-danger btn-sm ms-3 elimina-produs" data-index="${index}"><i class="bi bi-trash"></i></button>
        </div>
      </li>
    `;
  });
  html += `</ul>
    <div class="text-end fw-bold fs-5">Total: ${total.toFixed(2)} RON</div>
  `;
  continut.innerHTML = html;

  document.querySelectorAll(".scade-cantitate").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      scadeCantitate(index);
    });
  });

  document.querySelectorAll(".elimina-produs").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      eliminaDinCos(index);
    });
  });
}

function scadeCantitate(index) {
  if (cos[index].cantitate > 1) {
    cos[index].cantitate -= 1;
  } else {
    cos.splice(index, 1);
  }
  actualizeazaBadgeCos();
  afiseazaCosInOffcanvas();
}

function eliminaDinCos(index) {
  cos.splice(index, 1);
  actualizeazaBadgeCos();
  afiseazaCosInOffcanvas();
}

document.addEventListener("submit", function (e) {
  if (e.target && e.target.id === "formCheckout") {
    e.preventDefault();

    const nume = document.getElementById("checkoutNume").value;
    const adresa = document.getElementById("checkoutAdresa").value;
    const telefon = document.getElementById("checkoutTelefon").value;
    const email = document.getElementById("checkoutEmail").value;
    const cardType = document.querySelector(
      'input[name="cardType"]:checked'
    )?.value;
    const cardNumber = document.getElementById("checkoutCardNumber").value;
    const cardExp = document.getElementById("checkoutCardExp").value;
    const cardCVV = document.getElementById("checkoutCardCVV").value;

    if (
      !nume ||
      !adresa ||
      !telefon ||
      !email ||
      !cardType ||
      !cardNumber ||
      !cardExp ||
      !cardCVV
    ) {
      document.getElementById("checkoutMsg").innerHTML =
        '<div class="alert alert-danger mt-3">Toate câmpurile sunt obligatorii!</div>';
      return;
    }

    document.getElementById(
      "checkoutMsg"
    ).innerHTML = `<div class="alert alert-success mt-3">Comanda a fost trimisă cu succes! Veți fi contactat în curând.<br>Tipul cardului selectat: ${cardType}</div>`;

    setCos([]);
    actualizeazaBadgeCos();
    afiseazaCosInOffcanvas();

    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalCheckout")
      );
      modal.hide();
    }, 2000);
  }
});

loadProduse();

document
  .querySelector(".bi-cart3")
  ?.parentElement.addEventListener("click", function (e) {
    e.preventDefault();
    afiseazaCosInOffcanvas();
    const offcanvas = new bootstrap.Offcanvas(
      document.getElementById("offcanvasCos")
    );
    offcanvas.show();
  });

document.addEventListener("DOMContentLoaded", function () {
  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", function () {
      deschideCheckoutModal();
    });
  }
});

function deschideCheckoutModal() {
  const checkoutProduse = document.getElementById("checkoutProduse");
  if (!checkoutProduse) return;

  if (cos.length === 0) {
    checkoutProduse.innerHTML = `<div class="text-secondary">Coșul este gol.</div>`;
    return;
  }

  let total = 0;
  let html = `<ul class="list-group list-group-flush mb-3">`;
  cos.forEach((item) => {
    const subtotal = item.pretRedus * item.cantitate;
    total += subtotal;
    html += `
      <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
        <span>${item.nume} <span class="badge bg-info ms-2">${
      item.cantitate
    } x ${item.pretRedus.toFixed(2)} RON</span></span>
        <span class="fw-bold ms-2">${subtotal.toFixed(2)} RON</span>
      </li>
    `;
  });
  html += `</ul>
    <div class="text-end fw-bold fs-5">Total: ${total.toFixed(2)} RON</div>
  `;
  checkoutProduse.innerHTML = html;

  const modal = new bootstrap.Modal(document.getElementById("modalCheckout"));
  modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
  const cardButtons = document.querySelectorAll(
    "#formCheckout .btn-outline-info, #formCheckout .btn-outline-warning, #formCheckout .btn-outline-success"
  );
  const selectedCardTypeInput = document.getElementById("selectedCardType");

  cardButtons.forEach((button) => {
    button.addEventListener("click", function () {
      cardButtons.forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");

      selectedCardTypeInput.value = this.getAttribute("data-card");
    });
  });
});

function afiseazaProduseDinCategorie(categorie) {
  const sectiuneProduse = document.getElementById("promo-cards");
  sectiuneProduse.innerHTML = "";

  const categorieNormalizata = categorie
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const produseFiltrate = produse.filter(
    (produs) =>
      produs.categorie
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() === categorieNormalizata
  );

  if (produseFiltrate.length === 0) {
    sectiuneProduse.innerHTML = `<p class="text-center text-warning">Nu există produse în această categorie.</p>`;
    return;
  }

  produseFiltrate.forEach((produs) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    let eticheta = "";
    if (produs.reducere > 30) {
      eticheta = "Extra Hot";
    } else if (produs.reducere > 20) {
      eticheta = "Hot";
    } else {
      eticheta = "Special";
    }

    card.innerHTML = `
      <div class="card bg-dark text-white h-100 position-relative">
        <div class="badge-wow badge-${eticheta
          .toLowerCase()
          .replace(" ", "-")}">${eticheta}</div>
        <img src="${produs.imagine}" class="card-img-top" alt="${produs.nume}">
        <div class="card-body">
          <h5 class="card-title">${produs.nume}</h5>
          <p class="text-warning fw-bold">Reducere: ${produs.reducere}%</p>
          <p class="text-danger fw-bold">Preț redus: ${produs.pretRedus} RON</p>
          <p ><s>Preț inițial: ${produs.pret.toFixed(2)} RON</s></p>
          <button class="btn btn-primary adauga-cos" data-id="${
            produs.id
          }">Adaugă în coș</button>
        </div>
      </div>
    `;
    sectiuneProduse.appendChild(card);
  });

  activeazaButoaneCos();
}

document.addEventListener("DOMContentLoaded", function () {
  const butoaneCategorie = document.querySelectorAll(".category-btn");

  butoaneCategorie.forEach((buton) => {
    buton.addEventListener("click", function () {
      const categorie = this.getAttribute("data-category");
      afiseazaProduseDinCategorie(categorie);
    });
  });

  loadProduse();
});
