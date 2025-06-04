let produse = [];
let produseFiltrate = [];
let paginaCurenta = 1;
let PAGINA_SIZE = 12;

fetch("Produse.json")
  .then((r) => r.json())
  .then((data) => {
    produse = data;
    produseFiltrate = data;
    initApp();
  })
  .catch((e) => {
    document.querySelector(".row.g-4").innerHTML =
      "<div class='text-danger'>Eroare la încărcarea produselor.</div>";
    console.error(e);
  });

function initApp() {
  const container = document.querySelector(".row.g-4");

  function creeazaSelectPaginare() {
    let select = document.getElementById("select-pagina-size");
    if (!select) {
      select = document.createElement("select");
      select.id = "select-pagina-size";
      select.className = "form-select form-select-sm mb-3";
      select.style.width = "auto";
      select.innerHTML = `
        <option value="6">6 / pagină</option>
        <option value="12" selected>12 / pagină</option>
        <option value="24">24 / pagină</option>
        <option value="48">48 / pagină</option>
        <option value="100">100 / pagină</option>
      `;

      container.parentElement.insertBefore(select, container);
    }
    select.value = PAGINA_SIZE;

    select.onchange = function () {
      PAGINA_SIZE = parseInt(this.value);
      paginaCurenta = 1;
      afiseazaProduse(produseFiltrate, paginaCurenta);
    };
  }

  function creeazaOffcanvasCos() {
    if (document.getElementById("offcanvasCos")) return;
    const offcanvasHtml = `
      <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasCos" aria-labelledby="offcanvasCosLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasCosLabel"><i class="bi bi-cart3"></i> Coșul tău</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Închide"></button>
        </div>
        <div class="offcanvas-body" id="continutCos"></div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", offcanvasHtml);
  }
  creeazaOffcanvasCos();

  function creeazaCardProdus(prod) {
    return `
      <div class="col-12 col-md-6 col-lg-4 d-flex">
          <div class="card h-100 bg-dark text-white shadow-lg flex-fill position-relative">
              <img src="${prod.imagine}" class="card-img-top card-img" alt="${prod.nume}">
              <div class="card-body d-flex flex-column">
                  <h5 class="card-title" style="color:#38bdf8;">${prod.nume}</h5>
                  <p class="card-text">${prod.descriere}</p>
                  <div class="mb-2">
                      <span class="badge bg-info">${prod.categorie}</span>
                      <span class="ms-2 text-warning"><i class="bi bi-star-fill"></i> ${prod.rating}</span>
                  </div>
                  <div class="mb-2 fw-bold" style="font-size:1.2rem;">${prod.pret} lei</div>
                  <div class="d-flex justify-content-between align-items-center mt-auto">
                      <button class="btn btn-gradient flex-grow-1 me-2 btn-cos" data-id="${prod.id}">
                          <i class="bi bi-cart-plus"></i> Adaugă în coș
                      </button>
                      <button class="btn btn-outline-light btn-like" title="Apreciază" data-id="${prod.id}">
                          <i class="bi bi-heart"></i>
                      </button>
                  </div>
              </div>
          </div>
      </div>
      `;
  }

  function afiseazaProduse(lista, pagina = 1) {
    const start = (pagina - 1) * PAGINA_SIZE;
    const end = start + PAGINA_SIZE;
    const produsePagina = lista.slice(start, end);
    container.innerHTML = produsePagina.map(creeazaCardProdus).join("");
    creeazaSelectPaginare();
    afiseazaPaginatie(lista.length, pagina);
    activeazaButoane();
  }

  function afiseazaPaginatie(total, pagina) {
    let pagContainer = document.getElementById("paginatie");
    if (!pagContainer) {
      pagContainer = document.createElement("div");
      pagContainer.id = "paginatie";
      pagContainer.className = "d-flex justify-content-center mt-4";
      container.parentElement.appendChild(pagContainer);
    }
    const nrPagini = Math.ceil(total / PAGINA_SIZE);
    let html = `<nav><ul class="pagination">`;
    for (let i = 1; i <= nrPagini; i++) {
      html += `<li class="page-item${i === pagina ? " active" : ""}">
        <button class="page-link" data-pagina="${i}">${i}</button>
      </li>`;
    }
    html += `</ul></nav>`;
    pagContainer.innerHTML = html;

    pagContainer.querySelectorAll(".page-link").forEach((btn) => {
      btn.addEventListener("click", function () {
        paginaCurenta = parseInt(this.getAttribute("data-pagina"));
        afiseazaProduse(produseFiltrate, paginaCurenta);
      });
    });
  }

  function activeazaButoane() {
    document.querySelectorAll(".btn-like").forEach((btn) => {
      btn.addEventListener("click", function () {
        const icon = this.querySelector("i");
        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");
        icon.style.color = icon.classList.contains("bi-heart-fill")
          ? "#ec4899"
          : "";
      });
    });

    document.querySelectorAll(".btn-cos").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        adaugaInCos(id);
      });
    });
  }

  const btnCart = document.querySelector(".bi-cart3")?.parentElement;
  if (btnCart) {
    btnCart.addEventListener("click", function (e) {
      e.preventDefault();
      afiseazaCosInOffcanvas();
      const offcanvas = new bootstrap.Offcanvas(
        document.getElementById("offcanvasCos")
      );
      offcanvas.show();
    });
  }

  function getCos() {
    return JSON.parse(localStorage.getItem("cos")) || [];
  }
  function setCos(cos) {
    localStorage.setItem("cos", JSON.stringify(cos));
    actualizeazaBadgeCos();
  }
  function adaugaInCos(id) {
    let cos = getCos();
    const idx = cos.findIndex((item) => item.id === id);
    if (idx > -1) {
      cos[idx].cantitate += 1;
    } else {
      cos.push({ id, cantitate: 1 });
    }
    setCos(cos);
  }

  function afiseazaCosInOffcanvas() {
    const cos = getCos();
    const continut = document.getElementById("continutCos");
    if (!continut) return;

    let btnCheckout = document.getElementById("btnCheckout");
    if (cos.length === 0) {
      continut.innerHTML = `<div class="text-center text-secondary">Coșul este gol.</div>`;
      if (btnCheckout) btnCheckout.remove();
      return;
    }

    let total = 0;
    let html = `<ul class="list-group list-group-flush mb-3">`;
    cos.forEach((item) => {
      const prod = produse.find((p) => p.id === item.id);
      if (!prod) return;
      const subtotal = prod.pret * item.cantitate;
      total += subtotal;
      html += `
        <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="${prod.imagine}" alt="${
        prod.nume
      }" style="width:40px;height:40px;object-fit:cover;border-radius:8px;margin-right:10px;">
            <span>${prod.nume}</span>
            <span class="badge bg-info ms-2">${item.cantitate} x ${
        prod.pret
      } lei</span>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-warning btn-minus fw-bold" data-id="${
              item.id
            }" title="Scade" style="color:#232946;">
              <i class="bi bi-dash"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-remove fw-bold" data-id="${
              item.id
            }" title="Șterge">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <span class="fw-bold ms-2">${subtotal.toFixed(2)} lei</span>
        </li>
      `;
    });
    html += `</ul>
      <div class="text-end fw-bold fs-5">Total: ${total.toFixed(2)} lei</div>
    `;
    continut.innerHTML = html;

    btnCheckout = document.getElementById("btnCheckout");
    if (!btnCheckout) {
      btnCheckout = document.createElement("button");
      btnCheckout.id = "btnCheckout";
      btnCheckout.className = "btn btn-gradient w-100 mt-3";
      btnCheckout.innerHTML = '<i class="bi bi-credit-card"></i> Checkout';
      continut.appendChild(btnCheckout);
      btnCheckout.onclick = deschideCheckoutModal;
    }

    continut.querySelectorAll(".btn-minus").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        modificaCantitateInCos(id, -1);
      });
    });

    continut.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        stergeDinCos(id);
      });
    });
  }

  function modificaCantitateInCos(id, delta) {
    let cos = getCos();
    const idx = cos.findIndex((item) => item.id === id);
    if (idx > -1) {
      cos[idx].cantitate += delta;
      if (cos[idx].cantitate <= 0) {
        cos.splice(idx, 1);
      }
      setCos(cos);
      afiseazaCosInOffcanvas();
    }
  }

  function stergeDinCos(id) {
    let cos = getCos();
    cos = cos.filter((item) => item.id !== id);
    setCos(cos);
    afiseazaCosInOffcanvas();
  }

  function actualizeazaBadgeCos() {
    const cos = getCos();
    const total = cos.reduce((acc, item) => acc + item.cantitate, 0);
    const badge = document
      .querySelector(".bi-cart3")
      ?.parentElement.querySelector(".badge");
    if (badge) badge.textContent = total;
  }

  const preturi = produse.map((p) => p.pret);
  const minPret = Math.floor(Math.min(...preturi));
  const maxPret = Math.ceil(Math.max(...preturi));
  const slider = document.getElementById("slider-pret");
  const minLabel = document.getElementById("pret-slider-min");
  const maxLabel = document.getElementById("pret-slider-max");
  slider.min = minPret;
  slider.max = maxPret;
  slider.value = maxPret;
  minLabel.textContent = minPret + " lei";
  maxLabel.textContent = maxPret + " lei";

  function filtreazaSidebar() {
    const categorii = [];
    if (document.getElementById("cat-casti").checked) categorii.push("Căști");
    if (document.getElementById("cat-boxe").checked) categorii.push("Boxe");
    if (document.getElementById("cat-tv").checked)
      categorii.push("Televizoare");
    const pretMax = parseFloat(slider.value);

    produseFiltrate = produse.filter(
      (p) =>
        (categorii.length === 0 || categorii.includes(p.categorie)) &&
        p.pret <= pretMax
    );
    paginaCurenta = 1;
    afiseazaProduse(produseFiltrate, paginaCurenta);
  }

  slider.addEventListener("input", function () {
    maxLabel.textContent = this.value + " lei";
    filtreazaSidebar();
  });
  document
    .getElementById("cat-casti")
    .addEventListener("change", filtreazaSidebar);
  document
    .getElementById("cat-boxe")
    .addEventListener("change", filtreazaSidebar);
  document
    .getElementById("cat-tv")
    .addEventListener("change", filtreazaSidebar);

  document.getElementById("btn-reset-sidebar").onclick = function () {
    document.getElementById("cat-casti").checked = false;
    document.getElementById("cat-boxe").checked = false;
    document.getElementById("cat-tv").checked = false;
    slider.value = maxPret;
    maxLabel.textContent = maxPret + " lei";
    produseFiltrate = produse;
    paginaCurenta = 1;
    afiseazaProduse(produseFiltrate, paginaCurenta);
  };

  afiseazaProduse(produseFiltrate, paginaCurenta);
  actualizeazaBadgeCos();

  function creeazaModalProdus() {
    if (document.getElementById("modalProdus")) return;
    const modalHtml = `
      <div class="modal fade" id="modalProdus" tabindex="-1" aria-labelledby="modalProdusLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="modalProdusLabel"></h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Închide" id="modalProdusClose"></button>
            </div>
            <div class="modal-body">
              <div class="row g-4">
                <div class="col-md-5 text-center">
                  <img id="modalProdusImg" src="" alt="" class="img-fluid rounded shadow" style="max-height:320px;">
                </div>
                <div class="col-md-7">
                  <div id="modalProdusDescriere" class="mb-2"></div>
                  <div class="mb-2"><span class="badge bg-info" id="modalProdusCategorie"></span></div>
                  <div class="mb-2 text-warning"><i class="bi bi-star-fill"></i> <span id="modalProdusRating"></span></div>
                  <div class="mb-2 fw-bold fs-5"><span id="modalProdusPret"></span> lei</div>
                  <button class="btn btn-gradient mb-3" id="modalAdaugaCos"><i class="bi bi-cart-plus"></i> Adaugă în coș</button>
                  <hr>
                  <h6 class="fw-bold mt-3 mb-2" style="color:#ffe066;">Recenzii</h6>
                  <div id="modalRecenzii" class="mb-3"></div>
                  <form id="formRecenzie" autocomplete="off">
                    <div class="mb-2">
                      <textarea class="form-control" id="inputRecenzie" rows="2" maxlength="300" placeholder="Scrie o recenzie..." required></textarea>
                    </div>
                    <div class="mb-2 d-flex align-items-center gap-2">
                      <div id="inputRatingStars" class="rating-stars"></div>
                      <input type="hidden" id="inputRating" required>
                      <button type="submit" class="btn btn-info btn-sm ms-2">Adaugă recenzie</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }
  creeazaModalProdus();

  function getRecenzii(id) {
    return JSON.parse(localStorage.getItem("recenzii_" + id)) || [];
  }
  function setRecenzie(id, recenzie) {
    const recenzii = getRecenzii(id);
    recenzii.unshift(recenzie);
    localStorage.setItem("recenzii_" + id, JSON.stringify(recenzii));
  }

  function deschideModalProdus(id) {
    const prod = produse.find((p) => p.id === id);
    if (!prod) return;
    document.getElementById("modalProdusLabel").textContent = prod.nume;
    document.getElementById("modalProdusImg").src = prod.imagine;
    document.getElementById("modalProdusImg").alt = prod.nume;
    document.getElementById("modalProdusDescriere").textContent =
      prod.descriere;
    document.getElementById("modalProdusCategorie").textContent =
      prod.categorie;
    document.getElementById("modalProdusRating").textContent = prod.rating;
    document.getElementById("modalProdusPret").textContent = prod.pret;

    const recenzii = getRecenzii(id);
    const recenziiDiv = document.getElementById("modalRecenzii");
    if (recenzii.length === 0) {
      recenziiDiv.innerHTML = `<div class="text-secondary">Nu există recenzii încă.</div>`;
    } else {
      recenziiDiv.innerHTML = recenzii
        .map(
          (r) => `
        <div class="border-bottom pb-2 mb-2">
          <span class="fw-bold" style="color:#38bdf8;">${r.rating} ★</span>
          <span class="ms-2">${r.text}</span>
          <div class="text-muted small">${r.data}</div>
        </div>
      `
        )
        .join("");
    }

    const starsDiv = document.getElementById("inputRatingStars");
    const inputRating = document.getElementById("inputRating");
    starsDiv.innerHTML = "";
    let selected = 0;
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("i");
      star.className = "bi bi-star rating-star";
      star.dataset.val = i;
      star.style.cursor = "pointer";
      star.onclick = function () {
        selected = i;
        inputRating.value = i;
        updateStars();
      };
      starsDiv.appendChild(star);
    }
    function updateStars() {
      starsDiv.querySelectorAll(".rating-star").forEach((star, idx) => {
        if (idx < selected) {
          star.classList.remove("bi-star");
          star.classList.add("bi-star-fill");
          star.style.color = "#ffe066";
        } else {
          star.classList.add("bi-star");
          star.classList.remove("bi-star-fill");
          star.style.color = "#b0b0b0";
        }
      });
    }
    updateStars();

    const form = document.getElementById("formRecenzie");
    form.reset();
    inputRating.value = "";
    selected = 0;
    updateStars();
    form.onsubmit = function (e) {
      e.preventDefault();
      const text = document.getElementById("inputRecenzie").value.trim();
      const rating = inputRating.value;
      if (!text || !rating) return;
      setRecenzie(id, {
        text,
        rating,
        data: new Date().toLocaleString("ro-RO"),
      });

      const modalEl = document.getElementById("modalProdus");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      setTimeout(() => {
        const msg = document.createElement("div");
        msg.textContent =
          "Recenzia dumneavoastră a fost înregistrată cu succes!";
        msg.className =
          "alert alert-success shadow position-fixed top-0 start-50 translate-middle-x mt-4";
        msg.style.zIndex = 2000;
        msg.style.minWidth = "320px";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2200);
      }, 350);
    };

    document.getElementById("modalAdaugaCos").onclick = function () {
      adaugaInCos(id);
      const btn = this;
      btn.innerHTML = '<i class="bi bi-check2-circle"></i> Adăugat!';
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-cart-plus"></i> Adaugă în coș';
      }, 1200);
      actualizeazaBadgeCos();
    };

    document.getElementById("modalProdusClose").onclick = function () {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalProdus")
      );
      modal.hide();
    };

    const modal = new bootstrap.Modal(document.getElementById("modalProdus"));
    modal.show();
  }

  function creeazaCheckoutModal() {
    if (document.getElementById("modalCheckout")) return;
    const modalHtml = `
      <div class="modal fade" id="modalCheckout" tabindex="-1" aria-labelledby="modalCheckoutLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="modalCheckoutLabel">Finalizare comandă</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Închide"></button>
            </div>
            <div class="modal-body">
              <div id="checkoutProduse" class="mb-4"></div>
              <form id="formCheckout" autocomplete="off">
                <div class="mb-3">
                  <label class="form-label">Nume și prenume</label>
                  <input type="text" class="form-control" id="checkoutNume" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Adresă livrare</label>
                  <input type="text" class="form-control" id="checkoutAdresa" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Telefon</label>
                  <input type="tel" class="form-control" id="checkoutTelefon" required pattern="^\\+?\\d{7,15}$">
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="checkoutEmail" required>
                </div>
                <hr>
                <div class="mb-3">
                  <label class="form-label mb-2">Alege tipul cardului</label>
                  <div class="d-flex gap-3 mb-2" id="cardTypeGroup">
                    <input type="radio" class="btn-check" name="cardType" id="cardVisa" value="Visa" required>
                    <label class="btn btn-outline-info px-4 py-2" for="cardVisa">
                      <i class="bi bi-credit-card-2-front"></i> Visa
                    </label>
                    <input type="radio" class="btn-check" name="cardType" id="cardMasterCard" value="MasterCard" required>
                    <label class="btn btn-outline-warning px-4 py-2" for="cardMasterCard">
                      <i class="bi bi-credit-card"></i> MasterCard
                    </label>
                    <input type="radio" class="btn-check" name="cardType" id="cardDebit" value="Debit" required>
                    <label class="btn btn-outline-success px-4 py-2" for="cardDebit">
                      <i class="bi bi-bank"></i> Debit
                    </label>
                  </div>
                </div>
                <div class="mb-4">
                  <div class="card p-3 bg-gradient" style="background:linear-gradient(90deg,#232946 60%,#38bdf8 100%);border-radius:18px;">
                    <div class="row g-3 align-items-center">
                      <div class="col-md-7">
                        <label class="form-label">Număr card</label>
                        <input type="text" class="form-control mb-2" id="checkoutCardNumber" required pattern="\\d{16}" maxlength="16" placeholder="16 cifre">
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Expirare</label>
                        <input type="text" class="form-control mb-2" id="checkoutCardExp" required pattern="^(0[1-9]|1[0-2])\\/\\d{2}$" placeholder="MM/AA">
                      </div>
                      <div class="col-md-2">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control mb-2" id="checkoutCardCVV" required pattern="\\d{3,4}" maxlength="4" placeholder="CVV">
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" class="btn btn-gradient w-100 mt-2">Trimite comanda</button>
              </form>
              <div id="checkoutMsg" class="mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }
  creeazaCheckoutModal();

  function deschideCheckoutModal() {
    const cos = getCos();
    const checkoutProduse = document.getElementById("checkoutProduse");
    if (!cos.length) {
      checkoutProduse.innerHTML = `<div class="text-secondary">Coșul este gol.</div>`;
    } else {
      let total = 0;
      let html = `<ul class="list-group list-group-flush mb-3">`;
      cos.forEach((item) => {
        const prod = produse.find((p) => p.id === item.id);
        if (!prod) return;
        const subtotal = prod.pret * item.cantitate;
        total += subtotal;
        html += `
          <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
            <span>${prod.nume} <span class="badge bg-info ms-2">${
          item.cantitate
        } x ${prod.pret} lei</span></span>
            <span class="fw-bold ms-2">${subtotal.toFixed(2)} lei</span>
          </li>
        `;
      });
      html += `</ul>
        <div class="text-end fw-bold fs-5">Total: ${total.toFixed(2)} lei</div>
      `;
      checkoutProduse.innerHTML = html;
    }
    document.getElementById("formCheckout").reset();
    document.getElementById("checkoutMsg").innerHTML = "";
    const modal = new bootstrap.Modal(document.getElementById("modalCheckout"));
    modal.show();
  }

  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "formCheckout") {
      e.preventDefault();
      document.getElementById("checkoutMsg").innerHTML =
        '<div class="alert alert-success mt-3">Comanda a fost trimisă cu succes! Veți fi contactat în curând.</div>';
      setCos([]);
      actualizeazaBadgeCos();
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("modalCheckout")
        );
        modal.hide();
      }, 1800);
    }
  });

  function activeazaCarduriProdus() {
    document
      .querySelectorAll(".card-img, .card-title, .card-text")
      .forEach((el) => {
        el.style.cursor = "pointer";
        el.onclick = function () {
          const card = el.closest(".card");
          const id = parseInt(
            card.querySelector(".btn-cos").getAttribute("data-id")
          );
          deschideModalProdus(id);
        };
      });
  }

  const vechiAfiseazaProduse = afiseazaProduse;
  afiseazaProduse = function (lista, pagina = 1) {
    vechiAfiseazaProduse(lista, pagina);
    activeazaCarduriProdus();
  };

  document
    .getElementById("search-produse-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const val = document
        .getElementById("search-produse")
        .value.trim()
        .toLowerCase();
      produseFiltrate = produse.filter(
        (p) =>
          p.nume.toLowerCase().includes(val) ||
          p.descriere.toLowerCase().includes(val)
      );
      paginaCurenta = 1;
      afiseazaProduse(produseFiltrate, paginaCurenta);
    });

  document
    .getElementById("search-produse")
    .addEventListener("input", function () {
      const val = this.value.trim().toLowerCase();
      produseFiltrate = produse.filter(
        (p) =>
          p.nume.toLowerCase().includes(val) ||
          p.descriere.toLowerCase().includes(val)
      );
      paginaCurenta = 1;
      afiseazaProduse(produseFiltrate, paginaCurenta);
    });
  afiseazaProduse(produseFiltrate, paginaCurenta);
  actualizeazaBadgeCos();

  function getCategorieDinURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("categorie");
  }

  function filtreazaDupaCategorie() {
    const categorie = getCategorieDinURL();
    if (categorie) {
      // Filtrare produse pe baza categoriei
      produseFiltrate = produse.filter((prod) => prod.categorie === categorie);
      paginaCurenta = 1;
      afiseazaProduse(produseFiltrate, paginaCurenta);

      // Bifează checkbox-ul corespunzător categoriei
      if (categorie === "Căști") {
        document.getElementById("cat-casti").checked = true;
      } else if (categorie === "Boxe") {
        document.getElementById("cat-boxe").checked = true;
      } else if (categorie === "Televizoare") {
        document.getElementById("cat-tv").checked = true;
      }
    }
  }

  filtreazaDupaCategorie();
}

document.addEventListener("DOMContentLoaded", () => {
  const produse = document.querySelector(".produse");
  produse.classList.add("aparitie");
});
