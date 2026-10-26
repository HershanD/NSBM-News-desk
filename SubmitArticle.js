
"use strict;

const $ = (id) => document.getElementById(id);

/* STORAGE KEYS */
const DRAFT_KEY = "nsbmNewsDeskArticleDraft";
const SUBMISSIONS_KEY = "nsbmNewsDeskSubmissions";
const PENDING_KEY = "nsbm_pendingCount";
const PUBLISHED_KEY = "nsbm_publishedCount";

const menuBtn = $("menuBtn");
const mainNav = $("mainNav");

if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("open");

        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            mainNav.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Open navigation");
        });
    });
}

const searchForm = $("searchForm");
const newsSearch = $("newsSearch");

if (searchForm && newsSearch) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const query = newsSearch.value.trim();

        if (!query) {
            newsSearch.focus();
            return;
        }

        
        window.location.href =
            "News.html?q=" + encodeURIComponent(query);
    });
}

const summaryInput = $("summary");
const summaryCount = $("summaryCount");

function updateSummaryCount() {
    if (summaryInput && summaryCount) {
        summaryCount.textContent = summaryInput.value.length;
    }
}

if (summaryInput) {
    summaryInput.addEventListener("input", updateSummaryCount);
}

updateSummaryCount();


const coverInput = $("coverImage");
const uploadArea = $("uploadArea");
const fileName = $("fileName");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

function showFile(file) {
    if (!file || !fileName) return false;

    if (!allowedTypes.includes(file.type)) {
        fileName.textContent =
            "Please select a JPG, PNG or WEBP image.";

        if (coverInput) coverInput.value = "";

        return false;
    }

    if (file.size > MAX_FILE_SIZE) {
        fileName.textContent =
            "Image size must not exceed 10 MB.";

        if (coverInput) coverInput.value = "";

        return false;
    }

    fileName.textContent = "Selected image: " + file.name;

    return true;
}

if (coverInput) {
    coverInput.addEventListener("change", function () {
        if (coverInput.files.length > 0) {
            showFile(coverInput.files[0]);
        } else if (fileName) {
            fileName.textContent = "";
        }
    });
}

