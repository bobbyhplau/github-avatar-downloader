var request = require('request');
// var auth = require('./secrets.js').GITHUB_TOKEN;
var fs = require('fs');
var result = require('dotenv').config();

if (result.error) {
    let err = 'Missing .env file';
    throw err;
}

if (process.env.GITHUB_TOKEN === undefined) {
    let err = 'Missing GITHUB_TOKEN in .env';
    throw err;
}

var owner = process.argv[2];
var repo = process.argv[3];

if (process.argv.length != 4) {
    let err = 'This program takes exactly 2 arguments, use node getRepoContributors [repo owner] [repo name].'
    throw err;
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

    if (!fs.existsSync("./avatars/")) {
        fs.mkdirSync("./avatars/")
    }

    if (json.message === 'Bad credentials') {
        let err = "GITHUB_TOKEN in .env is not a valid token";
        throw err;
    }

    if (json.message === 'Not Found') {
        let err = 'The provided owner/repo does not exist';
        throw err;
    }

    for (var i of json) {
        var fP = "./avatars/" + i.login + ".png";
        console.log("Getting image for ", i.login);
        downloadImageByURL(i.avatar_url, fP);
    }
});