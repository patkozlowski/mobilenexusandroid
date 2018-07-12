// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_8sxqfth4:vcuj4okdm8eue4jlo8gj1nj1js@ds127730.mlab.com:27730/heroku_8sxqfth4',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  verbose: true,
  appId: process.env.APP_ID || 'mobilenexusandroid',
  masterKey: process.env.MASTER_KEY || 'mobilenexus226', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://mobilenexusandroid.herokuapp.com/parse',  // Don't forget to change to https if needed
  push: {
  android: {
    senderId: '375960484765', // The Sender ID of FCM
    apiKey: 'AIzaSyBmUuo8b4ICsPxXKWSASgDAbID1L8_xExk' // The Server API Key of FCM
    }
  },
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
