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
const PICTURE_COUNT = 40;

elemForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  onSubmitInitialization();
  processData(handlerDateOnSubmit);
}

function onLoadMoreButtonClick() {
  onLoadMoreInitialization();
  processData(handlerDateLoadMore);
}

function getMarkup(elem) {
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

async function getResponse(pageNumber) {
  const inputValue = elemInput.value;
  const url =
    'https://pixabay.com/api/?key=33160634-a3b69315a0080f1036a2567f6&q=' +
    inputValue +
    '&image_type=photo&orientation=horizontal&safesearch=true&page=' +
    pageNumber +
    '&per_page=' +
    PICTURE_COUNT;
  const responseOfServer = await axios.get(url);
  return responseOfServer;
}

function smoothScrolling() {
  const { height: cardHeight } =
    elemGallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 4,
    behavior: 'smooth',
  });
}

function setVisibleButton(displayValue) {
  elemLoadContainer.style.display = displayValue;
}

function displayInfoMessage(textMessage) {
  Notiflix.Notify.info(textMessage);
}

function displayErrorMessage(textMessage) {
  Notiflix.Notify.failure(textMessage);
}

function displaySuccessMessage(textMessage) {
  Notiflix.Notify.success(textMessage);
}

function stopLoadingImages(totalHits, countOfImages) {
  if (totalHits - countOfImages <= 0) {
    setVisibleButton('none');
    displayInfoMessage(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function renderingMarkupOfCards(insertPosition, Markup) {
  elemGallery.insertAdjacentHTML(insertPosition, Markup);
}

function getObjectArrayImageElement(objectDate) {
  return {
    totalHits: objectDate.totalHits,
    arrayImages: objectDate.hits,
    arrayCount: objectDate.hits.length,
  };
}

function getMarkupGallery(arrayImages) {
  const arrayElement = arrayImages.map(elem => {
    const newElem = getMarkup(elem);
    return newElem;
  });

  const newMarkup = arrayElement.join('');
  return newMarkup;
}

function displayImages(parametrObjects) {
  const { arrayCount, arrayImages, totalHits, insertPosition } =
    parametrObjects;

  countOfImages += arrayCount;
  renderingMarkupOfCards(insertPosition, getMarkupGallery(arrayImages));
  smoothScrolling();
  lightbox.refresh();
  stopLoadingImages(totalHits, countOfImages);
}

function onSubmitInitialization() {
  countOfImages = 0;
  setVisibleButton('none');
  elemGallery.innerHTML = '';
  pageNumber = 1;
}

function onLoadMoreInitialization() {
  pageNumber += 1;
}

function handlerDateLoadMore(objectOfDate) {
  const { totalHits, arrayImages, arrayCount } = getObjectArrayImageElement(
    objectOfDate.data
  );
  displayImages({
    arrayCount,
    arrayImages,
    totalHits,
    insertPosition: 'beforeend',
  });
}

function handlerDateOnSubmit(objectOfDate) {
  const { totalHits, arrayImages, arrayCount } = getObjectArrayImageElement(
    objectOfDate.data
  );
  if (arrayCount === 0) {
    displayErrorMessage(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    setVisibleButton('flex');
    displaySuccessMessage(`Hooray! We found ${totalHits} images.`);
    displayImages({
      arrayCount,
      arrayImages,
      totalHits,
      insertPosition: 'afterbegin',
    });
  }
}

function processData(callBackFunction) {
  const response = getResponse(pageNumber);
  response.then(callBackFunction).catch();
}
