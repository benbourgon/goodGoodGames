// RAWG API key: 8d9bfb5b698a4fd096e3daaaaeee21af

// App Requirements:
// 1. The app should: get games that match the selected genre, platform and metacritic rating of 75%
// 3. Choose a random game from that list
// 4. Display the game's title, box art, and platform(s).
// 5. Be able to reset the process.

const app = {}

// storing the api key and base api url as constants
app.API_KEY = "8d9bfb5b698a4fd096e3daaaaeee21af";
app.BASE_URL = "https://api.rawg.io/api"

// Save our HTML elements as variables
app.$form = $("form");
app.$genreChild = $(".genre-child");
app.$platformChild = $(".platform-child");
app.$genreDropdown = $("#genre-dropdown");
app.$platformDropdown = $("#platform-dropdown");
app.$submitButton = $(".submit-button");
app.$resetButton = $(".reset-button");
app.$gameContainer = $(".game-container");
app.$imageContainer = $(".game-image-container")
app.$infoContainer = $(".game-info-container")
app.$gameArt = $(".game-art")

// Choose a random game from the final array.
app.chooseRandomGame = (array) => {
    const index = Math.floor(Math.random() * array.length)
    return array[index];
}

// remove the form elements when the submit button is pressed.
app.makeInvisible = () => {
    app.$genreChild.addClass("invisible")
    app.$platformChild.addClass("invisible");
    app.$submitButton.addClass("invisible");
    app.$gameContainer.removeClass("invisible")
}

// refresh the page when reset is hit
app.refreshPage = () => {
    app.$genreChild.removeClass("invisible");
    app.$platformChild.removeClass("invisible");
    app.$submitButton.removeClass("invisible");
    app.$gameContainer.addClass("invisible");
    app.$gameContainer.empty();
    app.$gameArt.empty();
    app.$imageContainer.empty();
    app.$infoContainer.empty();
    app.getSelections()
}

// Display the game to the page
app.displayGame = (game) => {
    app.$gameArt.attr('src', game.background_image);
    app.$gameArt.attr('alt', `Key art for ${game.name}`);
    app.$infoContainer.append(`<h3>Title: ${game.name}</h3>`);
    app.$infoContainer.append(`<p>Metacritic Score: ${game.metacritic}</p>`);
    app.$infoContainer.append(`<p>Release Date: ${game.released}`);
}

// Get the list of games and filter by selected genres, platform, and metacritic score between 75-100%
app.chooseGame = (genre, platform) => {
    // AJAX call for the list of all games
    $.ajax({
        url: `${app.BASE_URL}/games`,
        method: `GET`,
        dataType: `json`,
        data: {
            key: app.API_KEY,
            genres: genre,
            platforms: platform,
            metacritic: "75, 100"
        }
    }).then((data) => {
        if (data.count !== 0) {
            const gameSelection = app.chooseRandomGame (data.results)
            app.displayGame (gameSelection)
        }else {
            app.$gameContainer.append("<h3 class=no-results>No matching results found. Please reset and try another option.</h3>")
        }
    })
}

// store the user's selections as variables
app.getSelections = () => {
    // create an event listener 
    app.$form.on("submit", (event) => {
        event.preventDefault()
        app.makeInvisible();
        const genreSelection = app.$genreDropdown.val()
        const platformSelection = app.$platformDropdown.val()
        app.chooseGame (genreSelection, platformSelection)
    });
}
// Get the options for the Genre select element
app.populateGenreDropdown = () => {
    // AJAX call for the list of genres.
    $.ajax({
        url: `${app.BASE_URL}/genres`,
        method: `GET`,
        dataType: `json`,
        data: {
            key: app.API_KEY
        }
    }).then((data) => {
        // Look at the genre results and create an option element for each unique genre
        data.results.forEach((genre) => {
        const genreOption = `
        <option value="${genre.id}">${genre.name}</option>`

        // Append the genre to the Genre select element
        app.$genreDropdown.append(genreOption);
        })
    });
}
// Get the options for the platform select element.
app.populatePlatformDropdown = () => {
    // AJAX call for the list of platforms.
    $.ajax({
        url: `${app.BASE_URL}/platforms`,
        method: `GET`,
        dataType: `json`,
        data: {
            key: app.API_KEY
        }
    }).then((data) => {
        // Look at the platform results and create an option element for each unique platform
        data.results.forEach((platform) => {
        const platformOption = `
        <option value="${platform.id}">${platform.name}</option>`

        // Append the platform to the platform select element
        app.$platformDropdown.append(platformOption);
        })
    });
}

// Setting up the init function.
app.init = () => {
    // call methods to run on load
    app.populateGenreDropdown();
    app.populatePlatformDropdown();
    app.getSelections();
    app.$form.on("reset", (event) => {
        event.preventDefault;
        app.refreshPage();
    })
};
// run the init function when the document is ready
$(() => app.init());