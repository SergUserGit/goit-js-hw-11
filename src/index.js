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

const elemGallery = document.querySelector('.gallery');

elemForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  elemGallery.innerHTML = '';

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

        const arrayLength = date.data.hits;

        const arrayElement = arrayLength.map(elem => {
          const newElem = getMurkup(elem);
          return newElem;
        });

        const newMurkup = arrayElement.join('');

        elemGallery.insertAdjacentHTML('afterbegin', newMurkup);
      }
    })
    .catch();
}

function getMurkup(elem) {
  const { webformatURL, tags, likes, views, comments, downloads } = elem;

  const str =
    '<div class="photo-card">' +
    '<img width="400" height="300" src="' +
    webformatURL +
    '" alt="' +
    tags +
    '" loading="lazy">' +
    '<div class="info">' +
    '<p class="info-item">' +
    '<b class="info-title">Likes</b>' +
    '<span>' +
    likes +
    '</span>' +
    '</p>' +
    '<p class="info-item">' +
    '<b class="info-title">Views</b>' +
    '<span>' +
    views +
    '</span>' +
    '</p>' +
    '<p class="info-item">' +
    '<b class="info-title">Comments</b>' +
    '<span>' +
    comments +
    '</span>' +
    '</p>' +
    '<p class="info-item">' +
    '<b class="info-title">Downloads</b>' +
    '<span>' +
    downloads +
    '</span>' +
    '</p>' +
    '</div>' +
    '</div>';
  return str;
}
