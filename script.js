document.addEventListener("DOMContentLoaded", () => {

  // Approve button action
  const approveButtons = document.querySelectorAll(".btn-approve");
  approveButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      row.style.backgroundColor = "#e6fffa";
      setTimeout(() => {
        alert("Article approved and published!");
      }, 100);
    });
  });

  // Reject button action
  const rejectButtons = document.querySelectorAll(".btn-reject");
  rejectButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      row.style.backgroundColor = "#ffe4e6";
      setTimeout(() => {
        alert("Article rejected.");
      }, 100);
    });
  });

});