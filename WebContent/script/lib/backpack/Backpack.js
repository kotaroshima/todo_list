// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['jQuery', 'Underscore', 'Backbone', 'backpack/plugins/Subscribable'], function($, _, Backbone, Subscribable) {
    var cleanup, setup;
    setup = function(self) {
      var plugins, _ref;
      self.cleanups = [];
      plugins = [Subscribable];
      if ((_ref = self.options) != null ? _ref.plugins : void 0) {
        plugins = plugins.concat(self.options.plugins);
      }
      _.each(plugins, function(pi) {
        var key, su, td, value;
        su = pi.setup;
        td = pi.cleanup;
        for (key in pi) {
          if (!__hasProp.call(pi, key)) continue;
          value = pi[key];
          if (key !== 'setup' && key !== 'cleanup') {
            self[key] = value;
          }
        }
        if (su) {
          su.apply(self);
        }
        if (td) {
          self.cleanups.push(td);
        }
      });
    };
    cleanup = function(self) {
      _.each(self.cleanups, function(td) {
        td.apply(self);
      });
    };
    return {
      Model: Backbone.Model.extend({
        initialize: function(attributes, options) {
          Backbone.Model.prototype.initialize.apply(this, arguments);
          setup(this);
        },
        destroy: function(options) {
          cleanup(this);
          Backbone.Model.prototype.destroy.apply(this, arguments);
        }
      }),
      Collection: Backbone.Collection.extend({
        initialize: function(models, options) {
          Backbone.Collection.prototype.initialize.apply(this, arguments);
          setup(this);
        },
        destroy: function() {
          cleanup(this);
        }
      }),
      View: Backbone.View.extend({
        initialize: function(options) {
          Backbone.View.prototype.initialize.apply(this, arguments);
          setup(this);
        },
        remove: function() {
          cleanup(this);
          Backbone.View.prototype.remove.apply(this, arguments);
        }
      })
    };
  });

}).call(this);
