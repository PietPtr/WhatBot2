
var modules = [
    'whatbot-help',
    'whatbot-quote'
];

var BotListeners = function() {
  var self = this;
  self._modules = {};

  /**
   * Unloads all listeners
  */
  self.unload = function(client) {
    modules.forEach(function(module) {
      if(self._modules[module]) {
        self._modules[module].unload(client);

        delete require.cache[require.resolve(module)];
      }
    });
  };

  /**
   * Loads all listeners
  */
  self.load = function(client) {
    modules.forEach(function(module) {
      self._modules[module] = require(module);
      self._modules[module].load(client);
    });
  };
};

module.exports = new BotListeners();