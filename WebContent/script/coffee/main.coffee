###
ToDo list application that uses localStorage
###

paths =
  text: ['http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text']
  jQuery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min']
  jQueryUI: ['http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min']
  Underscore: ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min']
  Backbone: ['http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min']
  'Backbone.localStorage': ['http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.0/backbone.localStorage-min']

shim =
  text:
    exports: 'text'
  jQuery:
    exports: '$'
  jQueryUI:
    deps: ['jQuery']
    exports: '$'
  Underscore:
    exports: '_'
  Backbone:
    deps: ['Underscore', 'jQuery']
    exports: 'Backbone'
  'Backbone.localStorage':
    deps: ['Backbone']
    exports: 'Backbone'

requirejs.config paths: paths, shim: shim

define(
  ['jQueryUI', 'Underscore', 'TaskCollection', 'ListView', 'TaskView', 'EditTaskView'],
  ($, _, TaskCollection, ListView, TaskView, EditTaskView)->
    pubsub = window.pubsub = _.extend {}, Backbone.Events
    taskList = new TaskCollection()
    new EditTaskView collection: taskList
    new ListView el: "#taskListView", itemClass: TaskView, collection: taskList

    pubsub.on(
      "UPDATE_LIST",
      (options)->
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
    )
    $('#datePicker').datepicker(
      onSelect:(dateText, inst)->
        pubsub.trigger "UPDATE_LIST", { dateText:dateText, date:$('#datePicker').datepicker "getDate" }
      onClose:(dateText, inst)->
        if !dateText or dateText.length is 0
          pubsub.trigger "UPDATE_LIST" # publish so that task list gets refreshed with no date filter
    )
    $('#newTaskBtn').on "click", ->pubsub.trigger "SHOW_TASK_EDITOR"
    $('#showAllLink').on "click", ->pubsub.trigger "UPDATE_LIST"
    taskList.load()
    pubsub.trigger "UPDATE_LIST"
)