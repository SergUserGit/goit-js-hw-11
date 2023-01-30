import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

let lightbox = new SimpleLightbox('.gallery a');

const elemForm = document.querySelector('.search-form');
const elemInput = document.querySelector('input[name="searchQuery"]');

const elemGallery = document.querySelector('.gallery');

const elemLoadContainer = document.querySelector('.load-container');

const elemLoadMore = document.querySelector('.load-more');
elemLoadMore.addEventListener('click', onLoadMoreButtonClick);

let pageNumber = 0;
let countOfImages = 0;
const pictureCount = 40;

elemForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  pageNumber = 1;
  countOfImages = 0;

  elemLoadContainer.style.display = 'none';

  elemGallery.innerHTML = '';

  const inputValue = elemInput.value;

  const url =
    'https://pixabay.com/api/?key=33160634-a3b69315a0080f1036a2567f6&q=' +
    inputValue +
    '&image_type=photo&orientation=horizontal&safesearch=true&page=' +
    pageNumber +
    '&per_page=' +
    pictureCount;

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
        elemLoadContainer.style.display = 'flex';
        const totalHits = date.data.totalHits;
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        const arrayLength = date.data.hits;

        //  console.log(totalHits);
        //   console.log(date.data.hits.length);

        countOfImages += date.data.hits.length;

        const arrayElement = arrayLength.map(elem => {
          const newElem = getMurkup(elem);
          return newElem;
        });

        const newMurkup = arrayElement.join('');

        elemGallery.insertAdjacentHTML('afterbegin', newMurkup);

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 4,
          behavior: 'smooth',
        });

        lightbox.refresh();

        if (totalHits - countOfImages <= 0) {
          elemLoadContainer.style.display = 'none';
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    })
    .catch();
}

function onLoadMoreButtonClick() {
  pageNumber += 1;

  const inputValue = elemInput.value;

  const url =
    'https://pixabay.com/api/?key=33160634-a3b69315a0080f1036a2567f6&q=' +
    inputValue +
    '&image_type=photo&orientation=horizontal&safesearch=true&page=' +
    pageNumber +
    '&per_page=' +
    pictureCount;

  const dateUrl = axios.get(url).then(response => {
    return response;
  });

  dateUrl
    .then(date => {
      const arrayLength = date.data.hits.length;
      if (arrayLength === 0) {
        //   elemLoadContainer.style.display = 'none';
        //    Notiflix.Notify.info(
        //      "We're sorry, but you've reached the end of search results."
        //    );
        //  Notiflix.Notify.failure(
        //    'Sorry, there are no images matching your search query. Please try again.'
        //  );
      } else {
        const totalHits = date.data.totalHits;
        //  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        const arrayLength = date.data.hits;

        //   console.log(totalHits);
        //   console.log(date.data.hits.length);

        countOfImages += date.data.hits.length;

        const arrayElement = arrayLength.map(elem => {
          const newElem = getMurkup(elem);
          return newElem;
        });

        const newMurkup = arrayElement.join('');

        elemGallery.insertAdjacentHTML('beforeend', newMurkup);

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 4,
          behavior: 'smooth',
        });

        lightbox.refresh();

        if (totalHits - countOfImages <= 0) {
          elemLoadContainer.style.display = 'none';
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    })
    .catch();
}

function getMurkup(elem) {
  const {
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
    largeImageURL,
  } = elem;

  const str =
    '<div class="photo-card">' +
    '<a href="' +
    largeImageURL +
    '">' +
    '<img width="400" height="300" src="' +
    webformatURL +
    '" alt="' +
    tags +
    '" loading="lazy">' +
    '</a>' +
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
