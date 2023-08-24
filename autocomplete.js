const createSearchBar = ({ root, renderOptions, onOptionSelect, inputValue, fetchData }) => {
root.innerHTML = `
    <label><b>Search for your item below</b></label>

    <input type="text" />

    <div class="dropdown">
    <div class="dropdown-menu"> 
      <div class="dropdown-content searchResults"></div>
    </div>
  </div>
`


const input = root.querySelector('input')
const searchResult = root.querySelector('.searchResults')
const dropdown = root.querySelector('.dropdown')

const onInput = async event => {
  const items = await fetchData(event.target.value)
  console.log(items)

  if (!items.length) {
    dropdown.classList.remove('is-active')
    return
  }
  searchResult.innerHTML = '' // Clear previous content

  dropdown.classList.add('is-active')
  for (let item of items) {

    const options = document.createElement('a')

    options.classList.add('dropdown-item')
    options.innerHTML = renderOptions(item)
    options.addEventListener('click', () => {
      dropdown.classList.remove('is-active')
      input.value = inputValue(item)
      onOptionSelect(item)
    })

    console.log(options.value)

    searchResult.append(options)
  }
}

input.addEventListener('input', debounce(onInput, 500))

}

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
  })
