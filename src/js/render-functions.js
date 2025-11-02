export function renderGallery(images) {
  const gallery = document.querySelector('.js-gallery');

  if (!gallery) {
    console.error('Gallery element .js-gallery not found.');
    return;
  }
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-card">
          <a href="${largeImageURL}">
            <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <ul class="info">
            <li><b>Likes:</b> ${likes}</li>
            <li><b>Views:</b> ${views}</li>
            <li><b>Comments:</b> ${comments}</li>
            <li><b>Downloads:</b> ${downloads}</li>
          </ul>
        </li>
      `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

export function clearGallery() {
  document.querySelector('.js-gallery').innerHTML = '';
}
