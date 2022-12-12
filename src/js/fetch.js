import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
// axios.defaults.headers.common['Authorization'] =
//   '32003539-849ebfc75c29bb32e3b9621c3';

export class PixabayApi {
  #page = 1;
  #query = '';
  #allTotalPages = 0;
  #perPage = 30;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 30,
    },
  };

  async getPhotos() {
    const url = `/?key=32003539-849ebfc75c29bb32e3b9621c3=${
      this.#query
    }&page=${this.#page}`;
    const { data } = await axios.get(url, this.#params);
    return data;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calculateTotalPages(total) {
    this.#allTotalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#allTotalPages;
  }
}