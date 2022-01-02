document.addEventListener("DOMContentLoaded", function() {
  const body = document.getElementsByTagName("body")[0];
  const theme = localStorage.getItem("theme");
  body.className = theme ?? "theme-light";
});