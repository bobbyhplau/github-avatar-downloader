function checkError(msg) {

    if (msg === 'Bad credentials') {
        let err = "GITHUB_TOKEN in .env is not a valid token";
        throw err;
    }

    if (msg === 'Not Found') {
        let err = 'The provided owner/repo does not exist';
        throw err;
    }

}

module.exports.checkError = checkError;