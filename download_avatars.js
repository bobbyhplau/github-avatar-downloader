var request = require('request');
var auth = require('./secrets.js').GITHUB_TOKEN;
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': auth
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function downloadImageByURL(url, filePath) {

  request.get(url)
         .on('error', function (err) {
            throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

getRepoContributors('jquery', 'jquery', function(err, result) {

  json = JSON.parse(result);

  for (i of json) {
    var fP = "./avatars/" + i.login + ".png";
    downloadImageByURL(i.avatar_url, fP);
  }
});

/*
var tempUrl = "https://avatars1.githubusercontent.com/u/86454?v=4";
var tempFilePath = "./avatars/test.png";

downloadImageByURL(tempUrl, tempFilePath)
*/