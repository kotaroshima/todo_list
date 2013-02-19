define(
  ['jQuery', 'Underscore', 'Backbone', 'TaskListView','TaskView'],
  ($, _, Backbone, TaskListView, TaskView)->

    class TaskListView extends Backbone.View
      el: "#taskListView"

      initialize:->
        this.collection.on "add remove reset", this.render, this
        pubsub.on "UPDATE_TASK_LIST", this.render, this
        this._taskViews = []
        this

      render:(options)->
        models = this.collection.filter options
        this.clearTaskViews()
        if models.length > 0
          _.each models, this.addTaskView, this
        else
          $(this.el).html "No Tasks"
        this

      addTaskView:(task)->
        view = new TaskView(model: task)
        $(this.el).append view.render().$el
        this._taskViews.push view

      clearTaskViews:->
        for i in [this._taskViews.length-1..0] by -1
          this.removeTaskView i

      removeTaskView:(index)->
        this._taskViews[index].destroy()
        this._taskViews.splice index,1

      destroy:->
        this.collection.off "add remove reset", this.render
        pubsub.off "UPDATE_TASK_LIST", this.render, this
        Backbone.View.prototype.remove.call(this)
)