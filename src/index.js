const elemForm = document.querySelector('.search-form');
const elemInput = document.querySelector('input[name="searchQuery"]');

elemForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  //alert(typeof elemInput.value);
}
