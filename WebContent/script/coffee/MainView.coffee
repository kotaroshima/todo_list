define(
  ['jQueryUI', 'Underscore', 'Backbone.localStorage',
   'TaskCollection', 'ListView', 'TaskView', 'EditTaskView', 'text!template/MainView.html'],
  ($, _, Backbone, TaskCollection, ListView, TaskView, EditTaskView, viewTemplate) ->

    Backbone.View.extend
      template: _.template viewTemplate

      events:
        "click #newTaskBtn": "onNewButtonClicked"
        "click #showAllLink": "onShowAllLinkClicked"

      initialize:(options)->
        Backbone.View::initialize.apply @, arguments
        @render()

        pubsub.on "UPDATE_LIST", @onUpdateList, @

        $('#datePicker').datepicker(
          onSelect:(dateText, inst)=>
            pubsub.trigger "UPDATE_LIST", { dateText:dateText, date:$('#datePicker').datepicker "getDate" }
            return
          onClose:(dateText, inst)=>
            if !dateText or dateText.length is 0
              pubsub.trigger "UPDATE_LIST" # publish so that task list gets refreshed with no date filter
              return
        )

        taskList = new TaskCollection()
        new EditTaskView el: "#dialogContainer", collection: taskList
        new ListView el: "#taskListView", itemClass: TaskView, collection: taskList

        taskList.load()
        pubsub.trigger "UPDATE_LIST"
        return

      render:(model, value, options) ->
        @$el.html this.template()
        @

      onNewButtonClicked:->
        pubsub.trigger "SHOW_TASK_EDITOR"
        return

      onShowAllLinkClicked:->
        pubsub.trigger "UPDATE_LIST"
        return

      onUpdateList:(options)->
        hasFilter = false
        if options
          if options.tag
            title = _.template "Tasks with tag '<%= tag %>'", options
            hasFilter = true
          else if options.dateText
            title = _.template "Tasks created at '<%= dateText %>'", options
            hasFilter = true
        if hasFilter
          $('#showAllLink').css "display", "block"
        else
          $('#showAllLink').css "display", "none"
          $('#datePicker').val ""
          title = "All Tasks"
        $("#taskListTitle").text title
        return

      remove:->
        pubsub.off "UPDATE_LIST", @onUpdateList, @
        Backbone.View::remove.call @
        return
)