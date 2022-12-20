import { PixabayApi } from './js/fetch';
import { refs } from './js/refs';
import { createElements } from './js/createElements';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new PixabayApi();

const options = {
  threshold: 1.0,
};

let counter = 0;

function photoLink () {
  const target = document.querySelector('.photo-link:last-child');
  observer.observe(target);
}

const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pixabay.incrementPage();
      observer.unobserve(entry.target);

      try {
        const { hits } = await pixabay.getPhotos();
        counter += hits.length;
        const markup = createElements(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        if (pixabay.isShowLoadMore) {
          console.log(pixabay.isShowLoadMore);
         // const target = document.querySelector('.photo-link:last-child');
          //observer.observe(target);
          photoLink ();
        }

        if (counter + 40 >= hits) {
          Notify.failure('Stop!');
        }

        //if (counter + 40 >= totalHits) {
         // Notify.failure('Stop!');
       // }

        lightbox.refresh();
        scrollPage();
      } catch (error) {
        Notify.failure(error.message);
        clearPage();
      }
    }
  });
};

const observer = new IntersectionObserver(callback, options);

async function searchPhotos(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

  if (!searchQuery) {
    Notify.failure('Enter data to search, please!');
    return;
  }
  counter = 0;
  pixabay.query = searchQuery;
  clearPage();

  try {
    //const { hits, total, totalHits } = await pixabay.getPhotos();
    const { hits, total } = await pixabay.getPhotos();
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createElements(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    //const target = document.querySelector('.photo-link:last-child');
    //console.log(target);
    //observer.observe(target);
    photoLink ();

    //pixabay.calculateTotalPages(totalHits);
    pixabay.calculateTotalPages(hits);

    Notify.success(`Hooray! We found ${total} images.`);
    lightbox.refresh();

    if (pixabay.isShowLoadMore) {
      // refs.loadMoreBtn.classList.remove('is-hidden');
      //const target = document.querySelector('.photo-link:last-child');
      //observer.observe(target);
      photoLink ();
    }
    scrollPage();
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }
}
const onLoadMore = async () => {
  pixabay.incrementPage();
  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  try {
    const { hits } = await pixabay.getPhotos();
    const markup = createElements(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    scrollPage();
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }
};

refs.form.addEventListener('submit', searchPhotos);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('.is-hidden');
}

const lightbox = new SimpleLightbox('.gallery a');

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
