document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('To-Do-List JS imported successfully!');
  },
  false
);

const expandButton = document.getElementById('expandButton');
const saveChangesToItemButton = document.getElementsByClassName('save-changes-to-item')[0];

expandButton.addEventListener('click', () => {
  const expandButtonAria = expandButton.getAttribute('aria-expanded');
  if (expandButtonAria == 'true') {
    expandButton.innerHTML = 'hide done';
  } else {
    expandButton.innerHTML = 'show done';
  }
});

// console.log(expandButton);
