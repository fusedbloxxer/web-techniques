document.addEventListener("DOMContentLoaded", function() {
  let theme = localStorage.getItem("theme")
  if (theme) {
    let body = document.getElementsByTagName("body")[0];
    body.className = theme;
  } else {
    body.className = "theme-light";
  }
});