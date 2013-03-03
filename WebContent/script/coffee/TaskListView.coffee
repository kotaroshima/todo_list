define(
  ['jQuery', 'Underscore', 'Backbone', 'TaskView'],
  ($, _, Backbone, TaskView)->

    Backbone.View.extend
      el: "#taskListView"

      initialize:->
        @collection.on "add remove reset", this.render, this
        pubsub.on "UPDATE_TASK_LIST", this.render, this
        @_taskViews = []
        return

      render:(options)->
        models = @collection.filter options
        this.clearTaskViews()
        if models.length > 0
          _.each models, this.addTaskView, this
        else
          $(@el).html "No Tasks"
        this

      addTaskView:(task)->
        view = new TaskView model: task
        $(@el).append view.render().$el
        @_taskViews.push view
        return

      clearTaskViews:->
        for i in [@_taskViews.length-1..0] by -1
          this.removeTaskView i
        return

      removeTaskView:(index)->
        @_taskViews[index].destroy()
        @_taskViews.splice index,1
        return

      destroy:->
        @collection.off "add remove reset", this.render
        pubsub.off "UPDATE_TASK_LIST", this.render, this
        Backbone.View::remove.call this
        return
)