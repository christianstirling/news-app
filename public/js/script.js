
// Part 1 - Variables

const filterButtons = document.querySelectorAll('.filter-button')
const container = document.querySelector('.grid')
const searchInput = document.querySelector('.search-input')
const seeMoreButton = document.querySelector('#see-more-button')



const debouncedResetAndFetchArticles = debounce(resetAndFetchArticles, 300)

const selectedCategories = new Set()

let searchText = ''

let currentPage = 1
const perPage = 12
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
            <div class="card-container">
                <div class="card">
                    <div class="card-top">

                        <div class="category-container hide">
                            <h1>${a.categories}</h1>
                        </div>

                        <div class="image-container">
                            <img class="card-image" src="/img/assp-logo.jpg"/>
                        </div>

                        <div class="title-container">
                            <h1 class="title-text card-title">${a.title}</h1>
                        </div>

                        <div class="source-container">
                            <h2 class="info-text card-source">${a.source}</h2>
                        </div>

                        <div class="date-container">
                            <h2 class="info-text card-date">${a.date}</h2>
                        </div>

                        

                    </div>




                    <div class="card-middle hide">
                        <div class="icon-container">
                            <img src="/svg/openai-24-white.svg" alt="">
                        </div>

                        <div class="summary-container">
                            <p class="summary-text card-summary">${a.summary}</p>
                        </div>
                    </div>




                    <div class="card-bottom">

                        <div class="link-container">
                            <a href="${a.link}" class="article-link">
                                <button class="article-button button-text card-button button">Original Article</button>
                            </a>
                        </div>

                        <div class="button-container">
                            <button class="flip-button button-text summary-button card-button button">AI Summary</button>
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


function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent)
}

function setButtonEffects() {
    if(isMobile()) {
        const buttons = document.querySelectorAll('.button')

        console.log(buttons)

        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.classList.add('active-touch')

                setTimeout(() => {
                    button.classList.remove('active-touch')
                }, 2000)
            })
        })
    }
}

// Part 3 - Event Listeners

filterButtons.forEach(button => button.addEventListener('click', () => {

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
    console.log(searchText)
    if(searchText !== '') {
        searchInput.classList.add('occupied')
    } else {
        searchInput.classList.remove('occupied')
    }
    console.log(searchInput.classList)
    debouncedResetAndFetchArticles()
})

searchInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault()
    }
})

container.addEventListener('click', (event) => {
    const button = event.target.closest('.flip-button')

    if(button) {
        const wasExpanded = button.classList.contains('active')
        button.classList.toggle('active')
        
        
        const card = button.closest('.card')
        const summary = card.querySelector('.card-middle')

        summary.classList.toggle('hide')

        // IF_ELSE used to make the page scroll either down to include the bottom of the card when the 
        // button is activated, or up to include the top of the card when the button is deactivated

        if (!wasExpanded) {
            setTimeout(() => {

              const rect = button.getBoundingClientRect()
              const scrollY = window.scrollY || window.pageYOffset
          
              // Scroll down when the button is pressed,
              // so the button is 10px above the bottom of the screen
              const targetScroll = scrollY + rect.bottom - window.innerHeight + 10
          
              window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
              })

            }, 50)
          } else {
            setTimeout(() => {

                // Scroll to the top of the card when the button is deactivated
                const cardTop = card.getBoundingClientRect().top + window.scrollY - 10

                window.scrollTo({
                    top: cardTop,
                    behavior: 'smooth'
                })

              }, 50)
          }
    }
})

seeMoreButton.addEventListener('click', () => {
    currentPage++
    fetchArticles(true)
})

// Part 4 - Main

fetchArticles()

