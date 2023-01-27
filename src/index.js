import axios from 'axios';

const elemForm = document.querySelector('.search-form');
const elemInput = document.querySelector('input[name="searchQuery"]');

elemForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  const inputValue = elemInput.value;

  const url =
    'https://pixabay.com/api/?key=33160634-a3b69315a0080f1036a2567f6&q=' +
    inputValue +
    '&image_type=photo&orientation=horizontal&safesearch=true';

  const response = axios.get(url);
}
