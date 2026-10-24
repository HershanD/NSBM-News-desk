
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. Select Homepage Elements
  // ==========================================
  const categoryButtons = document.querySelectorAll(".cat-btn");
  const newsGrid = document.querySelector(".card-grid");
  const searchInput = document.querySelector(
    '.search-box input[type="search"]'
  );
  const loadMoreButton = document.querySelector(".btn-load-more");

  const newsCards = newsGrid
    ? Array.from(newsGrid.querySelectorAll(".card"))
    : [];

  let selectedCategory = "all news";
  let visibleCount = 4;
  const nextBatchCount = 4;

  // ==========================================
  // 2. Combined Search, Category & Load More
  // ==========================================
  function updateArticles() {
    const searchTerm = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    newsCards.forEach((card, index) => {
      const title =
        card.querySelector("h3")?.textContent.toLowerCase() || "";

      const description =
        card.querySelector(".card-body p")?.textContent.toLowerCase() || "";

      const tag =
        card.querySelector(".tag")?.textContent.trim().toLowerCase() || "";

      const matchesCategory =
        selectedCategory === "all news" ||
        tag === selectedCategory;

      const matchesSearch =
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        tag.includes(searchTerm);

      const isLoaded = index < visibleCount;

      card.style.display =
        matchesCategory && matchesSearch && isLoaded ? "" : "none";
    });

    if (loadMoreButton) {
      loadMoreButton.style.display =
        visibleCount >= newsCards.length ? "none" : "";
    }
  }

  // ==========================================
  // 3. Category Filter Buttons
  // ==========================================
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      selectedCategory = button.textContent.trim().toLowerCase();

      updateArticles();
    });
  });

  // ==========================================
  // 4. Live News Search
  // ==========================================
  if (searchInput) {
    searchInput.addEventListener("input", updateArticles);
  }

  // ==========================================
  // 5. Load More Articles
  // ==========================================
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      visibleCount = Math.min(
        visibleCount + nextBatchCount,
        newsCards.length
      );

      updateArticles();
    });
  }

  // ==========================================
  // 6. Bookmark Button Visual Toggle
  // ==========================================
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");

  bookmarkButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const isBookmarked = button.classList.toggle("active");

      button.style.backgroundColor = isBookmarked
        ? "#026838"
        : "#f1f5f9";

      button.style.color = isBookmarked
        ? "#ffffff"
        : "#64748b";

      button.setAttribute("aria-pressed", String(isBookmarked));
    });
  });

  // ==========================================
  // 7. Student Profile Dropdown
  // ==========================================
  const profileToggle = document.getElementById("profileToggle");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutButton = document.getElementById("logoutBtn");

  if (profileToggle && profileDropdown) {
    profileToggle.addEventListener("click", () => {
      const isOpening = profileDropdown.hidden;

      profileDropdown.hidden = !isOpening;
      profileToggle.setAttribute(
        "aria-expanded",
        String(isOpening)
      );
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".profile-menu")) {
        profileDropdown.hidden = true;
        profileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ==========================================
  // 8. Logout Confirmation
  // ==========================================
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      const confirmLogout = confirm(
        "Are you sure you want to log out?"
      );

      if (confirmLogout) {
        window.location.href = "index.html";
      }
    });
  }

  // Initial homepage display
  updateArticles();
});