if (uploadArea) {
    ["dragenter", "dragover"].forEach(function (eventName) {
        uploadArea.addEventListener(eventName, function (event) {
            event.preventDefault();
            uploadArea.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
        uploadArea.addEventListener(eventName, function (event) {
            event.preventDefault();
            uploadArea.classList.remove("dragover");
        });
    });

    uploadArea.addEventListener("drop", function (event) {
        const files = event.dataTransfer.files;
        if (!files.length || !coverInput) return;

        const file = files[0];

        if (!showFile(file)) return;

        try {
            const transfer = new DataTransfer();
            transfer.items.add(file);
            coverInput.files = transfer.files;
        } catch (error) {
            if (fileName) {
                fileName.textContent =
                    "Image selected: " + file.name +
                    ". If needed, select it using Browse Files.";
            }
        }
    });
}



const contentInput = document.getElementById("content");
const contentPreview = document.getElementById("contentPreview");
const writeTab = document.getElementById("writeTab");
const previewTab = document.getElementById("previewTab");

function setEditorMode(mode) {
    if (!contentInput || !contentPreview || !writeTab || !previewTab) {
        console.error("Write/Preview button elements are missing.");
        return;
    }

    const isPreview = mode === "preview";

    // Show the correct panel
    contentInput.hidden = isPreview;
    contentPreview.hidden = !isPreview;

    // Change button colors
    writeTab.classList.toggle("active", !isPreview);
    previewTab.classList.toggle("active", isPreview);

    // Update accessibility state
    writeTab.setAttribute("aria-pressed", String(!isPreview));
    previewTab.setAttribute("aria-pressed", String(isPreview));

    // Display article content
    if (isPreview) {
        contentPreview.textContent =
            contentInput.value.trim() ||
            "Your article preview will appear here.";
    }
}

writeTab?.addEventListener("click", function () {
    setEditorMode("write");
});

previewTab?.addEventListener("click", function () {
    setEditorMode("preview");
});

// Initially select Write
setEditorMode("write");
c


const form = $("articleForm");
const formMessage = $("formMessage");
const pendingEl = $("pendingCount");
const publishedEl = $("PublishedCount");
const saveDraftBtn = $("saveDraft");

function showMessage(message) {
    if (formMessage) {
        formMessage.textContent = message;
    }
}

function readArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");

        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function getCount(key) {
    const raw = localStorage.getItem(key);

    if (raw === null) return 0;

    const value = Number(raw);

    return Number.isSafeInteger(value) && value >= 0
        ? value
        : 0;
}

function updateSubmissionCounts() {
    if (pendingEl) {
        pendingEl.textContent = String(
            getCount(PENDING_KEY)
        ).padStart(2, "0");
    }

    if (publishedEl) {
        publishedEl.textContent = String(
            getCount(PUBLISHED_KEY)
        ).padStart(2, "0");
    }
}


function collectArticle() {
    return {
        id: Date.now().toString(),
        title: $("articleTitle").value.trim(),
        category: $("category").value,
        author: $("author").value.trim(),
        summary: summaryInput.value.trim(),
        content: contentInput.value.trim(),
        imageName: coverInput && coverInput.files.length
            ? coverInput.files[0].name
            : "",
        status: "Pending Review",
        submittedAt: new Date().toISOString()
    };
}


function loadDraft() {
    try {
        const saved = localStorage.getItem(DRAFT_KEY);

        if (!saved) return;

        const draft = JSON.parse(saved);

        if (!draft || typeof draft !== "object") return;

        if ($("articleTitle")) {
            $("articleTitle").value = draft.title || "";
        }

        if ($("category")) {
            $("category").value = draft.category || "";
        }

        if ($("author")) {
            $("author").value = draft.author || "";
        }

        if (summaryInput) {
            summaryInput.value = draft.summary || "";
        }

        if (contentInput) {
            contentInput.value = draft.content || "";
        }

        updateSummaryCount();

        showMessage(
            "Your saved draft has been restored. Please check it before submitting."
        );
    } catch (error) {
        showMessage("Unable to restore the saved draft.");
    }
}

if (saveDraftBtn) {
    saveDraftBtn.addEventListener("click", function () {
        const draft = {
            title: $("articleTitle").value,
            category: $("category").value,
            author: $("author").value,
            summary: summaryInput.value,
            content: contentInput.value
        };

        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

            showMessage(
                "Draft saved in this browser. You can continue editing later."
            );
        } catch (error) {
            showMessage(
                "Unable to save the draft. Browser storage may be full or unavailable."
            );
        }
    });
}

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        // Validate image before submitting.
        if (coverInput && coverInput.files.length > 0) {
            if (!showFile(coverInput.files[0])) {
                return;
            }
        }

        const article = collectArticle();

        try {
            // Save a local frontend demonstration record.
            const submissions = readArray(SUBMISSIONS_KEY);

            submissions.push(article);

            localStorage.setItem(
                SUBMISSIONS_KEY,
                JSON.stringify(submissions)
            );

            // Increase the pending count.
            const pending = getCount(PENDING_KEY) + 1;

            localStorage.setItem(
                PENDING_KEY,
                String(pending)
            );

            // Remove the saved draft after successful storage.
            localStorage.removeItem(DRAFT_KEY);

            updateSubmissionCounts();

            showMessage(
                "Article saved for review in this browser. " +
                "Pending submissions: " +
                String(pending).padStart(2, "0") +
                "."
            );

            form.reset();

            updateSummaryCount();

            if (fileName) {
                fileName.textContent = "";
            }

            setEditorMode("write");

        } catch (error) {
            showMessage(
                "Unable to save the submission. Browser storage may be full or unavailable."
            );
        }
    });
}


updateSubmissionCounts();
loadDraft();
