const body = document.querySelector('body');
const list = document.querySelector('.country-list');
const selectRegion = document.querySelector('.select-region');
const countrySearch = document.querySelector('.search-for-country');
const countries = [];
let filtered;

const showCountry = (country) => {
  const { flag, name, population, region, capital, alpha3Code } = country;
  const divCountry = document.createElement('div');
  divCountry.classList.add(
    'country',
    `country--${name.split(' ').join('-').toLowerCase()}`
  );
  divCountry.setAttribute('id', `${alpha3Code}`);

  const divFlag = document.createElement('div');
  divFlag.classList.add('country__flag-container');
  divFlag.innerHTML = `<img src='${flag}' class='country__flag'>`;

  const divDetails = document.createElement('div');
  divDetails.classList.add('country__details-container');

  const h2 = document.createElement('h2');
  h2.classList.add('country__heading');
  h2.innerText = `${name}`;

  const divContent = document.createElement('div');
  divContent.classList.add('country__content');
  divContent.innerHTML = `
 <p class='country__p country--population'><span class='country__span'>Population:</span> ${population}</p> 
 <p class='country__p country-region'><span class='country__span'>Region:</span> ${region}</p>
 <p class='country__p country-capital'><span class='country__span'>Capital:</span> ${capital}</p>
 `;

  list.appendChild(divCountry);

  divDetails.append(h2, divContent);
  divCountry.append(divFlag, divDetails);

  divCountry.addEventListener('click', () => showCountryDetails(country));
};

const renderList = (data) => {
  data.forEach((country) => {
    showCountry(country);
  });
};

const showRegion = (countries, region) => {
  filtered = countries.filter(
    (country) => country.region.toLowerCase() == region
  );
  list.innerHTML = '';
  renderList(filtered);
};

const searchForCountry = (e) => {
  const input = document.querySelector('.search-for-country__input');
  e.preventDefault();

  if (input.value === '') return;

  if (filtered == undefined) {
    const matchingCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(input.value.toLowerCase())
    );
    if (matchingCountries.length === 0) {
      input.value = '';
      console.log('ni ma');
      return;
    }

    list.innerHTML = '';
    renderList(matchingCountries);
  } else {
    const matchingCountries = filtered.filter((country) =>
      country.name.toLowerCase().includes(input.value.toLowerCase())
    );
    if (matchingCountries.length === 0) {
      input.value = '';
      console.log('ni ma');
      return;
    }

    list.innerHTML = '';
    renderList(matchingCountries);
  }

  input.value = '';
};

const showCountryDetails = (country) => {
  const {
    flag,
    name,
    population,
    region,
    subregion,
    capital,
    topLevelDomain,
    currencies,
    languages,
    borders,
  } = country;

  const currenciesArr = [];
  currencies.forEach((cur) => currenciesArr.push(cur.name));
  console.log(currenciesArr);

  const languagesArr = [];
  languages.forEach((lang) => languagesArr.push(lang.name));
  console.log(languagesArr);

  const btn = document.createElement('button');
  btn.innerHTML = 'Back';
  btn.classList.add('country-details__button');
  btn.addEventListener('click', () => body.removeChild(container));

  const flagContainer = document.createElement('div');
  flagContainer.classList.add('country-details__flag-container');
  flagContainer.innerHTML = `<img src='${flag}' class='country-details__flag-img'>`;

  const countryDetails = document.createElement('div');
  countryDetails.innerHTML = `
    <h2>${name}</h2>
    <p class='country-details__p'><span class='country-details__span'>Native Name:</span> ${name}</p>
    <p class='country-details__p'><span class='country-details__span'>Population:</span> ${population}</p>
    <p class='country-details__p'><span class='country-details__span'>Region:</span> ${region}</p>
    <p class='country-details__p'><span class='country-details__span'>Sub Region:</span> ${subregion}</p>
    <p class='country-details__p'><span class='country-details__span'>Capital:</span> ${capital}</p>
    <p class='country-details__p'><span class='country-details__span'>Top Level Domain:</span> ${topLevelDomain}</p>
    <p class='country-details__p'><span class='country-details__span'>Currencies:</span> ${currenciesArr.join(
      ', '
    )}</p>
    <p class='country-details__p country-details__p--languages'><span class='country-details__span'>Languages:</span> ${languagesArr.join(
      ', '
    )}</p>
  `;

  const borderCountries = document.createElement('div');
  borderCountries.innerHTML = `<h2>Border Countries:</h2>`;
  const borderCountriesButtons = (borders) => {
    borders.forEach((border) => {
      const btn = document.createElement('button');
      const name = countries.filter((country) => country.alpha3Code === border);
      btn.innerText = `${name[0].name}`;
      btn.addEventListener('click', () => showCountryDetails(name[0]));
      borderCountries.appendChild(btn);
      console.log(name);
    });
  };

  const container = document.createElement('div');
  container.classList.add('country-details');
  container.append(btn, flagContainer, countryDetails, borderCountries);

  body.appendChild(container);

  borderCountriesButtons(borders);
};

fetch('https://restcountries.eu/rest/v2/all')
  .then((response) => response.json())
  .then((data) => {
    countries.push(...data);
    renderList(countries);
  });

selectRegion.addEventListener('change', () =>
  showRegion(countries, selectRegion.value)
);

countrySearch.addEventListener('submit', searchForCountry);
