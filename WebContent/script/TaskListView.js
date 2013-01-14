define([
  'TaskListView',
  'TaskView'
], function(TaskListView, TaskView){

var TaskListView = Backbone.View.extend({
    el: "#taskListView",

    initialize: function(){
        this.collection.on("add remove reset", this.render, this);
        pubsub.on("UPDATE_TASK_LIST", this.render, this);
        this._taskViews = [];
    },

    render: function(options){
        var models = this.collection.filter(options);

        this.clearTaskViews();

        if(models.length>0){
            _.each(models, this.addTaskView, this);
        }else{
            $(this.el).html("No Tasks");
        }
    },

    addTaskView: function(task){
        var view = new TaskView({ model: task });
        $(this.el).append(view.render().$el);
        this._taskViews.push(view);
    },

    clearTaskViews: function(){
        for(var i=this._taskViews.length-1; i>=0; i--){
            this.removeTaskView(i);
        }
    },

    removeTaskView: function(index){
        this._taskViews[index].destroy();
        this._taskViews.splice(index,1);
    },

    destroy: function(){
        this.collection.off("add remove reset", this.render);
        pubsub.off("UPDATE_TASK_LIST", this.render, this);
        Backbone.View.prototype.remove.call(this);
    }
});

return TaskListView;

});