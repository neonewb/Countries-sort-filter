"use strict";
main();
const headers = document.querySelectorAll('th');
async function main() {
    const countries = await api();
    renderCountries(countries);
    for (const head of headers) {
        head.addEventListener('click', (event) => {
            sortBy(event, countries);
            renderCountries(countries);
        });
    }
}
async function api() {
    try {
        const response = await fetch('https://restcountries.eu/rest/v2/all');
        const data = await response.json();
        return data.map((e) => ({
            name: e.name,
            capital: e.capital,
            region: e.region,
            population: e.population,
            currency: e.currencies[0].code,
        }));
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
}
function renderCountries(countries) {
    const tableBody = document.querySelector('#tb');
    tableBody.innerHTML = '';
    for (const country of countries) {
        const { name, region, capital, population, currency } = country;
        const nameCell = createCell(name);
        const capitalCell = createCell(capital);
        const regionCell = createCell(region);
        const populationCell = createCell(String(population));
        const currencyCell = createCell(currency);
        const row = document.createElement('tr');
        row.appendChild(nameCell);
        row.appendChild(capitalCell);
        row.appendChild(regionCell);
        row.appendChild(populationCell);
        row.appendChild(currencyCell);
        tableBody.appendChild(row);
    }
}
function createCell(name) {
    const cell = document.createElement('td');
    const text = document.createTextNode(name);
    cell.appendChild(text);
    return cell;
}
function sortBy(event, countries) {
    if (!event || !event.target)
        return;
    const prop = event.target.innerText.toLowerCase();
    countries.sort((a, b) => {
        if (a[prop] < b[prop]) {
            return -1;
        }
        if (a[prop] > b[prop]) {
            return 1;
        }
        return 0;
    });
    const asc = event.target.classList.contains('th_sort_asc');
    if (asc) {
        countries.reverse();
    }
    headers.forEach((h) => h.classList.remove('th_sort_asc', 'th_sort_desc'));
    event.target.classList.toggle('th_sort_asc', !asc);
    event.target.classList.toggle('th_sort_desc', asc);
}
