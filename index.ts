const headers = document.querySelectorAll('th')
const search = document.querySelector('input')

!(async () => {
  const countries = await api()

  renderCountries(countries)

  let countriesCopy: Country[] | undefined = countries.map((c) => ({ ...c }))

  for (const head of headers) {
    head.addEventListener('click', (event) => {
      sortBy(event, countriesCopy)
      renderCountries(countriesCopy)
    })
  }

  search!.addEventListener('input', (event) => {
    countriesCopy = searchBy(event, countries)
    sortWith(countriesCopy)
    renderCountries(countriesCopy)
  })
})()

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

function renderCountries(countries: Country[] | undefined) {
  if (!countries) return

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

function sortBy(event: Event, countries: Country[] | undefined) {
  if (!event || !event.target || !countries) return

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

  const asc = event.target.classList.contains('th_sort_asc')

  if (asc) {
    countries.reverse()
  }

  headers.forEach((h) => h.classList.remove('th_sort_asc', 'th_sort_desc'))

  event.target.classList.toggle('th_sort_asc', !asc)
  event.target.classList.toggle('th_sort_desc', asc)
}

function sortWith(countries: Country[] | undefined) {
  if (!countries) return

  let prop: Props
  let asc: boolean = false

  headers.forEach((h) => {
    if (h.classList.contains('th_sort_asc')) {
      prop = h.innerHTML.toLowerCase() as Props
      asc = false
    } else if (h.classList.contains('th_sort_desc')) {
      prop = h.innerHTML.toLowerCase() as Props
      asc = true
    } else {
      return
    }
  })

  countries.sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1
    }
    if (a[prop] > b[prop]) {
      return 1
    }
    return 0
  })

  if (asc) {
    countries.reverse()
  }
}

function searchBy(event: Event, countries: Country[]) {
  if (!event || !event.target) return

  const key: string = event.target.value.toLowerCase()

  return countries.filter((c) => {
    let i: Props
    for (i in c) {
      if (String(c[i]).toLowerCase().includes(key)) return true
    }
  })
}

interface Country {
  name: string
  region: string
  capital: string
  population: number
  currency: string
}

type Props = keyof Country
