var request = require('request');
// var auth = require('./secrets.js').GITHUB_TOKEN;
var fs = require('fs');
var result = require('dotenv').config();
var checkError = require('./check-error.js').checkError;
var getRepos = require('./get-repos.js').getRepos;

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

function downloadImageByURL(url, filePath) {

    request.get(url)
        .on('error', function(err) {
            throw err;
        })
        .pipe(fs.createWriteStream(filePath));
}

getRepos(owner, repo, function(err, result) {

    var json = JSON.parse(result);

    if (!fs.existsSync("./avatars/")) {
        fs.mkdirSync("./avatars/")
    }

    checkError(json.message);

    let jsonlength = json.length;

    for (var i of json) {
        var fP = "./avatars/" + i.login + ".png";
        console.log("Getting image for ", i.login);
        downloadImageByURL(i.avatar_url, fP);
        jsonlength--;
    }

    if (jsonlength === 0) {

        console.log("Download Complete");
    }
});