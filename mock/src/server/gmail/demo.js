const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
var SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
//---------------------------------------\Modify/-----------------------------------------
//---------------------------------------\Modify/-----------------------------------------
//---------------------------------------\Modify/-----------------------------------------



//---------------------------------------\Execute/-----------------------------------------
//---------------------------------------\Execute/-----------------------------------------
//---------------------------------------\Execute/-----------------------------------------

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    //authorize(JSON.parse(content), listLabels);
    var str = 'TmFtZTogTWFuYWdlcgpUbzogZ2lhcGRvbmc5OTFAZ21haWwuY29tClN1YmplY3Q6IFZlcmlmeSB5b3VyIEFzc2V0CkZyb206IGdpYXBkb25nOTkyQGdtYWlsLmNvbQoKSGksIGFkbWluIGhhcyBmaWd1cmUgeW91IHRvIG1hbmFnZXI=';
    //authorize2(JSON.parse(content),str, createDraft);
    authorizeSendEmail(JSON.parse(content), str, sendMessage);
});



//---------------------------------------\Function/--------------------------------------
//---------------------------------------\Function/--------------------------------------
//---------------------------------------\Function/--------------------------------------

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function authorize2(credentials, email, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, email);
    });
}

function authorizeSendEmail(credentials, email, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, email);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
            console.log('Labels:');
            labels.forEach((label) => {
                console.log(`- ${label.name}`);
            });
        } else {
            console.log('No labels found.');
        }
    });
}

/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getRecentEmail(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    // Only get the recent email - 'maxResults' parameter
    gmail.users.messages.list({ auth: auth, userId: 'me', maxResults: 1, }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        // Get the message id which we will need to retreive tha actual message next.
        var message_id = response['data']['messages'][0]['id'];

        // Retreive the actual message using the message id
        gmail.users.messages.get({ auth: auth, userId: 'me', 'id': message_id }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }

            console.log(response['data']);
        });
    });
}


/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function loadProfile(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    // Only get the recent email - 'maxResults' parameter
    gmail.users.getProfile({ auth: auth, userId: 'me', maxResults: 1, }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response);
    });
}

/**
 * Create Draft email.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
function createDraft(auth, email) {
    const gmail = google.gmail({ version: 'v1', auth });
    // Using the js-base64 library for encoding:
    // https://www.npmjs.com/package/js-base64
    //var base64EncodedEmail = Base64.encodeURI(email);
    var options = {
        auth: auth,
        'userId': 'me',
        'resource': {
            'message': {
                'raw': email
            }
        }
    }
    gmail.users.drafts.create(options, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response);
    });
}

/**
 * Send Message.
 *
 * @param  {google.client.OAuth2} auth User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
function sendMessage(auth, email) {
    const gmail = google.gmail({ version: 'v1', auth });
    // Using the js-base64 library for encoding:
    // https://www.npmjs.com/package/js-base64
    //var base64EncodedEmail = Base64.encodeURI(email);
    var options = {
        auth: auth,
        'userId': 'me',
        'resource': {
            'raw': email
        }
    }
    gmail.users.messages.send(options, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response);
    });

}