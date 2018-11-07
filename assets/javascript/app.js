$(document).ready(function() {
    // An array of the topics for the gifs
    var topics =[
        {
            name: "Deadpool",
            imdb: "tt1431045"
        },

        {
            name: "The Flash",
            imdb: "tt3107288"
        },

        {
            name: "Game of Thrones",
            imdb: "tt0944947"
        },

        {
            name: "Dark Souls",
            imdb: "tt2015348"
        },

        {
            name: "Persona 4 Golden",
            imdb: "tt3003738"
        }
    ];

    // Renders buttons from the topics
    function renderButtons() {
        // Clears all of the current buttons to prevent repeat buttons
        $("#topics").empty();

        // Loops through the topics and renders the buttons
        $(topics).each(function(key, value) {
            // Creates the button with the topic
            var newTopic = $("<button>").attr("data-imdb", value.imdb).addClass("btn m-1 topic").text(value.name);
            
            // Appends the button to the topic buttons
            $("#topics").append(newTopic);
        });
    }

    // When a topic button is clicked, then 10 static non-animated gifs are loaded
    $("#topics").on("click", ".topic", function(e) {
        e.preventDefault();

        // Gets the name of the topic for loading GIFs
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?api_key=kOK7MtUujqtZsU1oxZYEjJDrX9ToVw2O&q=" + $(this).text() + "&limit=10",
            method: "GET"
        }).then(function(query) {
            // Loads the gifs from the response.
            let results = query.data;

            for (let i = 0; i < results.length; i++) {
                var gifDiv = $("<div>").addClass("gif float-left m-1");

                var rating = $("<p>").text("Rating: " + results[i].rating);

                var gifImage = $("<img>").attr({
                    "src": results[i].images.fixed_height_still.url,
                    "data-still": results[i].images.fixed_height_still.url,
                    "data-animate": results[i].images.fixed_height.url,
                    "data-state": "still",
                    "alt": results[i].title
                });

                gifDiv.prepend(rating, gifImage);

                $("#gifs").append(gifDiv);
            }
        });
    });

    // When a gif is clicked, then the gif switches between pause and play

    // Adds a new media topic to the media topics array.
    $("#addMedia").on("click", function(e) {
        // Stops default event from happening.
        e.preventDefault();

        // Checks if the new topic exists in OMDb
        $.ajax({
            url: "https://www.omdbapi.com/?t=" + $("#newMedia").val() + "&apikey=trilogy",
            method: "GET"
        }).then(function(query) {
            // If it exists and isn't already in the array, then add its title and IMDB id to the array
            if(query.Response == "True" && ($("[data-imdb=" + query.imdbID + "]").length < 1)) {
                topics.push({
                    name: query.Title,
                    imdb: query.imdbID
                });

                // Re-render the buttons
                renderButtons();
            } else {
                alert("Could not find " + $("#newMedia").val() + ", or it is already a topic");
            }
        });
    });

    // Renders initial list of buttons
    renderButtons();
});