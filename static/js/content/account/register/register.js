window.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (!registerForm) {
    console.error("form with id register-form not found");
    return;
  }

  registerForm.onsubmit = function () {
    const registerForm = document.getElementById("register-form");

    const formIn = {
      passwordAgainIn: registerForm.getElementById("in-password-again"),
      sightIssueIn: registerForm.getElementById("in-sight-issue"),
      firstNameIn: registerForm.getElementById("in-first-name"),
      lastNameIn: registerForm.getElementById("in-last-name"),
      usernameIn: registerForm.getElementById("in-username"),
      passwordIn: registerForm.getElementById("in-password"),
      emailIn: registerForm.getElementById("in-email"),
      colorIn: registerForm.getElementById("in-color"),
      photoIn: registerForm.getElementById("in-photo"),
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
