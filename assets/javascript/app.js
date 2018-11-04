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

    // When a gif is clicked, then the gif switches between pause and play

    // Adds a new movie or show topic to the media topics array.
    $("#addMedia").on("click", function(e) {
        // Stops default event from happening.
        e.preventDefault();

        // Checks if the new topic exists in OMDb
        $.ajax({
            url: "https://www.omdbapi.com/?t=" + $("#newMedia").val() + "&apikey=trilogy",
            method: "GET"
        }).then(function(query) {
            // If it exists, then add its title and IMDB id to the array
            console.log(query);
                console.log(query.Title, query.imdbID);
            if(query.Response == "True") {
                topics.push({
                    name: query.Title,
                    imdb: query.imdbID
                });

                // Re-render the buttons
                renderButtons();
            } else {
                alert("Could not find " + $("#newMedia").val());
            }
        });
    });

    // Renders initial list of buttons
    renderButtons();
});