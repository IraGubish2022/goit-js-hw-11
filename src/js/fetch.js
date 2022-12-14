import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
// axios.defaults.headers.common['Authorization'] =
//   '32003539-849ebfc75c29bb32e3b9621c3';

export class PixabayApi {
  #page = 1;
  #query = '';
  #allTotalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };

  async getPhotos() {
    const url = `/?key=32003539-849ebfc75c29bb32e3b9621c3&q=${
      this.#query
    }&page=${this.#page}`;
    try {
      const { data } = await axios.get(url, this.#params);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
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