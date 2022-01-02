window.addEventListener("DOMContentLoaded", function () {
  checkBannerCookie();
  console.log(getCookie("lastAccessedPages"));
});

window.addEventListener("beforeunload", function () {
  if (getCookie("bannerAccepted")) {
    const maxArraySize = 2;
    const storedPages = getCookie("lastAccessedPages");
    const lastAccessedPages = storedPages ? JSON.parse(storedPages) : [];

    if (lastAccessedPages.length >= maxArraySize) {
      lastAccessedPages.shift();
    }

    lastAccessedPages.push(window.location.href);
    setCookie("lastAccessedPages", JSON.stringify(lastAccessedPages));
  }
});

function checkBannerCookie() {
  const isBannerAccepted = getCookie("bannerAccepted");

  if (isBannerAccepted) {
    document.getElementById("banner").style.display = "none";
  } else {
    deleteAllCookies();
    document.getElementById("banner").style.display = "block";
    document.getElementById("banner-accept").onclick = function () {
      // One week in ms
      const expireDuration = 115000;// 6.048e+8;
      setCookie("bannerAccepted", true, expireDuration);
      document.getElementById("banner").style.display = "none";
    };
    document.getElementById("banner-decline").onclick = function () {
      document.getElementById("banner").style.display = "none";
    }
  }
}

function setCookie(cookieName, cookieValue, expireDuration /* milliseconds */) {
  // Create expiration date
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + expireDuration);
  const expires = "expires=" + expiryDate.toUTCString();

  // Create a cookie with the same name
  const stringCookie = `${cookieName}=${cookieValue};${expires};path=/;`;
  console.log(stringCookie);

  // Set the cookie. This will overwrite the previous cookie with the same name
  document.cookie = stringCookie;
  console.log(document.cookie);
}

function getCookie(cookieName) {
  const name = cookieName.trim() + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i !== cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }

  return undefined;
}

function deleteAllCookies() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    deleteCookie(cookie.split('=')[0]);
  }
}

function deleteCookie(cookieName) {
  const pastDate = new Date(0).toUTCString();
  document.cookie = `${cookieName}=;expires=${pastDate};path=/;`;
}
