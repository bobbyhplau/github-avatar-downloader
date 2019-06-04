var request = require('request');
// var fs = require('fs');
require('dotenv').config();

var owner = process.argv[2];
var repo = process.argv[3];

var missingErr = "You need to specify both the GitHub repo owner and the GitHub repo name.";

if (!(owner && repo)) {
    throw missingErr;
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

    var options = {
        url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
        headers: {
            'User-Agent': 'request',
            'Authorization': "token " + process.env.GITHUB_TOKEN
        }
    };

    request(options, function(err, res, body) {
        cb(err, body);
        console.log("Download Complete");
    });
}

function downloadImageByURL(url, filePath) {

    request.get(url)
        .on('error', function(err) {
            throw err;
        })
        .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(owner, repo, function(err, result) {

    var json = JSON.parse(result);

    for (var i of json) {
        var fP = "./avatars/" + i.login + ".png";
        console.log("Getting image for ", i.login);
        downloadImageByURL(i.avatar_url, fP);
    }
});