var checkError = require('./check-error.js').checkError;
var getRepos = require('./get-repos.js').getRepos;
var request = require('request');

require('dotenv').config();

var owner = process.argv[2];
var repo = process.argv[3];

if (process.argv.length != 4) {
    let err = 'This program takes exactly 2 arguments, use node recommend-repos.js [repo owner] [repo name].'
    throw err;
}

var countedObj = {};

const getRepoNames = function(err, arr) {

    let json = JSON.parse(arr)

    for (let i of json) {
        if (countedObj[i.id]) {
            countedObj[i.id].count++;
        } else {
            countedObj[i.id] = {};
            countedObj[i.id].name = i.name;
            countedObj[i.id].owner = i.owner.login;
            countedObj[i.id].count = 1;
        }
    }
    console.log(countedObj);
}

var getStarURL = function(url, cb) {

    const realURL = url.substring(0, url.length - 15);

    const options = {
        url: realURL,
        headers: {
            'User-Agent': 'request',
            'Authorization': "token " + process.env.GITHUB_TOKEN
        }
    };

    request(options, function(err, res, body) {
        cb(err, body);
    });
}

getRepos(owner, repo, function(err, result) {

    let json = JSON.parse(result);

    checkError(json.message);

    for (let i of json) {
        getStarURL(i.starred_url, getRepoNames);
    }

});