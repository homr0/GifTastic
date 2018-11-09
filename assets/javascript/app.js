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
            name: "Persona 5",
            imdb: "tt3944082"
        }
    ];

    // Offset for loading more gifs
    var offset = 0;

    // Saves the links of the user's favorite gifs
    var favorites = [];

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

    // Checks if topic already exists
    function topicExists(topic) {
        let exists = false;
        
        $(topics).each(function(key, value) {
            if(value.imdb == topic) {
                exists = true;
                return false;
            }
        });

        return exists;
    }

    // Checks if the gif exists as a favorite
    function favoriteExists(animatedGif) {
        let exists = false;

        $(favorite).each(function(key, value) {
            if(value.animated == animatedGif) {
                exists = true;
                return false;
            }
        });

        return exists;
    }

    // Renders gifs into a spot
    function renderGif(gifTitle, gifStill, gifAnimate, gifRating) {
        var gifDiv = $("<div>").addClass("gif float-left m-1 position-relative");

        var title = $("<strong>").text(gifTitle);
        title = $("<p>").append(title);

        var rating = $("<p>").text("Rating: " + gifRating);

        var gifImage = $("<img>").attr({
            "src": gifStill,
            "data-still": gifStill,
            "data-animate": gifAnimate,
            "data-state": "still",
            "alt": gifTitle
        }).addClass("img-fluid");
        
        var heart = $("<i>").addClass("fa-heart position-absolute");
        if(favorites.indexOf(gifAnimate) < 0) {
            $(heart).addClass("far");
        } else {
            $(heart).addClass("fas");
        }

        gifDiv.append(title, gifImage, rating, heart);

        $("#gifs").prepend(gifDiv);
    }

    // When a topic button is clicked, then 10 static non-animated gifs are loaded
    $("#topics").on("click", ".topic", function(e) {
        e.preventDefault();

        // When a new topic is selected, then gif area is reloaded
        if(!($(this).hasClass("selected"))) {
            // Clears all current gifs
            $("#gifs").empty();

            // Resets offset to 0
            offset = 0;

            // Sets this topic to the selected topic
            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            // Clears the media info
            $("#mediaInfo, #mediaPoster").empty();

            // Loads the media info
            $.ajax({
                url: "https://www.omdbapi.com/?i=" + $(".selected").attr("data-imdb") + "&plot=short&apikey=trilogy",
                method: "GET"
            }).then(function(query) {
                // Loads the title, release date, and plot
                var title = $("<h2>").text(query.Title);

                var released = $("<p>").text("Released: " + query.Released);

                var plot = $("<p>").text(query.Plot);

                // Loads the poster if it exists
                if(query.Poster != "N/A") {
                    var poster = $("<img>").attr({
                        "src": query.Poster,
                        "alt": query.Title
                    }).addClass("img-fluid");

                    $("#mediaPoster").append(poster);
                }

                $("#mediaInfo").append(title, released, plot);
            });
        } else {
            // Adds to the offset
            offset++;
        }

        // Renders gifs for the selected topic
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?api_key=kOK7MtUujqtZsU1oxZYEjJDrX9ToVw2O&q=" + $(".selected").text() + "&limit=10&offset=" + (offset * 10),
            method: "GET"
        }).then(function(query) {
            // Loads the gifs from the response.
            let results = query.data;

            for (let i = 0; i < results.length; i++) {
                let gifTitle = results[i].title;
                let gifStill = results[i].images.fixed_height_still.url;
                let gifAnimate = results[i].images.fixed_height.url;
                let gifRating = results[i].rating;

                renderGif(gifTitle, gifStill, gifAnimate, gifRating);
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

            for(let i = 0; i < results.length; i++) {
                // If the topic doesn't already have a button, then add it to the list.
                if(!(topicExists(results[i].imdbID))) {
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
            }
        });
    });

    // When an option from the list is clicked, the the option is added to the array of topics
    $("#searches").on("click", "li", function(e) {
        e.preventDefault();

        topics.push({
            name: $(this).attr("data-title"),
            imdb: $(this).attr("data-imdb")
        })

        // Clears the fields
        $("#newMedia, #newMediaId").val("");
        $("#searches").empty();

        // Re-renders the buttons
        renderButtons();

        // Clicks on the newly created topic button
        $("[data-imdb=" + $(this).attr("data-imdb") + "]").trigger("click");
    });

    // Shows/hides the disclaimer
    $("#ymmv").on("click", function(e) {
        e.preventDefault();

        if($(this).attr("data-show") == "true") {
            $("#disclaimer").hide();
            $(this).attr("data-show", "false");
        } else if($(this).attr("data-show") == "false") {
            $("#disclaimer").show();
            $(this).attr("data-show", "true");
        }
    });

    // Adds a favorite to the list of favorite gifs
    $("#gifs").on("click", ".fa-heart.far", function(e) {
        e.preventDefault();

        // Changes the state of the favorite
        $(this).removeClass("far").addClass("fas");

        // Gets the parent's information
        var gif = $(this).parent().children("img");

        // Gets the rating
        var rating = $(this).parent().children("p").last().text().substring(8);

        favorites.push({
            title: $(gif).attr("alt"),
            still: $(gif).attr("data-still"),
            animate: $(gif).attr("data-animate"),
            rating: rating
        });

        // Saves to localStorage
        localStorage.setItem("favorites", JSON.stringify(favorites));
    });

    // When mouse is over the favorite button, then it will show the opposite state.
    // $("#gifs").on("mouseenter mouseleave", ".fa-heart", function() {
    //     if($(this).hasClass("far")) {
    //         $(this).removeClass("far").addClass("fas");
    //     } else if($(this).hasClass("fas")) {
    //         $(this).removeClass("fas").addClass("far");
    //     }
    // });

    // When the Favorite Gifs button is clicked, show only the favorite gifs
    $("#favorite").on("click", function(e) {
        e.preventDefault();

        // Empties the gif area as well as the media info
        $("#gifs, #mediaPoster, #mediaInfo").empty();

        var heading = $("<h2>").text("Your Favorite Gifs");

        var text = $("<p>").text("Check out your favorited Gifs here!");

        $("#mediaInfo").append(heading, text);

        let list = JSON.parse(localStorage.getItem("favorites"));

        // Goes through all of the favorites and renders them
        for(let i = 0; i < list.length; i++) {
            let title = list[i].title;
            let still = list[i].still;
            let animate = list[i].animate;
            let rating = list[i].rating;
            renderGif(title, still, animate, rating);
        }
    });

    // Renders initial list of buttons
    renderButtons();
});