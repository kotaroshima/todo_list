define([
    'Underscore',
    'Backbone',
    'TaskModel'
], function(_, Backbone, TaskModel){

var TaskModel = Backbone.Model.extend({
    isCreatedAt: function(date){
        var d = new Date(this.get("createdAt"));
        return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
    },

    hasTag: function(tag){
        var tags = this.get("tags");
        return tags ? tags.indexOf(tag) >= 0 : false;
    }
});

return TaskModel;

});