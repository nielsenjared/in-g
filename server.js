var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/scrape/:username", function(req, res) {
  var username = req.params.username;

  var url = "https://github.com/" + username;

  request(url, function(error, response, html) {
    var data = {};
    // var $ = cheerio.load(html);
    try {
      var $ = cheerio.load(html)
    } catch (e) {
      console.log("cheerio err"); // TODO handle error
    }

    $("g g").each(function(i, element) {
      data['w' + i] = [];
      for (var j = 0; j < $(element).children().length; j++){
        data['w' + i].push($(element).children().eq(j).attr("fill"));
      }
    });
    return res.json(data);
  })

});//end app.get("/scrape")

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
