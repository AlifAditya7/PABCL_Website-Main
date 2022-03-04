const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + APIKEY
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'
const SEARCH_URL = BASE_URL + '/search/movie?' + APIKEY

const main = document.getElementById('main')
const overlayContent = document.getElementById('overlay-content')
const form = document.getElementById('form')
const search = document.getElementById('search')
const prev = document.getElementById('prev')
const current = document.getElementById('current')
const next = document.getElementById('next')

let currentPage = 1
let nextPage = 2
let prevPage = 3
let lastUrl = ''
let totalPages = 100

getMovies(API_URL);

function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if (data.results.length !== 0) {
            showMovies(data.results)
            currentPage = data.page
            nextPage = currentPage + 1
            prevPage = currentPage - 1
            totalPages = data.total_pages

            current.innerText = currentPage

            if (currentPage <= 1) {
                prev.classList.add('disabled')
                next.classList.remove('disabled')

            } else if (currentPage >= totalPages) {
                prev.classList.remove('disabled')
                next.classList.add('disabled')
            } else {
                prev.classList.remove('disabled')
                next.classList.remove('disabled')
            }

            const nav__link = document.getElementById('nav__link')
            nav__link.scrollIntoView({
                behavior: "smooth"
            })
        } else {
            main.innerHTML = `<h1>No Result</h1>`
        }
    })
}
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id = movie.id
    fetch(BASE_URL + '/movie/' + id + 'movies?' + APIKEY).then(res => res.json()).then(movies => {
        console.log(movies)
        document.getElementById("myNav").style.width = "100%"
        overlayContent.innerHTML = `
        <h1>${movies.title}</h1>
            <img src="${IMAGE_URL + movies.poster_path}" alt="${movies.title}">
            <p class = "tagline">"${movies.tagline}"<p>
            <p>${movies.overview}</p>
            <p class = "release">${movies.release_date}</p>

        `


    })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}


function showMovies(data) {
    main.innerHTML = '';
    data.forEach(movie => {
        const {
            title,
            poster_path,
            vote_average,
            release_date,
            id,
        } = movie
        const year = new Date(release_date).getFullYear()
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${IMAGE_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h2>${title} (${year})</h2>
                <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>
                <button class="details" id="${id}">Details</button>
        `

        main.appendChild(movieEl);
        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
    })
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCH_URL + '&query=' + searchTerm)
    }
})

next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})
prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?')
    let queryParams = urlSplit[1].split('&')
    let key = queryParams[queryParams.length - 1].split('=')
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' + page
        getMovies(url)
    } else {
        key[1] = page.toString()
        let a = key.join('=')
        queryParams[queryParams.length - 1] = a
        let b = queryParams.join('&')
        let url = urlSplit[0] + '?' + b
        getMovies(url)
    }
}