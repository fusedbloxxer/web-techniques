window.addEventListener("DOMContentLoaded", function () {
  checkBannerCookie();
});

function checkBannerCookie() {
  const isBannerAccepted = getCookie("bannerAccepted");

  if (isBannerAccepted) {
    document.getElementById("banner").style.display = "none";
  } else {
    document.getElementById("banner").style.display = "block";
    document.getElementById("banner-accept").onclick = function () {
      // One week in ms
      const expireDuration = 5000;// 6.048e+8;
      setCookie("bannerAccepted", true, expireDuration);
      document.getElementById("banner").style.display = "none";
    };
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
  const name = cookieName + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i !== cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }

  return undefined;
}

function deleteCookie(cookieName) {
  const pastDate = new Date(0).toUTCString();
  document.cookie = `${cookieName}=;expires=${pastDate};path=/;`;
}
