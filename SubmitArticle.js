// MOBILE MENU
document.getElementById("menuBtn").addEventListener("click", function () {
    document.getElementById("mainNav").classList.toggle("open");
});

// SUMMARY COUNT
const summaryInput = document.getElementById("summary");
const summaryCount = document.getElementById("summaryCount");
summaryInput.addEventListener("input", function () {
    summaryCount.textContent = summaryInput.value.length;
});

// BREAKING NEWS - MARQUEE
const breakingNews = [
    "Annual Green Walk 2024 announced with massive participation from all faculties",
    "Faculty of Computing wins the Inter-Faculty Hackathon 2024",
    "Admissions for the new intake are now open",
    "NSBM Sports Fiesta 2024 coming soon"
];
function loadBreakingNews(){
    const track = document.getElementById("marqueeTrack");
    if(!track) return;
    const allNews = [...breakingNews, ...breakingNews];
    track.innerHTML = allNews.map(n => `<span>${n}</span><span class="dot"></span>`).join(" ");
}
loadBreakingNews();

// IMAGE UPLOAD
const coverInput = document.getElementById("coverImage");
const uploadArea = document.getElementById("uploadArea");
const fileName = document.getElementById("fileName");

function showFile(file){
    if(!file) return;
    if(file.size > 10*1024*1024){ fileName.textContent="Image size must be less than 10MB."; return; }
    fileName.textContent="Selected image: "+file.name;
}
coverInput.addEventListener("change", ()=> showFile(coverInput.files[0]));
["dragenter","dragover"].forEach(e=> uploadArea.addEventListener(e, ev=>{ ev.preventDefault(); uploadArea.classList.add("dragover"); }));
["dragleave","drop"].forEach(e=> uploadArea.addEventListener(e, ev=>{ ev.preventDefault(); uploadArea.classList.remove("dragover"); }));
uploadArea.addEventListener("drop", ev=>{
    const file=ev.dataTransfer.files[0];
    if(file){ const dt=new DataTransfer(); dt.items.add(file); coverInput.files=dt.files; showFile(file); }
});

// WRITE / PREVIEW
const contentInput=document.getElementById("content");
const contentPreview=document.getElementById("contentPreview");
const writeTab=document.getElementById("writeTab");
const previewTab=document.getElementById("previewTab");
function setEditorMode(mode){
    const isPreview=mode==="preview";
    contentPreview.hidden=!isPreview; contentInput.hidden=isPreview;
    writeTab.classList.toggle("active",!isPreview); previewTab.classList.toggle("active",isPreview);
    if(isPreview) contentPreview.textContent=contentInput.value||"Your article preview will appear here.";
}
writeTab.addEventListener("click",()=> setEditorMode("write"));
previewTab.addEventListener("click",()=> setEditorMode("preview"));


const form = document.getElementById("articleForm");
const formMessage = document.getElementById("formMessage");
const pendingEl = document.getElementById("pendingCount");
const publishedEl = document.getElementById("publishedCount");

function updateSubmissionCounts(){
    let pending = localStorage.getItem("nsbm_pendingCount");
    let published = localStorage.getItem("nsbm_publishedCount");
    if(pending === null){ pending = 2; localStorage.setItem("nsbm_pendingCount", pending); }
    if(published === null){ published = 12; localStorage.setItem("nsbm_publishedCount", published); }
    pendingEl.textContent = String(pending).padStart(2, '0');
    publishedEl.textContent = String(published).padStart(2, '0');
}

document.getElementById("saveDraft").addEventListener("click", function () {
    const draft = {
        title: document.getElementById("articleTitle").value,
        category: document.getElementById("category").value,
        author: document.getElementById("author").value,
        summary: summaryInput.value,
        content: contentInput.value
    };
    try {
        localStorage.setItem("nsbmNewsDeskArticleDraft", JSON.stringify(draft));
        formMessage.textContent = "Draft saved in this browser.";
    } catch (error) {
        formMessage.textContent = "Unable to save the draft.";
    }
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    let pending = parseInt(localStorage.getItem("nsbm_pendingCount") || 2);
    pending++;
    localStorage.setItem("nsbm_pendingCount", pending);
    updateSubmissionCounts();
    formMessage.textContent = "Submitted! Pending count -> " + String(pending).padStart(2,'0');
    form.reset();
    summaryCount.textContent = "0";
    fileName.textContent = "";
    setEditorMode("write");
});

updateSubmissionCounts();