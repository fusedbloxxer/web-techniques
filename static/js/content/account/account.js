window.addEventListener("DOMContentLoaded", function() {
  const themeLinks = document.getElementsByClassName("theme-link");

  for (const themeLink of themeLinks) {
    themeLink.addEventListener("click", function() {
      localStorage.setItem("theme", themeLink.id);
      document.body.className = themeLink.id;
    });
  }
});