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
    var $ = cheerio.load(html);

    // $("rect.day").each(function(i, element) {
    $("g g").each(function(i, element) {

      data['w' + i] = [
        // TODO push to array rather than object
        $(element).children().eq(0).attr("fill"),
        $(element).children().eq(1).attr("fill"),
        $(element).children().eq(2).attr("fill"),
        $(element).children().eq(3).attr("fill"),
        $(element).children().eq(4).attr("fill"),
        $(element).children().eq(5).attr("fill"),
        $(element).children().eq(6).attr("fill")
      ]
    });
    console.log("\n*******************************");
    return res.json(data);
  })

});//end app.get("/scrape")

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
