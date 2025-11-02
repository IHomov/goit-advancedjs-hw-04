import { fetchImages, resetPage } from './js/pixabay-api.js';
import { renderGallery, clearGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.js-form'),
  gallery: document.querySelector('.js-gallery'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.querySelector('.js-load-more'),
};

let currentQuery = '';
const perPage = 15;

const lightbox = new SimpleLightbox('.js-gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function showLoader() {
  refs.loader.classList.remove('hidden');
}

function hideLoader() {
  refs.loader.classList.add('hidden');
}

function scrollGallery() {
  const galleryCards = refs.gallery.querySelectorAll('.gallery-card');
  if (galleryCards.length === 0) return;

  const lastCard = galleryCards[galleryCards.length - 1];
  const { height: cardHeight } = lastCard.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function onSearchFormSubmit(event) {
  event.preventDefault();

  const query = event.target.elements.user_query.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Oops!',
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  resetPage();
  currentQuery = query;
  refs.loadMoreBtn.classList.add('hidden');
  showLoader();

  try {
    const data = await fetchImages(query);

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
    lightbox.refresh();

    if (data.totalHits > perPage) {
      refs.loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  showLoader();
  try {
    const data = await fetchImages(currentQuery);

    if (data.hits.length === 0) {
      refs.loadMoreBtn.classList.add('hidden');
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
    lightbox.refresh();

    scrollGallery();

    if (data.hits.length < 15) {
      refs.loadMoreBtn.classList.add('hidden');
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
}
