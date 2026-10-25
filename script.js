const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".article-card");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

let selectedCategory = "All";

function updateArticles() {
    const keyword = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
        const category = card.dataset.category;
        const text = card.textContent.toLowerCase();

        const categoryMatches =
            selectedCategory === "All" ||
            category === selectedCategory;

        const searchMatches = text.includes(keyword);
        const show = categoryMatches && searchMatches;

        card.hidden = !show;

        if (show) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;

    filterButtons.forEach(button => {
        const active = button.dataset.category === selectedCategory;
        button.classList.toggle("active", active);
    });

    const allButton = document.querySelector(
        '.filter[data-category="All"]'
    );

    allButton.textContent = All (${visibleCount});
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        updateArticles();
    });
});

searchInput.addEventListener("input", updateArticles);

// Front-end bookmark demo
document.querySelectorAll(".bookmark").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".article-card");
        const isSaved = button.dataset.saved !== "false";

        if (isSaved) {
            button.dataset.saved = "false";
            button.style.opacity = "0.45";
            card.dataset.saved = "false";
        } else {
            button.dataset.saved = "true";
            button.style.opacity = "1";
            card.dataset.saved = "true";
        }
    });
});

updateArticles();