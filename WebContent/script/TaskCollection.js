// Generated by CoffeeScript 1.4.0
(function() {

  define(['Underscore', 'Backbone.localStorage', 'TaskModel'], function(_, Backbone, TaskModel) {
    return Backbone.Collection.extend({
      model: TaskModel,
      STORE_KEY: "TaskList",
      localStorage: new Store(this.STORE_KEY),
      load: function(options) {
        var KEY_NAME, arr, models;
        KEY_NAME = "undefined";
        if (localStorage[KEY_NAME]) {
          arr = localStorage[KEY_NAME].split(",");
          models = _.map(arr, function(KEY) {
            return JSON.parse(localStorage[KEY_NAME + "-" + KEY]);
          });
        }
        this.reset(models);
      },
      filter: function(options) {
        var models, targetDate;
        models = this.models;
        if (options) {
          targetDate = options.date;
          if (targetDate) {
            models = models.filter(function(model) {
              return model.isCreatedAt(targetDate);
            });
          } else if (options.tag) {
            models = models.filter(function(model) {
              return model.hasTag(options.tag);
            });
          }
        }
        return models;
      }
    });
  });

}).call(this);