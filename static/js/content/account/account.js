window.addEventListener("DOMContentLoaded", function() {
  onThemeChanged();
  onCookiesAccepted();
  setThemeButtonActive();
});

function onThemeChanged() {
  const themeList = document
    .getElementById("theme-list")
    .getElementsByTagName("input");

  for (const themeItem of themeList) {
    themeItem.addEventListener("change", function() {
      if (!this.checked) {
        return;
      }

      const themeSeparatorIndex = themeItem.id.indexOf('-');
      if (themeSeparatorIndex == -1) {
        console.error(`invalid theme: ${themeItem}`);
        return;
      }

      const theme = themeItem.id.substring(themeSeparatorIndex + 1);
      document.body.className = `theme-${theme}`;
      localStorage.setItem("theme", theme);
      setThemeButtonActive();
    });
  }
}

function setThemeButtonActive() {
  const theme = localStorage.getItem("theme");

  if (!theme) {
    return;
  }

  // Fetch the corresponding label to the theme
  const themeLabel = document.getElementById(`theme-${theme}-label`);
  if (!themeLabel) {
    console.error(`label with id theme-${theme}-label does not exist`);
    return;
  }

  // Deselect the other labels if they were already selected
  for (const label of document.getElementsByClassName("theme-item")) {
    label.style.borderColor = 'var(--color-theme-select-border)';
  }

  // Mark the current label as active
  themeLabel.style.borderColor = 'var(--color-theme-select-border-active)';
}

function onCookiesAccepted() {
  let lastAccessedPages = getCookie("lastAccessedPages");

  if (!lastAccessedPages) {
    return;
  }

  // Show the recent pages container
  const recentPagesCard = document.getElementById("recent-pages-container");
  recentPagesCard.style.display = 'flex';

  // Set the links in the container
  lastAccessedPages = JSON.parse(lastAccessedPages).reverse();
  const recentPagesList = document.getElementById("recent-pages-list");
  for (const recentPage of lastAccessedPages) {
    // Create the page link element
    const recentPageLink = document.createElement("a");
    recentPageLink.className = 'list-group-item list-group-item-action';
    recentPageLink.innerHTML = recentPage;
    recentPageLink.href = recentPage;

    // Add the page to the list
    recentPagesList.appendChild(recentPageLink);
  }
}