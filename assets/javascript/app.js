$(document).ready(function() {
    // An array of the topics for the gifs
    var topics =[
        {
            name: "Deadpool",
            type: "movie",
            imdb: "tt1431045"
        },

        {
            name: "The Flash",
            type: "series",
            imdb: "tt3107288"
        },

        {
            name: "Game of Thrones",
            type: "series",
            imdb: "tt0944947"
        },

        {
            name: "Dark Souls",
            type: "game",
            imdb: "tt2015348"
        },

        {
            name: "Persona 4 Golden",
            type: "game",
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
            var newTopic = $("<button>").attr({
                "data-imdb": value.imdb,
                "data-type": value.type
            }).addClass("btn m-1 topic").text(value.name);
            
            // Appends the button to the topic buttons
            $("#topics").append(newTopic);
        });
    }

    // When a topic button is clicked, then 10 static non-animated gifs are loaded
    $("#topics").on("click", ".topic", function(e) {
        e.preventDefault();

        // Clears all current gifs
        $("#gifs").empty();

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
                }).addClass("img-fluid");

                gifDiv.append(gifImage, rating);

                $("#gifs").append(gifDiv);
            }
        });
    });

    // When a gif is clicked, then the gif switches between pause and play
    $("#gifs").on("click", ".gif img", function(e) {
        e.preventDefault();

        // Gets the current state
        var state = $(this).attr("data-state");

        // Changes the state
        if(state == "still") {
            $(this).attr({
                "src": $(this).attr("data-animate"),
                "data-state": "animate"
            });
        } else if(state == "animate") {
            $(this).attr({
                "src": $(this).attr("data-still"),
                "data-state": "still"
            });
        }
    });

    // Adds a new media topic to the media topics array.
    $("#addMedia").on("click", function(e) {
        // Stops default event from happening.
        e.preventDefault();

        alert("https://www.omdbapi.com/?i=" + $("#newMediaId").val() + "&apikey=trilogy");

        // Checks if the new topic exists in OMDb
        $.ajax({
            url: "https://www.omdbapi.com/?i=" + $("#newMediaId").val() + "&apikey=trilogy",
            method: "GET"
        }).then(function(query) {
            // If it exists and isn't already in the array, then add its title and IMDB id to the array
            // There is another data-imdb (the form input)
            if(query.Response == "True" && ($("[data-imdb=" + query.imdbID + "]").length == 1)) {
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

    // Renders a list of options from a search query
    $("#newMedia").on("keyup", function(e) {
        e.preventDefault();

        // Clears the list
        $("#searches").empty();

        // Returns a search list of topics
        $.ajax({
            url: "https://www.omdbapi.com/?s=" + $("#newMedia").val() + "&apikey=trilogy",
            method: "GET"
        }).then(function(query) {
            // Returns all search results
            let results = query.Search;
            console.log(results);

            for(let i = 0; i < results.length; i++) {
                // Gets the title
                var listItem = $("<li>").html(results[i].Title + " ").attr({
                    "data-title": results[i].Title,
                    "data-imdb": results[i].imdbID
                });

                // Gets the type of media and year
                var info = $("<span>").text("(" + results[i].Type + " - " + results[i].Year + ")");

                $(listItem).append(info);
                $("#searches").append(listItem);
            }
        });
    });

    // When an option from the list is clicked, then the option's IMDB id is added to the id field
    $("#searches").on("click", "li", function(e) {
        e.preventDefault();

        $("#newMediaId").val($(this).attr("data-imdb"));
    });

    // Renders initial list of buttons
    renderButtons();
});