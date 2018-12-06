# Memetic Media Generator

Using the GIPHY API, this dynamic web page is populated with gifs of your choice from movies, TV shows, and video games. Whether it's a reaction shot, ~~meme trash~~, or just a funny scene, then you can find it here.

## Instructions

1. Click the topic that you want gifs of.
2. If the topic does not have a button available, then go to the input field below **Favorite Gifs**, and type in the topic until it appears in the dropdown list below.
3. Once a topic button is clicked, some information about the topic will be displayed as well as 10 gifs.
4. To see another 10 gifs, click on the topic button again.
5. Click on a gif to see it in motion (and again to pause it).
6. If you like a gif, you can favorite it by clicking the *heart* in the center.
7. All of the gifs that you have favorited are accessible when you click **Favorite Gifs**.
8. To remove a gif form your **Favorite Gifs** , just click on the *heart* again.

### Caveats

- Please note that gif relevancy to topic may vary.
- If the topic already has a button, then it will not show up in the dropdown menu.
- Only topics with IMDb ID will show up in the dropdown menu.

## Developer Diary

One of the easiest ways to make a web page more interesting is adding a gif to it. GIPHY is a repository of gifs where something can be found for any occasion and it has an API that can be utilized to return some queried gifs.

For this project, I used AJAX to get a subset of gifs from the GIPHY API. Since the gifs here are supposed to be from movies, video games, and tv shows, I also utilized the OMDb API to restrict GIPHY queries to the media title found from OMDb.

One of the features of this project allows users to add and remove multiple topics to pick gifs from. Since I limited queries to titles from OMDb, this helps eliminate redundant topics, though due to the nature of remakes and similarly named shows and movies, this has lead to an overlap of gifs for similarly titled topics.

Due to the design of the project, the GIPHY API can theoretically be used to load gifs ad infinitum. However, users will want to keep track of gifs that they found particular useful (or amusing), so I used localStorage to store these favorited gifs as well as allow users to remove any gifs that they no longer like.
