  const autocompleteConfig = {
    renderOptions(movie){

      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; 
  
      return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
      },
  
      inputValue(movie){
        return movie.Title
      },
  
      async  fetchData(request) {
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
  
  }
  
  createSearchBar({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect (movie){
      document.querySelector('.tutorial').classList.add('is-hidden')
      onMovieClick(movie, document.querySelector('#left-summary'))
    }
  })

  createSearchBar({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect (movie){
      document.querySelector('.tutorial').classList.add('is-hidden')
      onMovieClick(movie, document.querySelector('#right-summary'))
    }
  })


const onMovieClick = async (request, summaryRequest) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'a264e056',
      i: request.imdbID, 
    }
  })

  summaryRequest.innerHTML = movieTemplate(response.data)
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
  <p class="title">${movieDetail.BoxOffice}</p>
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