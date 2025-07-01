
// Part 1 - Variables

const filterButtons = document.querySelectorAll('.filter-button')
const container = document.querySelector('.grid')
const searchInput = document.querySelector('.search-input')
const seeMoreButton = document.querySelector('#see-more-button')

const debouncedResetAndFetchArticles = debounce(resetAndFetchArticles, 300)

const selectedCategories = new Set()

let searchText = ''

let currentPage = 1
const perPage = 3
let hasMore = false



// Part 2 - Functions


function fetchArticles(append = false) {
    const categories = Array.from(selectedCategories).join(',')
    const queryParams = new URLSearchParams()

    if (categories) {
        queryParams.append('categories', categories)
    }
    if (searchText) {
        queryParams.append('searchText', searchText)
    }
    
    queryParams.append('page', currentPage)
    queryParams.append('perPage', perPage)

    fetch(`/articles/?${queryParams.toString()}`)
    .then(res => res.json())
    .then(data => {
        if(append) {
            appendArticles(data.articles)
        } else {
            container.innerHTML = ''
            renderArticles(data.articles)
        }

        hasMore = data.hasMore
        seeMoreButton.style.display = hasMore ? 'inline-block' : 'none'
    })
    .catch(err => {
        console.error('Error loading articles', err)
        container.innerHTML = '<p>Failed to load articles</p>'
    })
}

function resetAndFetchArticles() {
    currentPage = 1
    fetchArticles(false)
}

function renderArticles(articles) {
    container.innerHTML = ''
    appendArticles(articles)
}

function appendArticles(articles) {

    if(!articles.length && currentPage === 1) {
        container.innerHTML = '<p>No articles found</p>'
        return
    }

    articles.forEach(a => {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="card-outer light-gray">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="front-outer">
                            <div class="front-inner">
                                <div class="card-top">

                                    <div class="category-container">
                                        <h1>${a.categories}</h1>
                                    </div>

                                    <div class="title-container">
                                        <h1>${a.title}</h1>
                                    </div>

                                    <div class="source-container">
                                        <h2>${a.source}</h2>
                                    </div>

                                    <div class="date-container">
                                        <h2>${a.date}</h2>
                                    </div>

                                </div>
                                <div class="card-bottom">

                                    <div class="link-container">
                                        <a href="${a.link}">Full article</a>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="card-back hide">
                        <div class="back-outer">
                            <div class="back-inner">

                                <div class="card-top">

                                    <div class="summary-container"></div>

                                </div>


                                <div class="card-bottom">

                                    <div class="link-container"></div>
                                    
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        
        `
        container.appendChild(div)
    })
}

function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

// Part 3 - Event Listeners

filterButtons.forEach(button => button.addEventListener('click', () => {
    console.log(`${button.textContent} clicked!`)

    const category = button.getAttribute('data-category')

    if(selectedCategories.has(category)) {
        selectedCategories.delete(category)
        button.classList.remove('active')
    } else {
        selectedCategories.add(category)
        button.classList.add('active')
    }

    resetAndFetchArticles()
}))

searchInput.addEventListener('input', () => {
    searchText = searchInput.value.trim()
    debouncedResetAndFetchArticles()
})

seeMoreButton.addEventListener('click', () => {
    currentPage++
    fetchArticles(true)
})

// Part 4 - Main

fetchArticles()