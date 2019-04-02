const rp = require('request-promise');
const validUrl = require('valid-url');
const cheerio = require('cheerio');
const args = process.argv.slice(2);

// Check if help flag
if (args.includes('-h') || args.includes('-help')  || process.argv.length < 4 ) {
    console.log('Usage: node search-web.js <url> <search word> \n');
}

// Validate second param as url
const url = args[0];
const needle = args[1];
if (!validUrl.isUri(url)){
    console.log('Please enter a valid URL. \n');
    return;
}

const params = {
    uri: url,
    transform: function (body) {
        return cheerio.load(body);
    }
}

rp(params)
    .then(function (data) {
        const bodyText = data.text();
        const matches = bodyText.match(new RegExp(needle, 'g')) || [];
        var count = matches.length;
        console.log("There are " + count + ((count > 1 || count === 0) ? " occurrences " : " occurrence ") + "of '" + needle + "' on " + url + "\n");
    })
    .catch(function (err) {
        console.log('Unable to load the provided URL.\n');
    });

