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
      onMovieClick(movie, document.querySelector('#left-summary'), 'left')
    }
  })

  createSearchBar({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect (movie){
      document.querySelector('.tutorial').classList.add('is-hidden')
      onMovieClick(movie, document.querySelector('#right-summary'), 'right')
    }
  })


let leftMovie;
let rightMovie;

const onMovieClick = async (request, summaryRequest, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'a264e056',
      i: request.imdbID, 
    }
  })

  summaryRequest.innerHTML = movieTemplate(response.data)

  if (side === 'left'){
    leftMovie = response.data
  }else{
    rightMovie = response.data
  }

  if(leftMovie && rightMovie){
    runComparison()
  }

}

const runComparison = () => {
  const leftSideStat = document.querySelectorAll('#left-summary .notification')
  const rightSideStat = document.querySelectorAll('#right-summary .notification')

  leftSideStat.forEach((leftStat, index) => {
    const rightStat = rightSideStat[index]

    const leftSideValue = leftStat.dataset.value  
    const rightSideValue = rightStat.dataset.value

    if(rightSideValue > leftSideValue){
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    }else{
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })

}

const movieTemplate = (movieDetail) => {

  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const meta = parseInt(movieDetail.Metascore)
  const imdb = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word)

    if(isNaN(value)){
      return prev
    }else{
      return prev + value
    }
  }, 0);

  console.log(awards)

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
  <article data-value=${awards} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Boxoffice</p>
  </article>
  <article data-value=${meta} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdb} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">Imdb Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">Imdb Votes</p>
  </article>
  `
}