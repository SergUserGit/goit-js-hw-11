import axios from 'axios';

import Notiflix from 'notiflix';

// one by one
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Block } from 'notiflix/build/notiflix-block-aio';

Notiflix.Notify.init({
  width: '280px',
  position: 'right-top',
  // distance: '70px',
  opacity: 1,
});

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

  const dateUrl = axios.get(url).then(response => {
    return response;
  });

  dateUrl
    .then(date => {
      const arrayLength = date.data.hits.length;
      if (arrayLength === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        const totalHits = date.data.totalHits;
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    })
    .catch();
}
