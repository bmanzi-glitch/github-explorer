/**
 * Country Intelligence Dashboard
 * API: REST Countries — https://restcountries.com
 * No API key required.
 */

// DOM references
const searchInput  = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const sortSelect   = document.getElementById('sortSelect');
const cardsGrid    = document.getElementById('cardsGrid');
const loader       = document.getElementById('loader');
const errorMsg     = document.getElementById('errorMsg');
const noResults    = document.getElementById('noResults');
const modal        = document.getElementById('modal');
const modalBody    = document.getElementById('modalBody');
const closeModal   = document.getElementById('closeModal');
const countryCount = document.getElementById('countryCount');
const totalPopEl   = document.getElementById('totalPop');

// App state
let allCountries = [];

// Fetch all countries from API
async function fetchCountries() {
  showLoader(true);
  hideError();

  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,population,region,subregion,capital,area,languages,currencies,tld'
    );

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    allCountries = await res.json();
    applyFilters();

  } catch (err) {
    showError(
      err.message.includes('Failed to fetch')
        ? 'Could not reach the API. Please check your internet connection.'
        : `Something went wrong: ${err.message}`
    );
  } finally {
    showLoader(false);
  }
}

// Render country cards
function renderCards(countries) {
  cardsGrid.innerHTML = '';
  noResults.classList.add('hidden');

  if (countries.length === 0) {
    noResults.classList.remove('hidden');
    updateStats(0, 0);
    return;
  }

  const totalPop = countries.reduce((sum, c) => sum + (c.population || 0), 0);
  updateStats(countries.length, totalPop);

  countries.forEach(country => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${country.flags?.svg || country.flags?.png || ''}"
           alt="Flag of ${country.name.common}"
           loading="lazy" />
      <div class="card-body">
        <h3>${country.name.common}</h3>
        <p>📍 ${country.region || 'N/A'}${country.subregion ? ' · ' + country.subregion : ''}</p>
        <p>👥 ${formatNumber(country.population)}</p>
        <p>🏙️ ${country.capital?.[0] || 'N/A'}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(country));
    cardsGrid.appendChild(card);
  });
}

// Open detail modal
function openModal(c) {
  const languages  = c.languages  ? Object.values(c.languages).join(', ') : 'N/A';
  const currencies = c.currencies
    ? Object.values(c.currencies).map(cur => `${cur.name} (${cur.symbol || '?'})`).join(', ')
    : 'N/A';

  modalBody.innerHTML = `
    <img src="${c.flags?.svg || c.flags?.png || ''}" alt="Flag of ${c.name.common}" />
    <h2>${c.name.common}</h2>
    <p><strong>Official Name:</strong> ${c.name.official}</p>
    <p><strong>Region:</strong> ${c.region || 'N/A'}</p>
    <p><strong>Subregion:</strong> ${c.subregion || 'N/A'}</p>
    <p><strong>Capital:</strong> ${c.capital?.[0] || 'N/A'}</p>
    <p><strong>Population:</strong> ${formatNumber(c.population)}</p>
    <p><strong>Area:</strong> ${c.area ? formatNumber(c.area) + ' km²' : 'N/A'}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    <p><strong>Currencies:</strong> ${currencies}</p>
    <p><strong>Domain:</strong> ${c.tld?.join(', ') || 'N/A'}</p>
  `;
  modal.classList.remove('hidden');
}

// Close modal
closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

// Apply search, filter, and sort together
function applyFilters() {
  const query  = searchInput.value.trim().toLowerCase();
  const region = regionFilter.value;
  const sort   = sortSelect.value;

  let results = [...allCountries];

  if (query) {
    results = results.filter(c =>
      c.name.common.toLowerCase().includes(query) ||
      (c.capital?.[0] || '').toLowerCase().includes(query)
    );
  }

  if (region) {
    results = results.filter(c => c.region === region);
  }

  if (sort === 'name') {
    results.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } else if (sort === 'population-desc') {
    results.sort((a, b) => b.population - a.population);
  } else if (sort === 'population-asc') {
    results.sort((a, b) => a.population - b.population);
  } else if (sort === 'area-desc') {
    results.sort((a, b) => (b.area || 0) - (a.area || 0));
  }

  renderCards(results);
}

// Event listeners
searchInput.addEventListener('input', applyFilters);
regionFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

// Helper functions
function formatNumber(n) {
  if (!n && n !== 0) return 'N/A';
  return n.toLocaleString();
}
function showLoader(show) { loader.classList.toggle('hidden', !show); }
function showError(msg)   { errorMsg.textContent = msg; errorMsg.classList.remove('hidden'); }
function hideError()      { errorMsg.classList.add('hidden'); }
function updateStats(count, pop) {
  countryCount.textContent = count;
  totalPopEl.textContent   = formatNumber(pop);
}

// Start the app
fetchCountries();
