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
