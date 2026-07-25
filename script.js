// =========================================================
// Buyza 
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  initNavbarToggle();
  initDropdowns();
  initCarousels();
  checkLoginStatus();
  renderCart();
  applyDarkModeOnLoad();
});

/* ---------- Mobile navbar toggle ---------- */
function initNavbarToggle() {
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navbarMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    menu.classList.toggle("open");
  });
}

/* ---------- Categories dropdown ---------- */
function initDropdowns() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach(function (dropdown) {
    var toggleLink = dropdown.querySelector(".dropdown-toggle");
    if (!toggleLink) return;

    toggleLink.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = dropdown.classList.contains("open");
      // close any other open dropdowns
      dropdowns.forEach(function (d) {
        d.classList.remove("open");
      });
      if (!isOpen) {
        dropdown.classList.add("open");
      }
    });
  });

  // close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  });
}

/* ---------- Custom carousel ---------- */
function initCarousels() {
  var carousels = document.querySelectorAll(".carousel");

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var slides = carousel.querySelectorAll(".carousel-slide");
    var prevBtn = carousel.querySelector(".carousel-btn.prev");
    var nextBtn = carousel.querySelector(".carousel-btn.next");
    var current = 0;
    var total = slides.length;
    var autoplayDelay = parseInt(carousel.dataset.interval, 10) || 4000;
    var timer = null;

    if (!track || total === 0) return;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = "translateX(-" + current * 100 + "%)";
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        startAutoplay();
      });
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    goTo(0);
    startAutoplay();
  });
}




/* ---------- Dark mode ---------- */
function toggleDarkMode(btn) {
  document.body.classList.toggle("dark-mode");
  document.documentElement.classList.toggle("dark-mode");

  var isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "true" : "false");

  updateThemeIcon();
}

function applyDarkModeOnLoad() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document.documentElement.classList.add("dark-mode");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  var btn = document.querySelector(".theme-btn");
  if (!btn) return;

  if (document.body.classList.contains("dark-mode")) {
    btn.textContent = "☀️";
  } else {
    btn.textContent = "🌙";
  }
}


/* ---------- Login popup ---------- */
function toggleLogin() {
  var overlay = document.getElementById("loginOverlay");
  overlay.classList.toggle("show");
}
/* ---------- Login / Profile simulation ---------- */

function handleLogin(event) {
  event.preventDefault(); // stop the page from reloading

  // remembers that the user is logged in
  localStorage.setItem("loggedIn", "true");

  // hides the login popup
  toggleLogin();

  // shows the profile menu
  showProfileMenu();

  return false;
}

function toggleDropdown() {
  var dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("open");
}

function logOut() {
  localStorage.removeItem("loggedIn"); // logOut
  hideProfileMenu();
}

function showProfileMenu() {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("profileMenu").classList.add("show");
}

function hideProfileMenu() {
  document.getElementById("profileMenu").classList.remove("show");
  document.getElementById("loginBtn").style.display = "inline-block";
  document.getElementById("profileDropdown").classList.remove("open");
}

/* ---------- Check login status when page loads ---------- */
function checkLoginStatus() {
  if (localStorage.getItem("loggedIn") === "true") {
    showProfileMenu();
  }
}


/* ---------- Login check helper ---------- */
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

/* ---------- Cart (localStorage-based) ---------- */
function getCart() {
  var cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(event, name, price, img) {
  event.preventDefault();

  if (!isLoggedIn()) {
    toggleLogin();
    return;
  }

  var cart = getCart();
  var existing = cart.find(function (item) { return item.name === name; });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: price, img: img, qty: 1 });
  }

  saveCart(cart);
  alert("Added to Cart!");
}

function removeFromCart(index) {
  var cart = getCart();

  cart[index].qty -= 1;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function renderCart() {
  var container = document.getElementById("cartItemsList");
  if (!container) return;

  var cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<h2>Your cart is empty</h2>";
    return;
  }

  var total = 0;

  cart.forEach(function (item, index) {
    total += item.price * item.qty;

    var row = document.createElement("div");
    row.className = "cart-row";

    var img = document.createElement("img");
    img.src = item.img;
    img.className = "cart-row-img";

    var info = document.createElement("div");
    info.className = "cart-row-info";
    info.innerHTML = "<h4>" + item.name + "</h4><p>Rs." + formatRs(item.price) + " x " + item.qty + "</p>";

    var removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-sm btn-outline-warning";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = function () {
      removeFromCart(index);
    };

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(removeBtn);
    container.appendChild(row);
  });

  var totalRow = document.createElement("h3");
  totalRow.className = "cart-total";
  totalRow.textContent = "Total: Rs." + formatRs(total);
  container.appendChild(totalRow);
}

function formatRs(num) {
  return num.toLocaleString('en-IN');
}