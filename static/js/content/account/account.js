window.addEventListener("DOMContentLoaded", function() {
  const themeList = document
    .getElementById("theme-list")
    .getElementsByTagName("input");

  for (const themeItem of themeList) {
    themeItem.addEventListener("change", function() {
      if (!this.checked) {
        return;
      }

      localStorage.setItem("theme", themeItem.id);
      document.body.className = themeItem.id;
    });
  }
});