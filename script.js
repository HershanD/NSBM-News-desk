document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Category Filter Tabs Interactivity
  // ==========================================
  const categoryButtons = document.querySelectorAll('.cat-btn');
  const newsCards = document.querySelectorAll('.card-grid .card');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove 'active' class from all category buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Highlight the clicked button
      button.classList.add('active');

      const selectedCategory = button.textContent.trim().toLowerCase();

      // Show/Hide news cards based on category tag
      newsCards.forEach(card => {
        const tagElement = card.querySelector('.tag');
        const cardCategory = tagElement ? tagElement.textContent.trim().toLowerCase() : '';

        if (selectedCategory === 'all news' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // 2. Interactive Bookmark Button Toggle
  // ==========================================
  const bookmarkButtons = document.querySelectorAll('.bookmark-btn');

  bookmarkButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      button.classList.toggle('active');

      // Visual feedback feedback / state indication
      if (button.classList.contains('active')) {
        button.style.backgroundColor = '#026838';
        button.style.color = '#ffffff';
      } else {
        button.style.backgroundColor = '#f1f5f9';
        button.style.color = '#64748b';
      }
    });
  });


  // ==========================================
  // 3. Real-Time Search Bar Filter
  // ==========================================
  const searchInput = document.querySelector('.search-box input');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      newsCards.forEach(card => {
        const titleText = card.querySelector('h3').textContent.toLowerCase();
        const bodyText = card.querySelector('p').textContent.toLowerCase();

        if (titleText.includes(query) || bodyText.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

});


const profileToggle = document.getElementById("profileToggle");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");

if (profileToggle && profileDropdown) {
  profileToggle.addEventListener("click", () => {
    const isOpen = profileDropdown.hidden;
    profileDropdown.hidden = !isOpen;
    profileToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-menu")) {
      profileDropdown.hidden = true;
      profileToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      window.location.href = "index.html";
    }
  });
}
