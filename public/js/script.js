
// Part 1 - Variables

    // creates buttons in JS for each of the filter-buttons--in an array
const filterButtons = document.querySelectorAll('.filter-button')
    // container for the grid--will be populated during client-side rendering using fetch
const container = document.querySelector('.grid')

    // value that currently resides in the header search box
const searchInput = document.querySelector('.search-input')

    // 'see more' button at the bottom of the page--will be used to generate additional articles
const seeMoreButton = document.querySelector('#see-more-button')

    // debounce is used to set a delay from when the user enters/removes any text from
    // the search bar to when the articles on the page update
    // this is so that the articles will only render when the user is done typing
const debouncedResetAndFetchArticles = debounce(resetAndFetchArticles, 300)

    // a Set that holds all of the currently selected categories. 
    // used in rendering the articles on the page
const selectedCategories = new Set()

    // empty string that will later hold the string value from searchInput
let searchText = ''

    // for pagination:

    // current page -- starts at 1
let currentPage = 1
    // number of articles that should show up on each 'page'
const perPage = 12
    // var to see if there are any more articles to see beyond those shown
let hasMore = false


const clearButton = document.querySelector('.clear-button')

searchInput.addEventListener('input', () => {
    clearButton.style.display = searchInput.value ? 'block' : 'none'
})

clearButton.addEventListener('click', () => {
    // Clear the search input
    searchInput.value = ''
    searchText = ''
    searchInput.classList.remove('occupied')

    clearButton.style.display = 'none'

    // Reset current page and fetch articles
    currentPage = 1
    fetchArticles()
})







// Part 2 - Functions

    /* 
        fetchArticles
    
        The main function called when collecting the 'articles' to be rendered on the page

        Works in 2 parts--part 1: creates a URL Search Param used to pull the appropriate articles
        from the DB, based on the selected categories or the string value in the search
        box.

        part 2: uses that search param to fetch the resulting JSON data and then calls a function
        which renders that data onto the page

     */
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
        if(!append) {
            container.innerHTML = ''
        }

        appendArticles(data.articles)

        hasMore = data.hasMore
        seeMoreButton.style.display = hasMore ? 'inline-block' : 'none'
    })
    .catch(err => {
        console.error('Error loading articles', err)
        container.innerHTML = '<p>Failed to load articles</p>'
    })
}

    /*  
        Function called in the fetchArticles function--builds the card components and populates
        them with data from the JSON objects created inside fetchArticles
    */

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
                            <img class="card-image" src="${a.image}"/>
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
                            <a href="${a.link}" class="article-link" target="_blank">
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

    /*  
        resetAndFetchArticles

        Wrapper function that resets the 'currentPage' index back to the first page,
        and then runs fetchArticles again.

        Used when user actions are taken that would change the URL search parameters
        (AKA the categories or the search input is changed)
    */

function resetAndFetchArticles() {
    currentPage = 1
    fetchArticles(false)
}

    /*
        debounce
        
        Function used to delay the implementation of another function 'func'.

        Used for the search box--so that the page doesn't update until the user is done typing.
    */

function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

    /*
        isMobile

        Simple function used to check if the browser is a mobile browser or not.

        Used in the next function to see which button effects to add to the buttons.

        Potential to be used in other ways later as well, as an alternative to media-querying.
    */

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent)
}

    /*
        setButtonEffects

        Checks to see if the browser is on Mobile or not, if so:

        Adds the .active-touch class to the button for a given amount of time.
        Purpose of this is to create a button effect that works on mobile, whereas
        the previous effects work by using the hover state, which is not used
        in mobile.

        In the CSS, the active-touch class adds similar effects to the buttons as
        what you would see on desktop using hover.
    */

function setButtonEffects() {
    if(isMobile()) {
        const buttons = document.querySelectorAll('.button')
        const time = 2000

        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.classList.add('active-touch')

                setTimeout(() => {
                    button.classList.remove('active-touch')
                }, time)
            })
        })
    }
}




function expandButton(label, delay) {

    label.classList.remove('hide')
    setTimeout(() => {
        label.classList.add('hide')
    }, delay);

}



// Part 3 - Event Listeners

    /*

    */

filterButtons.forEach(button => button.addEventListener('click', () => {

    const category = button.getAttribute('data-category')

    if(selectedCategories.has(category)) {
        button.classList.remove('active')
        selectedCategories.delete(category)
    } else {
        button.classList.add('active')
        if(isMobile()) {
            expandButton(button.querySelector('.label-container'), 1500)
        }
        selectedCategories.add(category)
    }

    resetAndFetchArticles()
}))

filterButtons.forEach(button => button.addEventListener('mouseenter', () => {
    if(!isMobile()) {
        button.querySelector('.label-container').classList.remove('hide')
    }
}))

filterButtons.forEach(button => button.addEventListener('mouseleave', () => {
    if(!isMobile()) {
        button.querySelector('.label-container').classList.add('hide')
    }
}))

// upon entering or removing any text from the search bar
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

// prevents the enter key from doing anything basically
searchInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault()
        searchInput.blur()
    }
})

// sets an event listener on each of the AI Summary buttons that are generated in the main
// app grid by attaching them to the card-containers as they are created


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

setButtonEffects()

fetchArticles()

