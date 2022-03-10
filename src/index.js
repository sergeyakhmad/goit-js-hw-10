import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchCountry.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  e.preventDefault();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  const searchField = e.target.value.trim();

  if (searchField === '') {
    Notiflix.Notify.failure('Please, enter country name! The field is empty!');
    return;
  }

  fetchCountries(searchField)
    .then(country => {
      if (country.length === 1) {
        countryMarkup(country);
        return;
      }
      if (country.length >= 2 && country.length <= 10) {
        severalCountriesMarkup(country);
        return;
      }
      Notiflix.Notify.warning('Too many matches found. Please enter a more specific name');
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function countryMarkup(country) {
  const markup = country
    .map(({ flags: { svg }, name: { official }, capital, population, languages }) => {
      return `<img src=${svg} width=50px alt=flag class="card-flag"><p class="country">${official}</p>
            <p class="card"><span class="card-value">Capital: </span>${capital}</p>
            <p class="card"><span class="card-value">Population: </span>${population}</p>
            <p class="card"><span class="card-value">Languages: </span>${Object.values(
              languages,
            )}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function severalCountriesMarkup(country) {
  const markup = country
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="list"><img src=${svg} width=50px alt=${official} class="img">${official}</li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
