define([
    'jQuery',
    'Underscore',
    'Backbone',
    'TaskView',
    'text!template/TaskView.html'
], function($, _, Backbone, TaskView, taskViewTemplate){

var TaskView = Backbone.View.extend({
    template: _.template(taskViewTemplate),

    events: {
        "click .editBtn": "onEditButtonClicked",
        "click .deleteBtn": "onDeleteButtonClicked"
    },

    initialize: function(){
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.remove, this);
    },

    render: function(){
        var attrs = this.model.attributes;
        var d = new Date(attrs["createdAt"]);
        attrs["formattedTime"] = _.template("<%=month%>/<%=day%>/<%=year%> <%=hours%>:<%=minutes%>", { year:d.getFullYear(), month:d.getMonth()+1, day:d.getDate(), hours:d.getHours(), minutes:d.getMinutes() });
        $(this.el).html(this.template(attrs));

        // append tag nodes
        var tagContainer = $(this.el).find(".tagContainer");
        _.each(
            attrs["tags"],
            function(tag, idx){
                if(idx > 0){ tagContainer.append("&nbsp;"); }
                var anchor = $(document.createElement("a")).prop({ href:"javascript:void(0)" }).text(tag).click(function(evt){
                    pubsub.trigger("UPDATE_TASK_LIST", { tag:tag });
                });
                tagContainer.append(anchor);
            }
        );

        return this;
    },

    onEditButtonClicked: function(){
        pubsub.trigger("SHOW_TASK_EDITOR", this.model);
    },

    onDeleteButtonClicked: function(){
        if(confirm(_.template("Are you sure you want to delete '<%=text%>'?", this.model.attributes))){
            this.model.destroy();
        }
    },
    
    destroy: function(){
        this.model.off("change", this.render);
        this.model.off("destroy", this.remove);
        Backbone.View.prototype.destroy.call(this);
    }
});

return TaskView;

});