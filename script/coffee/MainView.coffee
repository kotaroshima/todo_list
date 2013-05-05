define(
  ['jQueryUITouchPunch', 'Backpack', 'LocalStorage', 'TaskModel', 'TaskView', 'EditTaskView', 'text!template/MainView.html'],
  ($, Backpack, LocalStorage, TaskModel, TaskView, EditTaskView, viewTemplate) ->

    Backpack.View.extend
      template: _.template viewTemplate

      events:
        'click #newTaskBtn': 'onNewButtonClicked'
        'click #showAllLink': 'onShowAllLinkClicked'

      initialize:(options)->
        Backpack.View::initialize.apply @, arguments
        @render()

        $('#datePicker').datepicker
          onSelect:(dateText, inst)->
            Backbone.trigger 'UPDATE_LIST', { dateText:dateText, date:$('#datePicker').datepicker 'getDate' }
            return
          onClose:(dateText, inst)->
            if !dateText or dateText.length is 0
              Backbone.trigger 'UPDATE_LIST' # publish so that task list gets refreshed with no date filter
              return

        taskList = new Backpack.Collection null,
          model: TaskModel
          plugins: [LocalStorage]

        new EditTaskView
          el: '#dialogContainer'
          collection: taskList
          subscribers:
            SHOW_TASK_EDITOR: 'show'

        new Backpack.ListView
          el: '#taskListView'
          itemClass: TaskView
          collection: taskList
          plugins: [Backpack.Container, Backpack.Sortable]
          subscribers:
            UPDATE_LIST: 'filterChildren'

        Backbone.trigger 'UPDATE_LIST'
        return

      render:(model, value, options) ->
        @$el.html this.template()
        @

      onNewButtonClicked:->
        Backbone.trigger 'SHOW_TASK_EDITOR'
        return

      onShowAllLinkClicked:->
        Backbone.trigger 'UPDATE_LIST'
        return

      onUpdateList:(options)->
        hasFilter = false
        if options
          if options.tag
            title = _.template 'Tasks with tag "<%= tag %>"', options
            hasFilter = true
          else if options.dateText
            title = _.template 'Tasks created at "<%= dateText %>"', options
            hasFilter = true
        if hasFilter
          $('#showAllLink').css 'display', 'block'
        else
          $('#showAllLink').css 'display', 'none'
          $('#datePicker').val ''
          title = 'All Tasks'
        $('#taskListTitle').text title
        return
)