var request = require('request');
var auth = require('./secrets.js').GITHUB_TOKEN;

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

}

getRepoContributors('jquery', 'jquery', function(err, result) {

  json = JSON.parse(result);

  for (i of json) {
    console.log(i.avatar_url);
  }
});