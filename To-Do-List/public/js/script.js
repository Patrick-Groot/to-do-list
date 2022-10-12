document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('To-Do-List JS imported successfully!');
  },
  false
);

const editButton = document.getElementById('editItem');
const editForm = document.getElementById('editForm');
editButton.addEventListener('onClick', () => {
  editForm.classList.toggle('hidden');
});
