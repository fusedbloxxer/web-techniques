window.addEventListener("DOMContentLoaded", function() {
  // Track once, when the page loads.
  trackCurrentPage();

  // Track same-page changes regarding sections
  window.addEventListener("hashchange", trackCurrentPage);
});

function trackCurrentPage() {
  // Get url info to select menu elements accordingly
  const {
    routeParams: r,
  } = extractRouteParams();

  // There are no routes to query
  if (!r.length) {
    return;
  }

  // Select the menu item using the root route param
  const menuItems = document.getElementsByClassName("menu-item");

  // Find the right menu item
  for (const menuItem of menuItems) {
    // Deactivate state the first time
    menuItem.classList.remove('highlight-active');

    // Get the root page links
    const menuItemLinks = menuItem.getElementsByTagName("a");

    // No clickable page elements are present
    if (!menuItemLinks?.length) {
      return;
    }

    // At least the root page links must show up
    const menuItemLink = menuItem.getElementsByTagName("a")[0];

    // Get the href info to compare it later
    const menuItemRoute = menuItemLink
      .getAttribute("href")
      .replace('/', '');

    // Compare the root href with the url route param
    if (!menuItemRoute.startsWith(r[0])) {
      continue;
    }

    // Mark the root page
    menuItem.classList.toggle('highlight-active');

    // Check if the submenu link is active too
    const subMenuItems = menuItem.getElementsByClassName("submenu-item");

    // Get the full route
    const route = extractCompleteRoute();

    for (const subMenuItem of subMenuItems) {
      // Deactivate state the first time
      subMenuItem.classList.remove('highlight-active');

      // At least the root page links must show up
      const subMenuLink = subMenuItem.getElementsByTagName("a")[0];

      // Get the href info to compare it later
      const subMenuItemRoute = subMenuLink
      .getAttribute("href");

      // Check if the HTML element matches the current route
      if (route !== subMenuItemRoute) {
        continue;
      }

      // Activate the submenu item
      subMenuItem.classList.toggle('highlight-active');
    }
  }
}

function extractRouteParams() {
  // Get route parameters
  const routeParams = window.location.pathname.replace('/', '').split('/');

  // Get sections
  const section = window.location.hash.replace('#', '');

  // Get query parameters
  const queryString = window.location.search;
  const queryUrlParams = new URLSearchParams(queryString);
  const queryParams = Object.fromEntries(queryUrlParams.entries());

  // Bundle and return
  return {
    routeParams,
    queryParams,
    section
  }
}

function extractCompleteRoute() {
  // Get route parameters
  const path = window.location.pathname;

  // Get sections
  const section = window.location.hash;

  // Get query parameters
  const query = window.location.search;

  // Bundle and return
  return `${path}${query}${section}`
}