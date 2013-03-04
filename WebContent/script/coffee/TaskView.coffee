define(
  ['jQuery', 'Underscore', 'Backbone', 'text!template/TaskView.html'],
  ($, _, Backbone, viewTemplate) ->

    Backbone.View.extend
      template: _.template viewTemplate

      events:
        "click .editBtn": "onEditButtonClicked"
        "click .deleteBtn": "onDeleteButtonClicked"

      initialize:->
        @listenTo @model, "change", @render
        @listenTo @model, "destroy", @remove
        return

      render:(model, value, options) ->
        attrs = @model.attributes
        d = new Date attrs["createdAt"]
        attrs["formattedTime"] = _.template "<%=month%>/<%=day%>/<%=year%> <%=hours%>:<%=minutes%>", { year:d.getFullYear(), month:d.getMonth()+1, day:d.getDate(), hours:d.getHours(), minutes:d.getMinutes() }
        $(@el).html @template attrs

        # append tag nodes
        tagContainer = $(@el).find ".tagContainer"
        _.each(
          attrs["tags"],
          (tag, idx) ->
            if idx > 0 then tagContainer.append "&nbsp;"
            anchor = $(document.createElement("a")).prop(href:"javascript:void(0)").text(tag).click((evt)->
              pubsub.trigger "UPDATE_TASK_LIST", { tag:tag }
            )
            tagContainer.append anchor
        )
        @

      onEditButtonClicked:->
        pubsub.trigger "SHOW_TASK_EDITOR", @model
        return

      onDeleteButtonClicked:->
        if confirm _.template "Are you sure you want to delete '<%=text%>'?", @model.attributes
          @model.destroy()
        return

      destroy:->
        @stopListening @model
        Backbone.View::remove.call @
        return
)