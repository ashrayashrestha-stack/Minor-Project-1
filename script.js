// =========================================================
// Mart.com — shared behaviour (no Bootstrap JS)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  initNavbarToggle();
  initDropdowns();
  initCarousels();
  checkLoginStatus();
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

/* ---------- Custom carousel (autoplay + prev/next) ---------- */
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