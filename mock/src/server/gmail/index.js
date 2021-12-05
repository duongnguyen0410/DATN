const fs = require('fs');
const path = require('path')
const readline = require('readline');
const { google } = require('googleapis');
const Base64 = require('js-base64').Base64;
const _ = require('lodash')

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
const TOKEN_PATH = path.join(__dirname, 'token.json')
//---------------------------------------\Modify/-----------------------------------------
//---------------------------------------\Modify/-----------------------------------------
//---------------------------------------\Modify/-----------------------------------------


//---------------------------------------\Execute/-----------------------------------------
//---------------------------------------\Execute/-----------------------------------------
//---------------------------------------\Execute/-----------------------------------------

/**
 * module export external to send message
 * 
 */
module.exports.send = (param) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'credentials.json'), (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            let msg = {
                To: param.To || 'giapdong991@gmail.com',
                Subject: param.Subject || 'Verify Asset',
                From: 'giapdong992@gmail.com',
                Message: param.Message || 'This is demo check finally'
            }
            let encode = _.reduce(msg, function (result, value, key) {
                if (key != 'Message')
                    result += `${key}:${value}\n`
                else result += `\n${value}\n`
                return result;
            }, '')

            authorizeSendEmail(JSON.parse(content), Base64.encode(encode))
                .then(result => {
                    // console.log('sent', result)
                    resolve(result)
                })
                .catch(error => reject(error))
            // authorizeSendEmail(JSON.parse(content), str, sendMessage);
        });
    })
}

//---------------------------------------\Function/--------------------------------------
//---------------------------------------\Function/--------------------------------------
//---------------------------------------\Function/--------------------------------------

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorizeSendEmail(credentials, email) {
    return new Promise((resolve, reject) => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client);
            oAuth2Client.setCredentials(JSON.parse(token));
            sendMessage(oAuth2Client, email).then(result => {
                resolve(result)
            })
        });
    })

}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
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
            sendMessage(oAuth2Client);
        });
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
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: 'v1', auth });

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
                reject(err)
            }
            else resolve(response)
        });
    })
}