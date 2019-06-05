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
var reposToProcess = 0;

const makeString = function(obj) {
    let objArr = Object.keys(obj);

    objArr.sort((a, b) => (countedObj[b].count - countedObj[a].count))

    let toPrint = "";

    for (let i = 0; i < 5; i++) {
        toPrint += `[ ${countedObj[objArr[i]].count} stars ] ${objArr[i]}\n`;
    }

    toPrint = toPrint.substring(0, toPrint.length - 1);

    return toPrint;
}

const getRepoNames = function(err, arr) {

    let json = JSON.parse(arr)

    for (let i of json) {
        if (countedObj[i.full_name]) {
            countedObj[i.full_name].count++;
        } else {
            countedObj[i.full_name] = {};
            countedObj[i.full_name].count = 1;
        }
    }
    reposToProcess--;
    if (reposToProcess === 0) {
        console.log(makeString(countedObj));
    }
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
    reposToProcess = json.length;

    for (let i of json) {
        getStarURL(i.starred_url, getRepoNames);
    }

});