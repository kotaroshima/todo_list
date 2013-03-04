define(
  ['jQuery', 'Underscore', 'Backbone', 'TaskView'],
  ($, _, Backbone, TaskView)->

    Backbone.View.extend
      el: "#taskListView"

      initialize:->
        @collection.on "add remove reset", @render, @
        pubsub.on "UPDATE_TASK_LIST", @render, @
        @_taskViews = []
        return

      render:(options)->
        models = @collection.filter options
        @clearTaskViews()
        if models.length > 0
          _.each models, @addTaskView, @
        else
          $(@el).html "No Tasks"
        @

      addTaskView:(task)->
        view = new TaskView model: task
        $(@el).append view.render().$el
        @_taskViews.push view
        return

      clearTaskViews:->
        for i in [@_taskViews.length-1..0] by -1
          @removeTaskView i
        return

      removeTaskView:(index)->
        @_taskViews[index].destroy()
        @_taskViews.splice index,1
        return

      destroy:->
        @collection.off "add remove reset", @render
        pubsub.off "UPDATE_TASK_LIST", @render, @
        Backbone.View::remove.call @
        return
)