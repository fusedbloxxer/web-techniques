window.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (!registerForm) {
    console.error("form with id register-form not found");
    return;
  }

  registerForm.onsubmit = function () {
    const formIn = {
      passwordAgainIn: document.getElementById("in-password-again"),
      sightIssueIn: document.getElementById("in-sight-issue"),
      firstNameIn: document.getElementById("in-first-name"),
      lastNameIn: document.getElementById("in-last-name"),
      usernameIn: document.getElementById("in-username"),
      passwordIn: document.getElementById("in-password"),
      emailIn: document.getElementById("in-email"),
      colorIn: document.getElementById("in-color"),
      photoIn: document.getElementById("in-photo"),
    };

    // Assert all input fields exist
    for (const key in formIn) {
      if (!formIn[key]) {
        alert(`The ${key} input field is missing!`);
        return false;
      }
    }

    if (formIn.passwordIn.value !== formIn.passwordAgainIn.value) {
      alert(`The passwords don't match!`);
      return false;
    }

    return true;
  };
});
