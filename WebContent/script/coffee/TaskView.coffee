define(
  ['jQuery','Underscore','Backbone','TaskView','text!template/TaskView.html'],
  ($, _, Backbone, TaskView, taskViewTemplate) ->

    class TaskView extends Backbone.View
      template: _.template(taskViewTemplate)

      events:
        "click .editBtn": "onEditButtonClicked"
        "click .deleteBtn": "onDeleteButtonClicked"

      initialize:->
        this.listenTo this.model, "change", this.render
        this.listenTo this.model, "destroy", this.remove

      render:(model, value, options) ->
        attrs = this.model.attributes
        d = new Date attrs["createdAt"]
        attrs["formattedTime"] = _.template("<%=month%>/<%=day%>/<%=year%> <%=hours%>:<%=minutes%>", { year:d.getFullYear(), month:d.getMonth()+1, day:d.getDate(), hours:d.getHours(), minutes:d.getMinutes() })
        $(this.el).html this.template(attrs)

        # append tag nodes
        tagContainer = $(this.el).find ".tagContainer"
        _.each(
          attrs["tags"],
          (tag, idx) ->
            if idx > 0 then tagContainer.append "&nbsp;"
            anchor = $(document.createElement("a")).prop(href:"javascript:void(0)").text(tag).click((evt)->
              pubsub.trigger "UPDATE_TASK_LIST", { tag:tag }
            )
            tagContainer.append anchor
        )
        this

      onEditButtonClicked:->
        pubsub.trigger "SHOW_TASK_EDITOR", this.model

      onDeleteButtonClicked:->
        if confirm(_.template("Are you sure you want to delete '<%=text%>'?", this.model.attributes))
          this.model.destroy()

      destroy:->
        this.stopListening this.model
        Backbone.View.prototype.remove.call(this)
)