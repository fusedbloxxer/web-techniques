window.addEventListener("DOMContentLoaded", function () {
  checkCookie();
});

function checkCookie() {
  // let acc_cookie = getCookie("acceptat_banner");
  // if (acc_cookie) {
  //   //sirul vid e evaluat la fals intr-o expresie booleana
  //   document.getElementById("banner").style.display = "none";
  // } else {
  //   document.getElementById("banner").style.display = "block";
  //   document.getElementById("ok_cookies").onclick = function () {
  //     setCookie("acceptat_banner", true, 5000);
  //     //setCookie("test", "ceva", 5000);
  //     document.getElementById("banner").style.display = "none";
  //   };
  // }

  console.log("check the baaaaneeeeer");
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
