 const fetchData = async request => {
  const reply = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'a264e056',
      s: request
    }
  })

  if (reply.data.Error) {
    return []
  }

  return reply.data.Search
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.querySelector('.searchBar')

  searchBar.innerHTML = `
      <label><b>Search for your movie below</b></label>

      <input type="text" />

      <div class="dropdown">
      <div class="dropdown-menu"> 
        <div class="dropdown-content searchResults"></div>
      </div>
    </div>
  `


  const input = document.querySelector('input')
  const searchResult = document.querySelector('.searchResults')
  const dropdown = document.querySelector('.dropdown')

  const onInput = async event => {
    const movies = await fetchData(event.target.value)
    console.log(movies)

    if (!movies.length) {
      dropdown.classList.remove('is-active')
      return
    }
    searchResult.innerHTML = '' // Clear previous content

    dropdown.classList.add('is-active')
    for (let movie of movies) {
      const options = document.createElement('a')

      options.innerHTML = `
              <img src="${movie.Poster}">
              ${movie.Title}
            `

      options.addEventListener('click', () => {
        dropdown.classList.remove('is-active')
        input.value = movie.Title
        onMovieClick(movie)
      })

      searchResult.append(options)
    }
  }

  input.addEventListener('input', debounce(onInput, 500))

  document.addEventListener('click', event => {
    if (!searchBar.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
    input.in
  })
})

const onMovieClick = async request => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'a264e056',
      i: request.imdbID
    }
  })

  console.log(response.data)
document.querySelector("#summary").innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) => {
  return `
  <article class="media">
    <figure class="media-left">
    <p class="image">
    <img src="${movieDetail.Poster}"/>
    <p>
    </figure>
    <div class="media-content">
    <h1>${movieDetail.Title}<h1>
    <h4>${movieDetail.Genre}<h4>
    <p>${movieDetail.Plot}</p>
    </div>
  </article>
  <article class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
  <p class="title">${movieDetail.Boxoffice}</p>
  <p class="subtitle">Boxoffice</p>
  </article>
  <article class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">Imdb Rating</p>
  </article>
  <article class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">Imdb Votes</p>
  </article>
  `
}