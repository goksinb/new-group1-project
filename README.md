
# **QUEFLIX**

Find out where to stream your favorite movies and TV shows!

## **About the Project**

In this group project, we created a platform where you can search for movies and TV shows, add them to your favorites list, edit, and get information on where to stream them.

## **Features**

✅ **Search for Movies & TV Shows** – Find what you want to watch.

✅ **Get Streaming Links** – Click the arrow directly to the streaming platform.

✅ **View Details** – See the title before watching.

✅ **Save to Your Watchlist** – Click the heart to add movies and series to your list.

✅ **Edit or write in the tile** – Allowing users to give their saved movies/TV shows a more personal touch.

✅ **Manage Your List** – Remove items or get the streaming link with one click.

---

## **Pages**

### **1️⃣ Search Page**

On the first page, you’ll find a search bar where you can type the name of a movie or TV show.

- Click the **arrow** to get a direct link to the streaming platform.
- See **basic details** such as the title and if it is a TV show or movie.
- Click the **heart** to add it to your watchlist.

### **2️⃣ Watchlist Page**

This is where all your saved movies and series will be stored.

- Edit the title or write something by clicking on the **pencil**.
- Click the **arrow** to get a direct streaming link.
- **Delete** items from your list when you're done watching by clicking on the X.

---

## **How to Use QUEFLIX**

1️⃣ Search for a movie or TV show.

2️⃣ Click the **arrow** to get streaming information.

3️⃣ Save it by clicking the **heart**.

4️⃣ Visit your **watchlist** to manage your saved content.

---

### 🚀 **Happy Watching!**

Contributors & Contributions

### **Fatou**

- Developed the website concept and selected the most suitable API for the project.
- Implemented a fetch function to retrieve data from the API.
- Implemented the user interface based on the chosen design for the Search list page.
- Optimized the responsiveness of the Search list page for larger and smaller screens.
- Added "Enter" functionality to the search input for easier navigation.

### **Gökşin**

- Implemented a searchList function to fetch and display the fetched movies on the page.
- Created a React state using useState to store search results and manage the loading indicator.
- Connected the input bar to the API to fetch movie titles based on the search query and store them for future use.
- Added handleButtonClick Function: Validates the search query, triggers the API call to fetch movies, handles loading/error states, and updates the results based on the response
- Used the title API to display only movie titles in the search bar, while also fetching the full movie/TV series array to display in the pop-up.
- Added a loading status indicator while fetching data.

### **Noory**

- In the development of the PopupWindow component, I implemented several key features to enhance the user experience and functionality:

- Movie Detail Display:
I created a function that dynamically renders movie details in a popup window, providing users with quick access to important information about their selected content.

- Content Type Formatting:
To improve readability and consistency, I implemented logic to capitalize the first letter of the content type (e.g., "Movie" or "TV Series") displayed in the popup window.

- Watchlist Integration:
I developed a handler function that allows users to add movies to their watchlist directly from the popup. This function also closes the popup after adding an item, streamlining the process of adding multiple items to the watchlist.

- Title Truncation:
To maintain a clean and consistent layout, I implemented a truncate function that limits the length of movie titles in the popup window. This function adds an ellipsis (...) to titles that exceed a specified character limit, ensuring that all titles fit neatly within the design.

- External Streaming Link:
I integrated a direct link to Netflix, accessible via an arrow button in the popup. This feature provides users with quick access to potential streaming options for the selected content.

- Design:
Using CSS, I crafted a visually appealing and design for the popup window. This ensures that the component looks great and functions well across various device sizes and screen resolutions.

### **Mohamed**

- Designed the webpage on figma, chosed font and design elements-

- Created the global stylesheet for the project

- Created SVG:s and background through illustrator for the project

- Worked on the watchlist page, created the layout with react

- Worked on the watchlist.js page right functions and structure to align with the design

- Fetched the Api to pull streaming services and display only the top version of the streaming service.

- created the css for the watchlist page and made it responsive.
