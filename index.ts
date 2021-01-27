let sortedBy: Props | null = null
main()

async function main() {
  const countries = await api()

  renderCountries(countries)

  const headers = document.querySelectorAll('th')

  for (const head of headers) {
    head.addEventListener('click', (event) => {
      sortBy(event, countries)
      renderCountries(countries)
    })
  }
}

async function api(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.eu/rest/v2/all')
    const data = await response.json()
    return data.map((e: any) => ({
      name: e.name,
      capital: e.capital,
      region: e.region,
      population: e.population,
      currency: e.currencies[0].code,
    }))
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

function renderCountries(countries: Country[]) {
  const tableBody = document.querySelector('#tb')!

  tableBody.innerHTML = ''

  for (const country of countries) {
    const { name, region, capital, population, currency } = country

    const nameCell = createCell(name)
    const capitalCell = createCell(capital)
    const regionCell = createCell(region)
    const populationCell = createCell(String(population))
    const currencyCell = createCell(currency)

    const row = document.createElement('tr')
    row.appendChild(nameCell)
    row.appendChild(capitalCell)
    row.appendChild(regionCell)
    row.appendChild(populationCell)
    row.appendChild(currencyCell)

    tableBody.appendChild(row)
  }
}

function createCell(name: string) {
  const cell = document.createElement('td')
  const text = document.createTextNode(name)
  cell.appendChild(text)
  return cell
}

function sortBy(event: Event | undefined, countries: Country[]) {
  if (!event || !event.target) return

  const prop: Props = event.target.innerText.toLowerCase()

  countries.sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1
    }
    if (a[prop] > b[prop]) {
      return 1
    }
    return 0
  })

  if (sortedBy === prop) {
    countries.reverse()
    sortedBy = null
  } else {
    sortedBy = prop
  }
}

interface Country {
  name: string
  region: string
  capital: string
  population: number
  currency: string
}

type Props = 'name' | 'region' | 'capital' | 'population' | 'currency'
