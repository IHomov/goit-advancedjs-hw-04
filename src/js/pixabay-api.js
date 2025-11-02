import axios from 'axios';
// js/pixabay-api.js
axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '52985657-6fa5448d905561c90358ed2ab';

let currentPage = 1;
const perPage = 15;
let currentQuery = '';

export async function fetchImages(query) {
  if (query !== currentQuery) {
    currentQuery = query;
    currentPage = 1;
  }

  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: perPage,
  };

  try {
    const response = await axios.get('/', { params });
    currentPage += 1;
    return response.data;
  } catch (error) {
    console.log('❌ Помилка запиту до Pixabay API:', error);
    throw error;
  }
}

export function resetPage() {
  currentPage = 1;
}
