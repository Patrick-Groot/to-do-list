document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('To-Do-List JS imported successfully!');
  },
  false
);
const expandButton = document.getElementById('expandButton');
const doneList = document.getElementById('done');

if (expandButton) {
  expandButton.addEventListener('click', () => {
    const expandButtonAria = expandButton.getAttribute('aria-expanded');
    if (expandButtonAria == 'true') {
      expandButton.innerHTML = '&#160; &uarr; &#160;';
      doneList.style.backgroundColor = 'rgb(225, 255, 228)';
    } else {
      expandButton.innerHTML = 'Completed Tasks &darr;';
      doneList.style.backgroundColor = 'transparent';
    }
  });
}

const darkmode = document.getElementById('darkmode');

const body = document.getElementById("body");
const navbar = document.getElementById("navbar");

function switchDarkmode(User) {    
  if (User.settings.darkmode) {
    body.classList.replace("bg-light", "bg-dark").add("text-white");
    navbar.classList.add("navbar-dark");
    return next();
  }
  body.classList.replace("bg-dark", "bg-light").remove("text-white");
  navbar.classList.remove("navbar-dark");
  next();
};



/* if (darkmode) {
  darkmode.addEventListener('click', () => {
    const body = document.getElementById('body');
    const navbar = document.getElementById('navbar');
    if (body.classList.contains('bg-dark')) {
      body.classList.remove('text-light', 'bg-dark');
      body.classList.add('bg-light');
      navbar.classList.remove('navbar-dark');
    } else {
      body.classList.add('text-light', 'bg-dark');
      navbar.classList.add('navbar-dark');
    }
  });
} */
