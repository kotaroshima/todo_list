// Generated by CoffeeScript 1.4.0

/*
ToDo list application that uses localStorage
*/


(function() {
  var paths, shim;

  paths = {
    text: ['http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text'],
    jQuery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min'],
    jQueryUI: ['http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min'],
    jQueryUITouchPunch: ['http://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.2/jquery.ui.touch-punch.min'],
    Underscore: ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min'],
    Backbone: ['http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min'],
    'Backbone.localStorage': ['http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.0/backbone.localStorage-min']
  };

  shim = {
    text: {
      exports: 'text'
    },
    jQuery: {
      exports: '$'
    },
    jQueryUI: {
      deps: ['jQuery'],
      exports: '$'
    },
    jQueryUITouchPunch: {
      deps: ['jQuery', 'jQueryUI'],
      exports: '$'
    },
    Underscore: {
      exports: '_'
    },
    Backbone: {
      deps: ['Underscore', 'jQuery'],
      exports: 'Backbone'
    },
    'Backbone.localStorage': {
      deps: ['Backbone'],
      exports: 'Backbone'
    }
  };

  requirejs.config({
    paths: paths,
    shim: shim
  });

  define(['jQueryUI', 'Underscore', 'TaskCollection', 'ListView', 'TaskView', 'EditTaskView'], function($, _, TaskCollection, ListView, TaskView, EditTaskView) {
    var pubsub, taskList;
    pubsub = window.pubsub = _.extend({}, Backbone.Events);
    taskList = new TaskCollection();
    new EditTaskView({
      collection: taskList
    });
    new ListView({
      el: "#taskListView",
      itemClass: TaskView,
      collection: taskList
    });
    pubsub.on("UPDATE_LIST", function(options) {
      var hasFilter, title;
      hasFilter = false;
      if (options) {
        if (options.tag) {
          title = _.template("Tasks with tag '<%= tag %>'", options);
          hasFilter = true;
        } else if (options.dateText) {
          title = _.template("Tasks created at '<%= dateText %>'", options);
          hasFilter = true;
        }
      }
      if (hasFilter) {
        $('#showAllLink').css("display", "block");
      } else {
        $('#showAllLink').css("display", "none");
        $('#datePicker').val("");
        title = "All Tasks";
      }
      return $("#taskListTitle").text(title);
    });
    $('#datePicker').datepicker({
      onSelect: function(dateText, inst) {
        return pubsub.trigger("UPDATE_LIST", {
          dateText: dateText,
          date: $('#datePicker').datepicker("getDate")
        });
      },
      onClose: function(dateText, inst) {
        if (!dateText || dateText.length === 0) {
          return pubsub.trigger("UPDATE_LIST");
        }
      }
    });
    $('#newTaskBtn').on("click", function() {
      return pubsub.trigger("SHOW_TASK_EDITOR");
    });
    $('#showAllLink').on("click", function() {
      return pubsub.trigger("UPDATE_LIST");
    });
    taskList.load();
    return pubsub.trigger("UPDATE_LIST");
  });

}).call(this);
