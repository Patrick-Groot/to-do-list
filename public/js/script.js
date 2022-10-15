import './registerServiceWorker';

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
      expandButton.innerHTML = 'hide done &uarr;';
      doneList.style.backgroundColor = 'rgb(225, 255, 228)';
    } else {
      expandButton.innerHTML = 'show done &darr;';
      doneList.style.backgroundColor = 'transparent';
    }
  });
}
