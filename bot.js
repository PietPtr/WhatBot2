// Create the configuration

var config = {
	channels: ["#pietsbottest"],
	server: "irc.freenode.net",
	clientName: "WhatBot",
	debug: true,
	autoRejoin: false,
	autoConnect: true
};

// Get the lib
var irc = require("irc");
var fs = require("fs");
var date = new Date();
var botlisteners = require('./botlisteners');

var myAdmin = "Pietdagamer"

// Create the client name
var client = new irc.Client(config.server, config.clientName, config, {
	channels: config.channels
});

client.addListener('pm', function(nick, text, message) {
  if(nick == myAdmin && text == "reload") {
    
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

client.on('message', function(nick, to, text, message) {
  console.log("[" + to + "] " + nick + ": " + text);
});

client.connect(function() {
  // Attach the listeners
  botlisteners.load(client);
});