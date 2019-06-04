var request = require('request');

var result = require('dotenv').config();

if (result.error) {
    let err = 'Missing .env file';
    throw err;
}

if (process.env.GITHUB_TOKEN === undefined) {
    let err = 'Missing GITHUB_TOKEN in .env';
    throw err;
}

function getRepos(repoOwner, repoName, cb) {

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

module.exports.getRepos = getRepos;