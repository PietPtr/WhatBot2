
var irc = require('irc');

var botlisteners = require('./botlisteners');

var server = 'irc.freenode.net';
var myNick = 'WhatBot';
var channels = ['#pietsbottest'];

var adminFull = ['Pietdagamer', 'Pietdagamer[2]', 'Pietdagamer[3]', 'theSpiked'];

var client = new irc.Client(server, myNick, {
		channels: channels
	, autoRejoin: false
	, autoConnect: false
	, debug: true
	, userName: myNick
	, realName: myNick
});

client.addListener('pm', function(nick, text, message) {
	if(adminFull.indexOf(nick) != -1 && text == "reload") {
		
		// Unload all listeners
		botlisteners.unload(client);

		// Purge the cache and reload the module
		delete require.cache[require.resolve('./botlisteners')];
		botlisteners = require('./botlisteners');

		// Attach the listeners
		botlisteners.load(client);

		client.say(nick, "reload complete");
	}
});

client.on("notice", function(nick, to, text, message) {
	if (nick == "nickserv") {
		client.say("nickserv", "identify clientpassword")
	}
});

client.addListener('error', function(message) {
	console.log('error: ', message);
});

client.connect(function() {
	// Attach the listeners
	botlisteners.load(client);
});
