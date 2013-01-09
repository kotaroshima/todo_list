define([
    'jQuery',
    'Underscore',
    'Backbone.localStorage',
    'EditTaskView',
    'TaskModel',
    'text!template/EditTaskView.html'
], function($, _, Backbone, EditTaskView, TaskModel, editTaskViewTemplate){

var EditTaskView = Backbone.View.extend({
    el: "#dialogContainer",

    template: _.template(editTaskViewTemplate),

    events: {
        "click #saveTaskBtn": "onSaveButtonClicked",
        "click #cancelTaskBtn": "onCancelButtonClicked"
    },
            
    initialize: function(){
        pubsub.on("SHOW_TASK_EDITOR", this.show, this);
    },

    render: function(){
        var attrs = this._model ? this._model.attributes : { text:"" };

        // generate a comma-separated string from an array
        attrs["tagStr"] = _.reduce(
            attrs["tags"],
            function(memo, tag, idx){
                if(idx > 0){ memo += ", "; }
                memo += tag;
                return memo;
            },
            ""
        );

        $(this.el).html(this.template(attrs));
        return this;
    },

    show: function(model){
        var title = model ? "Edit Task" : "Create New Task";
        this._model = model;
        this.render().$el.dialog({
            title: title,
            width: 600,
            height: 300
        });
    },

    onSaveButtonClicked: function(){
        var tagArr = _.chain($("#tagField").val().split(",")).map($.trim).reject(function(tag){ return !tag || tag.length===0; }).value();
        var prop = { text: $("#newTaskTextField").val(), tags: tagArr };

        var task = null;
        if (this._model){
            // edit
            task = this._model;
            task.save(prop);
        }else{
            // add new
            prop["createdAt"] = new Date().getTime();
            task = new TaskModel(prop);
            this.collection.add(task);
            task.save();
        }

        this._model = null;
        $(this.el).dialog('close');
    },
    
    onCancelButtonClicked: function(){
        this._model = null;
        $(this.el).dialog('close');
    },

    destroy: function(){
        pubsub.off("SHOW_TASK_EDITOR", this.show);
        Backbone.View.prototype.destroy.call(this);
    }
});

return EditTaskView;

});