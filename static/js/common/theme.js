document.addEventListener("DOMContentLoaded", function() {
  const body = document.getElementsByTagName("body")[0];
  const theme = localStorage.getItem("theme")?? "light";
  localStorage.setItem("theme", theme);
  body.className = `theme-${theme}`;
});