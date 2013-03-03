define(
  ['jQuery', 'Underscore', 'Backbone.localStorage', 'TaskModel', 'text!template/EditTaskView.html'],
  ($, _, Backbone, TaskModel, viewTemplate)->

    Backbone.View.extend
      el: "#dialogContainer"

      template: _.template viewTemplate

      events:
        "click #saveTaskBtn": "onSaveButtonClicked"
        "click #cancelTaskBtn": "onCancelButtonClicked"

      initialize:->
        pubsub.on "SHOW_TASK_EDITOR", this.show, this

      render:->
        attrs = if @_model then @_model.attributes else { text:"" }
        # generate a comma-separated string from an array
        attrs["tagStr"] = _.reduce(
          attrs["tags"],
          (memo, tag, idx)->
            if idx > 0 then memo += ", "
            memo += tag
            memo
          ,
          ""
        )
        $(@el).html this.template attrs
        this

      show:(model)->
        title = if model then "Edit Task" else "Create New Task"
        @_model = model
        this.render().$el.dialog(
          title: title,
          width: 600,
          height: 300
        )
        return

      onSaveButtonClicked:->
        tagArr = _.chain($("#tagField").val().split(",")).map($.trim).reject(
          (tag)->
            !tag or tag.length is 0
        ).value()
        prop =
          text: $("#newTaskTextField").val()
          tags: tagArr
        if @_model
          # edit
          task = @_model
          task.set prop
        else
          # add new
          prop["createdAt"] = new Date().getTime()
          task = new TaskModel prop
          @collection.add task
        task.save()
  
        @_model = null
        $(@el).dialog 'close'
        return
      
      onCancelButtonClicked:->
        @_model = null
        $(@el).dialog 'close'
        return
  
      destroy:->
        pubsub.off "SHOW_TASK_EDITOR", this.show
        Backbone.View::remove.call this
        return
)