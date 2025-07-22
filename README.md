# news-app

1. Project Overview

    Ergo News is a web application designed as a one-stop hub for ergonomics practitioners to stay current on industry news.  The app displays information about news articles curated by a Saturn Ergonomics administrator, including an AI-written summary.  The purpose of this technology to to allow users to efficiently browse the latest news in a social media-like format.

2. Important Features:

    * AI-generated summaries for each article
    * Filterable news feed based on important categories within the industry
    * Search functionality to find specific topics or sources
    * Admin portal for uploading, editing, deleting, and managing article content
    * Responsive design emphasizing both mobile and desktop functionality

3. Tech Stack:

    * Front-end: HTML/CSS, JavaScript, EJS
    * Back-end: Node.js, Express
    * Database: MongoDB

    * Other-used by admin separately: OpenAI (not included in app as an API currently), Google Alerts

4. Project Structure:

    * app.js - main server-side application

    * /public - static client-side assets (script, stylesheets, images)

    * /server - server-side assets
        * /server/config - MongoDB cluster connection
        * /server/models - MongoDB models
        * /server/routes - Express routes

    * /views - EJS templates
        * /views/layouts - has a layout for the main app page & the admin pages
        * /views/main - contains the index file which is the body for the main app page
        * /views/admin - contains the body pages for each of the admin portal pages
        * /views/partials - contains partial ejs files such as header & footer
    
5. Setup Instructions

    a. Download/clone the repository
    b. Open the folder
    c. Install dependencies: ' npm install ' - this should download all node packages needed
    d. Configure the env variables: MONGODB_URI , SESSION_SECRET
    e. Start the server: ' nodemon app.js '
    f. Open the app at http://localhost:3000

6. Admin Portal

    * The admin portal is located at /admin/login
    * Admin user must log in using credentials (username, password) given by Saturn Ergonomics
    * Once authenticated, user can: add new articles, edit existing articles, delete existing articles, upload new article (logo) images, rename existing logo images, or delete existing logo imagess
    * Access is restricted to authorized users via session-based authentication

7. App Usage Example

    * User would open the app at the main app page, which would show all articles unfiltered, sorting by most recent
    * User MAY select one or more category filters to narrow down the type of news that show up in the scroll
    * User MAY enter text into the search bar to limit the resulting articles to only ones that contain the search-input value
    * User scrolls through apps, seeing article titles and logos of the article source
    * Upon finding an interesting article, user can click the 'AI Summary' button to read an OpenAI-generated summary of the article.
    * If the user wants to read the full article, they can click the 'Original Article' button and be taken to the full article on the source website in a new browser tab 



    
