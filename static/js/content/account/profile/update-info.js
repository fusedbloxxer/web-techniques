window.addEventListener('DOMContentLoaded', function() {
  const updateProfileForm = document.getElementById("update-profile-form");
  console.log('ok')
  if (!updateProfileForm) {
    console.error("form with id update-profile-form not found");
    return;
  }

  updateProfileForm.onsubmit = async function () {
    const formIn = {
      sightIssueIn: document.getElementById("in-sight-issue"),
      firstNameIn: document.getElementById("in-first-name"),
      lastNameIn: document.getElementById("in-last-name"),
      usernameIn: document.getElementById("in-username"),
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

    // Get password
    const password = prompt('Enter your password: ', '');

    // Validate password
    fetch('/account/validate-password', {
			headers: {
        'Content-Type': 'application/json'
      },
			method: "POST",
			mode: 'cors',
			cache: 'default',
			body: JSON.stringify({
        password: password,
			})
    }).then(function(res) {
      console.log(res);
      formIn.submit();
      return true;
    }).catch(function(err) {
      console.error(err);
      return false;
    });

    return false;
  };
});