// Nice Scrolling
// eslint-disable-next-line no-unused-vars
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth',
  });
}

// Show or hide LogIn/SignUp popups
// eslint-disable-next-line no-unused-vars
function showModal(id, displayVal) {
  document.querySelector(`#${id}`).classList.toggle('is-active');
}

// Make password visible
let passwordVisible = false;
// eslint-disable-next-line no-unused-vars
function togglePWVisibility() {
  if (passwordVisible) {
    document.querySelector('#PWVisible').classList.remove('fa-eye');
    document.querySelector('#PWVisible').classList.add('fa-eye-slash');
    document.querySelector('#signUpPassword').type = 'password';
  } else {
    document.querySelector('#PWVisible').classList.add('fa-eye');
    document.querySelector('#PWVisible').classList.remove('fa-eye-slash');
    document.getElementById('signUpPassword').type = 'text';
  }
  passwordVisible = !passwordVisible;
}

// eslint-disable-next-line no-unused-vars
function checkUName(username) {
  axios.get('/login/usercheck', {
    params: {
      username,
    },
  }).then(() => {
    document.querySelector('#usernameTaken').classList.add('is-hidden');
  }).catch(() => {
    document.querySelector('#usernameTaken').classList.remove('is-hidden');
  });
}

function logIn(...args) {
  let [username, password] = args;
  if (!username) username = document.querySelector('#logInUsername').value;
  if (!password) password = document.querySelector('#logInPassword').value;

  axios.post('/login/', {
    username,
    password,
  }).then(() => {
    window.location.href = '/login/dashboard';
  }).catch(() => {
    document.querySelector('#logInPassword').classList.add('is-danger');
    document.querySelector('#badPassword').classList.remove('is-hidden');
  });
}

// eslint-disable-next-line no-unused-vars
function signUp() {
  const username = document.querySelector('#signUpUsername').value;
  const email = document.querySelector('#signUpEmail').value;
  const password = document.querySelector('#signUpPassword').value;
  // document.querySelector('#signUpError').classList.add('is-hidden');

  if (!username) {
    document.querySelector('#signUpError').innerHTML = 'You need a username.';
    document.querySelector('#signUpError').classList.remove('is-hidden');
    return;
  }
  if (!email) {
    document.querySelector('#signUpError')
      .innerHTML = 'You need to input a valid email.';
    document.querySelector('#signUpError').classList.remove('is-hidden');
    return;
  }
  if (!password) {
    document.querySelector('#signUpError')
      .innerHTML = 'As lazy as you are, your password must be more than 0 characters long.';
    document.querySelector('#signUpError').classList.remove('is-hidden');
    return;
  }

  axios.post('/login/signup/', {
    username,
    email,
    password,
  }).then(() => {
    logIn(username, password);
  }).catch(() => {
    alert('RIP');
  });

  return true;
}

// eslint-disable-next-line no-unused-vars
function betterPassword() {
  document.querySelector('#logInPassword').classList.remove('is-danger');
  document.querySelector('#badPassword').classList.add('is-hidden');
}

// eslint-disable-next-line no-unused-vars
function logInEnter(e) {
  if (e.keyCode === 13) {
    logIn();
  }
}

// eslint-disable-next-line no-unused-vars
function signUpEnter(e) {
  if (e.keyCode === 13) {
    signUp();
  }
}
