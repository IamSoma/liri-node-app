// DEPENDENCIES

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify({
  id: "34e84d93de6a4650815e5420e0361fd3",
  secret: "5162cd8b5cf940f48702dffe096c2acb"
});


var writeToLog = function(data) {
  fs.appendFile("someText.txt", "\r\n\r\n");

  fs.appendFile("someText.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("someText.txt has been updated");
  });
};

var getArtistNames = function(artist) {
  return artist.name;
};

var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "happy";
  }

  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }

    var songs = data.tracks.items;
    var data = [];

    for (var i = 0; i < songs.length; i++) {
      data.push({
        "artist(s)": songs[i].artists.map(getArtistNames),
        "song name: ": songs[i].name,
        "preview song: ": songs[i].preview_url,
        "album: ": songs[i].album.name,
      });
    }

    console.log(data);
    writeToLog(data);
  });
};

var getMyTweets = function() {
  var client = new Twitter(keys.twitterKeys);

  var params = { screen_name: "nfl" };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      var data = [];

      for (var i = 0; i < tweets.length; i++) {
        data.push({
          created_at: tweets[i].created_at,
          text: tweets[i].text
        });
      }

      console.log(data);
      writeToLog(data);
    }
  });
};

var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Toy Story";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=40e9cece";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      var data = {
        "Title:": jsonData.Title,
        "Year:": jsonData.Year,
        "Rated:": jsonData.Rated,
        "IMDB Rating:": jsonData.imdbRating,
        "Country:": jsonData.Country,
        "Language:": jsonData.Language,
        "Plot:": jsonData.Plot,
        "Actors:": jsonData.Actors,
        "Rotton Tomatoes URL:": jsonData.tomatoURL
      };

      console.log(data);
      writeToLog(data);
    }
  });
};

var doWhatItSays = function() {
  fs.readFile("randomText.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

var getHelp = function(){
  console.log('To view nfl tweets pass nfl-tweets');
  console.log('===========================================');
  console.log('To view spotify pass spotify-this-song');
  console.log('===========================================');
  console.log('To view movies pass movie-this');
  console.log('===========================================');
}


// Function for determining which command is executed
var pick = function(caseData, functionData) {
  switch (caseData) {
    case "nfl-tweets":
      getMyTweets();
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMeMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    case "help":
      getHelp();
      break;
    default:
      console.log("LIRI doesn't know that");
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);