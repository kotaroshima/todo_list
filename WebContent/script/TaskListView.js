define([
  'TaskListView',
  'TaskView'
], function(TaskListView, TaskView){

var TaskListView = Backbone.View.extend({
    el: "#taskListView",

    initialize: function(){
        this.collection.on("add remove reset", this.render, this);
        pubsub.on("UPDATE_TASK_LIST", this.render, this);
    },

    render: function(options){
        var models = this.collection.filter(options);

        $(this.el).html("");

        if(models.length>0){
            _.each(models, this.addTaskView, this);
        }else{
            $(this.el).html("No Tasks");
        }
    },

    addTaskView: function(task){
        var view = new TaskView({ model: task });
        $(this.el).append(view.render().$el);
    },

    destroy: function(){
        this.collection.off("add remove reset", this.render);
        pubsub.off("UPDATE_TASK_LIST", this.render, this);
        Backbone.View.prototype.destroy.call(this);
    }
});

return TaskListView;

});