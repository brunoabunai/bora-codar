// https://developer.themoviedb.org/reference/movie-popular-list
const getMovies = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2QzZThkZWMyZWY5MzIxZmQwNTc1Mjc4ZDk1MGNiYiIsInN1YiI6IjY0Y2VlZjQ1MzAzYzg1MDBlMzM4YTA2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lIn8dPkdHyTeHWi7fH_mPpwb3o1631FXbmdZ7F_BE",
    },
  }

  try {
    return fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    ).then((response) => response.json())
  } catch (error) {
    console.log(error)
  }
}

// Puxar informações extras do filme
// https://api.themoviedb.org/3/movie/{movide_id}
const getMoreInfo = async (id) => {
  // const result = await fetch()
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2QzZThkZWMyZWY5MzIxZmQwNTc1Mjc4ZDk1MGNiYiIsInN1YiI6IjY0Y2VlZjQ1MzAzYzg1MDBlMzM4YTA2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lIn8dPkdHyTeHWi7fH_mPpwb3o1631FXbmdZ7F_BE",
    },
  }

  try {
    return fetch(
      "https://api.themoviedb.org/3/movie/" + id + "?language=en-US",
      options
    ).then((response) => response.json())
  } catch (error) {
    console.log(error)
  }
}

// Quando clicar no botão de assistir trailer
// https://api.themoviedb.org/3/movie/{movie_id}/videos

const watch = async (movie) => {
  // target pega 1 parte especifica (onde estou clicando)
  //currentTarget pega qualquer área do botão (quem está desparando)
  const movieId = movie.currentTarget.dataset.id
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2QzZThkZWMyZWY5MzIxZmQwNTc1Mjc4ZDk1MGNiYiIsInN1YiI6IjY0Y2VlZjQ1MzAzYzg1MDBlMzM4YTA2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lIn8dPkdHyTeHWi7fH_mPpwb3o1631FXbmdZ7F_BE",
    },
  }

  try {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "/videos?language=en-US",
      options
    ).then((response) => response.json())

    const { results } = data

    const youtubeVideo = results.find((video) => video.type === "Trailer")

    window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, "blank")
  } catch (error) {
    console.log(error)
  }
}

const createMovieLayout = ({ id, title, stars, image, time, year }) => {
  return `
    <div class="movie">
      <div class="title">
        <span>${title}</span>

        <div>
          <img src="public/icons/star.svg" alt="star icon" />

          <p>${stars}</p>
        </div>
      </div>

      <div class="poster">
        <img src="https://image.tmdb.org/t/p/w500/${image}" alt="Imagem de ${title}" />
      </div>

      <div class="info">
        <div class="duration">
          <img src="public/icons/clock.svg" alt="clock icon" />

          <span>${time}</span>
        </div>

        <div class="year">
          <img
            src="public/icons/calendar-blank.svg"
            alt="calendar-blank icon"
          />

          <span>${year}</span>
        </div>
      </div>

      <button onclick="watch(event)" data-id="${id}">
        <img src="public/icons/play.svg" alt="play icon" />

        <span>Assistir trailer</span>
      </button>
    </div>
  `
}

const select3Videos = (results) => {
  const random = () => Math.floor(Math.random() * results.length)

  let selectedVideos = new Set() //Armazena apenas 1 valor de cada
  while (selectedVideos.size < 3) {
    selectedVideos.add(results[random()].id)
  }

  return [...selectedVideos]
}

const minutesToHourMinutesAndSeconds = (minutes) => {
  const date = new Date(null)
  date.setMinutes(minutes)
  return date.toISOString().slice(11, 19)
}

const start = async () => {
  // Pegar sugestão de filme da API
  const { results } = await getMovies()
  //Pegar randomicamente 3 filme para sugestão
  const random3 = select3Videos(results).map(async (movie) => {
    // Pegar informações extras dos 3 filmes
    const info = await getMoreInfo(movie)

    // Organizar os dados para...
    const props = {
      id: info.id,
      title: info.title,
      stars: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      time: minutesToHourMinutesAndSeconds(info.runtime),
      year: info.release_date.slice(0, 4),
    }

    return createMovieLayout(props)
  })

  const output = await Promise.all(random3)

  // Substituir o conteúdo dos movies no html
  document.querySelector(".movies").innerHTML = output.join("")
}

start()
