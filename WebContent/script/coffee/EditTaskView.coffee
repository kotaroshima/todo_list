define(
  ['jQuery','Underscore','Backbone.localStorage','EditTaskView','TaskModel','text!template/EditTaskView.html'],
  ($, _, Backbone, EditTaskView, TaskModel, editTaskViewTemplate)->

    class EditTaskView extends Backbone.View
      el: "#dialogContainer"

      template: _.template(editTaskViewTemplate)

      events:
        "click #saveTaskBtn": "onSaveButtonClicked"
        "click #cancelTaskBtn": "onCancelButtonClicked"

      initialize:->
        pubsub.on "SHOW_TASK_EDITOR", this.show, this

      render:->
        attrs = if this._model then this._model.attributes else { text:"" }
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
        $(this.el).html this.template(attrs)
        this

      show:(model)->
        title = if model then "Edit Task" else "Create New Task"
        this._model = model
        this.render().$el.dialog(
          title: title,
          width: 600,
          height: 300
        )

      onSaveButtonClicked:->
        tagArr = _.chain($("#tagField").val().split(",")).map($.trim).reject(
          (tag)->
            !tag or tag.length is 0
        ).value()
        prop =
          text: $("#newTaskTextField").val()
          tags: tagArr
        if this._model
          # edit
          task = this._model
          task.set prop
        else
          # add new
          prop["createdAt"] = new Date().getTime()
          task = new TaskModel prop
          this.collection.add task
        task.save()
  
        this._model = null
        $(this.el).dialog 'close'
      
      onCancelButtonClicked:->
        this._model = null
        $(this.el).dialog 'close'
  
      destroy:->
        pubsub.off "SHOW_TASK_EDITOR", this.show
        Backbone.View.prototype.remove.call(this)
)