define([
    'Underscore',
    'Backbone',
    'TaskCollection',
    'TaskModel'
], function(_, Backbone, TaskCollection, TaskModel){

var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    STORE_KEY: "TaskList",
    localStorage: new Store(this.STORE_KEY),

    load: function(options){
        //var KEY_NAME = this.STORE_KEY;
        var KEY_NAME = "undefined"; // don't know why key gets "undefined"...
        var models = null;
        if(localStorage[KEY_NAME]){
            var arr = localStorage[KEY_NAME].split(",");
            models = _.map(arr, function(KEY){
                return JSON.parse(localStorage[KEY_NAME + "-" + KEY]);
            });
        }
        this.reset(models);
    },

    filter: function(options){
        var models = this.models;

        // filter by tag/date
        if(options){
            // currently, only particular date is supported,
            // but we may enhance it so that we can:
            // - specify both date and time
            // - specify before/after/between the specified date/time
            var targetDate = options.date;
            if(targetDate){
                models = models.filter(function(model){
                    return model.isCreatedAt(targetDate);
                });
            }else if(options.tag){
                models = models.filter(function(model){
                    return model.hasTag(options.tag);
                });
            }
        }

        return models;
    }
});

return TaskCollection;

});